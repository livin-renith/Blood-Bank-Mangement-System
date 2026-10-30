const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Log = require('../models/Log');

// Summary of blood inventory by group + top metrics
router.get('/summary', async (req, res) => {
  try {
    const totalUnits = await Inventory.countDocuments({ status: { $ne: 'Discarded' } });
    const testedApproved = await Inventory.countDocuments({ status: 'Available' });
    const quarantineTesting = await Inventory.countDocuments({ status: 'Testing' });
    
    // Expiring within 3 days
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const expiringSoon = await Inventory.countDocuments({
      status: { $in: ['Available', 'Expiring Soon'] },
      expiryDate: { $lte: threeDaysFromNow }
    });

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const groupSummary = [];

    for (const bg of bloodGroups) {
      const count = await Inventory.countDocuments({ bloodGroup: bg, status: { $ne: 'Discarded' } });
      let status = 'Optimal';
      if (count < 10) status = 'Critical';
      else if (count < 25) status = 'Low';

      groupSummary.push({
        bloodGroup: bg,
        count,
        status
      });
    }

    res.json({
      success: true,
      metrics: {
        totalUnits,
        testedApproved,
        quarantineTesting,
        expiringSoon
      },
      groupSummary
    });
  } catch (err) {
    console.error('Inventory summary error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory summary' });
  }
});

// List inventory with filters
router.get('/', async (req, res) => {
  try {
    const { search, bloodGroup, componentType, status } = req.query;
    const query = { status: { $ne: 'Discarded' } };

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { unitId: { $regex: s, $options: 'i' } },
        { storageLocation: { $regex: s, $options: 'i' } },
        { donorId: { $regex: s, $options: 'i' } }
      ];
    }

    if (bloodGroup && bloodGroup.trim()) {
      query.bloodGroup = bloodGroup.trim();
    }

    if (componentType && componentType.trim()) {
      const c = componentType.toLowerCase();
      if (c === 'whole') query.componentType = 'Whole Blood';
      else if (c === 'rbc') query.componentType = 'Red Blood Cells';
      else if (c === 'platelets') query.componentType = 'Platelets';
      else if (c === 'plasma') query.componentType = 'Plasma, Fresh Frozen';
      else query.componentType = componentType;
    }

    if (status && status.trim()) {
      const s = status.toLowerCase();
      if (s === 'available') query.status = 'Available';
      else if (s === 'testing') query.status = 'Testing';
      else if (s === 'reserved') query.status = 'Reserved';
      else if (s === 'expired') query.status = { $in: ['Expiring Soon', 'Expired'] };
      else query.status = status;
    }

    const units = await Inventory.find(query).sort({ expiryDate: 1 });
    res.json({ success: true, count: units.length, units });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory units' });
  }
});

// Add new unit
router.post('/', async (req, res) => {
  try {
    const { bloodGroup, componentType, collectionDate, expiryDate, storageLocation, status, donorId } = req.body;

    if (!bloodGroup || !componentType) {
      return res.status(400).json({ error: 'Blood group and component type are required' });
    }

    const count = await Inventory.countDocuments();
    const unitId = `BLD-${98420 + count + 1}`;

    const now = Date.now();
    const colDate = collectionDate ? new Date(collectionDate) : new Date(now);
    // Default shelf life: RBC: 35 days, Platelets: 5 days, Plasma: 365 days, Whole: 35 days
    let expDate;
    if (expiryDate) {
      expDate = new Date(expiryDate);
    } else {
      if (componentType === 'Platelets') expDate = new Date(colDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      else if (componentType.includes('Plasma')) expDate = new Date(colDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      else expDate = new Date(colDate.getTime() + 35 * 24 * 60 * 60 * 1000);
    }

    const unit = await Inventory.create({
      unitId,
      bloodGroup,
      componentType,
      collectionDate: colDate,
      expiryDate: expDate,
      storageLocation: storageLocation || 'Freezer A - Shelf 1',
      status: status || 'Available',
      donorId: donorId || ''
    });

    await Log.create({
      action: 'UNIT_ADDED',
      category: 'INVENTORY',
      details: `New blood unit registered: ${unit.unitId} (${unit.bloodGroup} ${unit.componentType})`
    });

    res.status(201).json({ success: true, unit });
  } catch (err) {
    console.error('Add unit error:', err);
    res.status(500).json({ error: 'Failed to add inventory unit' });
  }
});

// Update unit
router.put('/:id', async (req, res) => {
  try {
    const unit = await Inventory.findOneAndUpdate(
      { $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { unitId: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json({ success: true, unit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

// Discard unit
router.delete('/:id', async (req, res) => {
  try {
    const unit = await Inventory.findOneAndUpdate(
      { $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { unitId: req.params.id }] },
      { status: 'Discarded' },
      { new: true }
    );
    if (!unit) return res.status(404).json({ error: 'Unit not found' });

    await Log.create({
      action: 'UNIT_DISCARDED',
      category: 'INVENTORY',
      details: `Blood unit discarded: ${unit.unitId} (${unit.bloodGroup})`
    });

    res.json({ success: true, message: 'Unit discarded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to discard unit' });
  }
});

module.exports = router;
