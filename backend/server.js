const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

/* ===================== HEALTH CHECK ===================== */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/* ===================== AUTH ROUTES ===================== */
app.use('/api/auth', authRoutes);

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 ClassForge Backend running on http://localhost:${PORT}`);
});
