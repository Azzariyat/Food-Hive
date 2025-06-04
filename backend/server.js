const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const userRoutes = require('./routes/User');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Static files: frontend (CSS, JS, images, HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Static files untuk upload gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/User', userRoutes);
app.use(express.static('pages'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'FoodHive API berjalan dengan baik!' });
});

// Serve frontend pages (optional fallback for index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});