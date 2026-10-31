const mongoose = require('mongoose');
const dns = require('dns');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure reliable SRV DNS resolution for MongoDB Atlas on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported in environment
}

let mongodProcess = null;

async function tryConnect(uri, timeoutMs = 2500) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function startLocalMongod() {
  const dbPath = path.join(__dirname, '..', 'data', 'db');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // Paths where mongod might be installed on Windows
  const candidatePaths = [
    'mongod',
    'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe'
  ];

  let mongodBin = 'mongod';
  for (const p of candidatePaths) {
    if (p === 'mongod') {
      try {
        execSync('mongod --version', { stdio: 'ignore' });
        mongodBin = 'mongod';
        break;
      } catch (e) { }
    } else if (fs.existsSync(p)) {
      mongodBin = p;
      break;
    }
  }

  console.log(`Starting MongoDB server daemon using: ${mongodBin}`);
  mongodProcess = spawn(mongodBin, ['--dbpath', dbPath, '--bind_ip', '127.0.0.1', '--port', '27017'], {
    stdio: 'ignore',
    windowsHide: true
  });

  mongodProcess.on('error', (err) => {
    console.error('Failed to spawn mongod process:', err.message);
  });

  // Keep alive hooks
  process.on('exit', () => {
    if (mongodProcess && !mongodProcess.killed) mongodProcess.kill();
  });
  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit());

  // Wait up to 10 seconds for it to start listening
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const result = await tryConnect('mongodb://127.0.0.1:27017/lifeflow_bloodbank', 1000);
    if (result.success) {
      console.log('Successfully connected to spawned MongoDB instance on port 27017.');
      return true;
    }
  }
  return false;
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeflow_bloodbank';
  const isRemote = uri.startsWith('mongodb+srv://') || (!uri.includes('127.0.0.1') && !uri.includes('localhost'));

  // Safe logging: mask username/password in console output
  const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log(`Connecting to MongoDB at: ${maskedUri}`);

  // Use a longer timeout for cloud/Atlas connections
  const timeoutMs = isRemote ? 10000 : 2500;
  const initialResult = await tryConnect(uri, timeoutMs);

  if (initialResult.success) {
    console.log('MongoDB connected successfully!');
    return;
  }

  if (isRemote) {
    console.error('Failed to connect to MongoDB Atlas cluster:', initialResult.error);
    console.error('Please verify:');
    console.error(' 1. Your IP address is added to the IP Access List (Network Access -> 0.0.0.0/0 in MongoDB Atlas).');
    console.error(' 2. Your database username and password in .env are correct.');
    return;
  }

  console.warn('Initial connection to local MongoDB failed. Attempting to start local MongoDB daemon...');
  const daemonOk = await startLocalMongod();
  if (!daemonOk) {
    console.error('Failed to automatically launch or connect to local MongoDB. Please make sure MongoDB service is running.');
  }
};

module.exports = connectDB;
