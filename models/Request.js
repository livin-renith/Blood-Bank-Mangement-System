const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    default: 'General Ward'
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  componentType: {
    type: String,
    default: 'Packed RBCs'
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  priority: {
    type: String,
    enum: ['Emergency', 'Urgent', 'Routine'],
    default: 'Routine'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  requiredByDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  allocatedUnits: [{
    type: String
  }],
  actionHistory: [{
    action: String,
    by: String,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('BloodRequest', requestSchema);
