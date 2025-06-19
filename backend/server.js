
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const likeRoutes = require('./routes/likes');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
