const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  componentType: {
    type: String,
    required: true,
    enum: ['Red Blood Cells', 'Platelets', 'Plasma, Fresh Frozen', 'Whole Blood']
  },
  collectionDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  storageLocation: {
    type: String,
    default: 'Freezer A - Shelf 1'
  },
  status: {
    type: String,
    enum: ['Available', 'Testing', 'Reserved', 'Expiring Soon', 'Expired', 'Discarded'],
    default: 'Available'
  },
  donorId: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
