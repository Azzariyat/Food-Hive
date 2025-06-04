const express = require('express');
const multer = require('multer');
const path = require('path');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer config untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
  }
});

// @route   GET /api/donations
// @desc    Get all available donations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 10, category, limit = 20 } = req.query;
    
    let query = { status: 'available', expiredDate: { $gte: new Date() } };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    let donations;
    
    // Jika ada koordinat, cari berdasarkan lokasi
    if (lat && lng) {
      donations = await Donation.find({
        ...query,
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      })
      .populate('donatur', 'nama email')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    } else {
      donations = await Donation.find(query)
        .populate('donatur', 'nama email')
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      unit,
      expiredDate,
      pickupStart,
      pickupEnd,
      address,
      latitude,
      longitude,
      isDelivery,
      deliveryRadius
    } = req.body;

    // Validasi input
    if (!title || !description || !category || !quantity || !expiredDate || !pickupStart || !pickupEnd || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname
    })) : [];

    const donation = await Donation.create({
      donatur: req.user.id,
      title,
      description,
      category,
      quantity: parseInt(quantity),
      unit: unit || 'porsi',
      expiredDate: new Date(expiredDate),
      pickupTime: {
        start: new Date(pickupStart),
        end: new Date(pickupEnd)
      },
      location: {
        address,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      },
      images,
      isDelivery: isDelivery === 'true',
      deliveryRadius: deliveryRadius ? parseInt(deliveryRadius) : 5
    });

    // Update user total donations
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalDonations: 1 }
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donatur', 'nama email');

    res.status(201).json({
      success: true,
      message: 'Donasi berhasil dibuat',
      donation: populatedDonation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/claim
// @desc    Claim a donation
// @access  Private
router.put('/:id/claim', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donasi tidak ditemukan' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donasi sudah diambil atau tidak tersedia' });
    }

    if (donation.donatur.toString() === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa mengambil donasi sendiri' });
    }

    donation.status = 'claimed';
    donation.claimedBy = req.user.id;
    donation.claimedAt = new Date();
    
    await donation.save();

    // Update user total received
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalReceived: 1 }
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donatur', 'nama email phone')
      .populate('claimedBy', 'nama email phone');

    res.json({
      success: true,
      message: 'Donasi berhasil diklaim',
      donation: populatedDonation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;