const mongoose = require('mongoose');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let mongodProcess = null;

async function tryConnect(uri, timeoutMs = 2500) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    return true;
  } catch (err) {
    return false;
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
      } catch (e) {}
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
    const connected = await tryConnect('mongodb://127.0.0.1:27017/lifeflow_bloodbank', 1000);
    if (connected) {
      console.log('Successfully connected to spawned MongoDB instance on port 27017.');
      return true;
    }
  }
  return false;
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeflow_bloodbank';
  console.log(`Connecting to MongoDB at: ${uri}`);

  const initialOk = await tryConnect(uri, 2500);
  if (initialOk) {
    console.log('MongoDB connected successfully!');
    return;
  }

  console.warn('Initial connection to MongoDB failed. Attempting to start local MongoDB daemon...');
  const daemonOk = await startLocalMongod();
  if (!daemonOk) {
    console.error('Failed to automatically launch or connect to local MongoDB. Please make sure MongoDB service is running.');
  }
};

module.exports = connectDB;
