const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['DONOR', 'DONATION', 'INVENTORY', 'REQUEST', 'HOSPITAL', 'AUTH', 'SYSTEM'],
    default: 'SYSTEM'
  },
  performedBy: {
    type: String,
    default: 'System Administrator'
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
