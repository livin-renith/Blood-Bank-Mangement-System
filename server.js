require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/reports', require('./routes/reports'));

// Friendly HTML Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(['/donors', '/donor-management'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donors.html'));
});

app.get(['/inventory', '/blood-inventory'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
});

app.get(['/requests', '/blood-requests'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'requests.html'));
});

app.get('/donations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donations.html'));
});

app.get('/hospitals', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hospitals.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reports.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get(['/password-reset', '/forgot-password'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'password-reset.html'));
});

// Fallback for SPA/direct navigation
app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  LifeFlow Blood Bank Management System`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  Database: MongoDB (lifeflow_bloodbank)`);
  console.log(`====================================================`);
});

module.exports = app;
