const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const Log = require('../models/Log');

// Get donor stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Donor.countDocuments();
    const eligible = await Donor.countDocuments({ eligibilityStatus: 'Eligible' });
    const deferred = await Donor.countDocuments({ eligibilityStatus: 'Deferred' });
    const critical = await Donor.countDocuments({ eligibilityStatus: { $in: ['Temporary Hold', 'Hold', 'Permanent Hold'] } });

    res.json({
      success: true,
      stats: {
        total,
        eligible,
        deferred,
        critical
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donor stats' });
  }
});

// List donors with search and filters
router.get('/', async (req, res) => {
  try {
    const { search, bloodGroup, status } = req.query;
    const query = {};

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { fullName: { $regex: s, $options: 'i' } },
        { donorId: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } }
      ];
    }

    if (bloodGroup && bloodGroup.trim()) {
      query.bloodGroup = bloodGroup.trim();
    }

    if (status && status.trim()) {
      if (status.toLowerCase() === 'eligible') query.eligibilityStatus = 'Eligible';
      else if (status.toLowerCase() === 'deferred') query.eligibilityStatus = 'Deferred';
      else if (status.toLowerCase() === 'hold') query.eligibilityStatus = { $in: ['Temporary Hold', 'Hold', 'Permanent Hold'] };
      else query.eligibilityStatus = status;
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: donors.length, donors });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Get single donor
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { donorId: req.params.id }]
    });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
});

// Create new donor
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, bloodGroup, eligibilityStatus, address, clinicalNotes } = req.body;

    if (!fullName || !phone || !bloodGroup) {
      return res.status(400).json({ error: 'Full name, phone, and blood group are required' });
    }

    // Generate unique donorId: LF-XXXXX
    const count = await Donor.countDocuments();
    const donorId = `LF-${89200 + count + 1}`;

    const donor = await Donor.create({
      donorId,
      fullName: fullName.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      bloodGroup,
      eligibilityStatus: eligibilityStatus || 'Eligible',
      address: address ? address.trim() : '',
      clinicalNotes: clinicalNotes ? clinicalNotes.trim() : '',
      totalDonations: 0
    });

    await Log.create({
      action: 'DONOR_CREATED',
      category: 'DONOR',
      details: `New donor registered: ${donor.fullName} (${donor.bloodGroup}) - ID: ${donor.donorId}`
    });

    res.status(201).json({ success: true, donor });
  } catch (err) {
    console.error('Create donor error:', err);
    res.status(500).json({ error: 'Failed to create donor' });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { donorId: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!donor) return res.status(404).json({ error: 'Donor not found' });

    await Log.create({
      action: 'DONOR_UPDATED',
      category: 'DONOR',
      details: `Updated donor record: ${donor.fullName} - ID: ${donor.donorId}`
    });

    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update donor' });
  }
});

// Delete donor
router.delete('/:id', async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { donorId: req.params.id }]
    });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });

    await Log.create({
      action: 'DONOR_DELETED',
      category: 'DONOR',
      details: `Deleted donor: ${donor.fullName} - ID: ${donor.donorId}`
    });

    res.json({ success: true, message: 'Donor removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete donor' });
  }
});

module.exports = router;
