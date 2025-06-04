const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/foodhive', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Terhubung ke MongoDB'))
.catch(err => console.error('Kesalahan koneksi MongoDB:', err));

// Skema Pengguna
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Rute Registrasi
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Kata sandi harus minimal 6 karakter' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email atau nama pengguna sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Pengguna berhasil didaftarkan' });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server', error });
  }
});

// Rute Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan kata sandi wajib diisi' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'rahasia_jwt_anda', { expiresIn: '1h' });
    res.json({ token, username: user.username, message: 'Login berhasil' });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server', error });
  }
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));