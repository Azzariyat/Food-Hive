const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donatur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Makanan Sisa', 'Roti & Kue', 'Buah & Sayur', 'Minuman', 'Lainnya'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['porsi', 'kg', 'gram', 'liter', 'pcs'],
      default: 'porsi',
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    images: [
      {
        filename: String,
        path: String,
        originalName: String,
      },
    ],
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'expired'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    isDelivery: {
      type: Boolean,
      default: false,
    },
    deliveryRadius: {
      type: Number, // dalam kilometer
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk geolocation search
donationSchema.index({ 'location.coordinates': '2dsphere' });
donationSchema.index({ status: 1, expiredDate: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
