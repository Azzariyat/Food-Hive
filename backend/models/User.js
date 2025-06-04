const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userType: {
      type: String,
      enum: ['donatur', 'penerima'],
      default: 'donatur',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    totalReceived: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password sebelum save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method untuk compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
