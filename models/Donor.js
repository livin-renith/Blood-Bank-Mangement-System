const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  donorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  eligibilityStatus: {
    type: String,
    enum: ['Eligible', 'Deferred', 'Temporary Hold', 'Hold', 'Permanent Hold'],
    default: 'Eligible'
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    default: ''
  },
  clinicalNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

donorSchema.index({ fullName: 'text', phone: 'text', donorId: 'text' });

module.exports = mongoose.model('Donor', donorSchema);
