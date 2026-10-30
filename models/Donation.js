const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  },
  donorName: {
    type: String,
    required: true
  },
  donorCode: {
    type: String,
    default: ''
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  volumeMl: {
    type: Number,
    default: 450
  },
  collectionCenter: {
    type: String,
    default: 'Downtown Main Center'
  },
  vitalSigns: {
    bloodPressure: { type: String, default: '120/80 mmHg' },
    hemoglobin: { type: String, default: '13.5 g/dL' },
    temperature: { type: String, default: '98.6 °F' }
  },
  testingStatus: {
    type: String,
    enum: ['Passed', 'Pending', 'Failed'],
    default: 'Passed'
  },
  staffNotes: {
    type: String,
    default: ''
  },
  donationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);
