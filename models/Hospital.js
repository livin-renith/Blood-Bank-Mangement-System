const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'Level III Tertiary'
  },
  region: {
    type: String,
    default: 'Central Metro'
  },
  contactPerson: {
    type: String,
    default: ''
  },
  emergencyPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  complianceRate: {
    type: String,
    default: '99.5%'
  },
  activeRequests: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
