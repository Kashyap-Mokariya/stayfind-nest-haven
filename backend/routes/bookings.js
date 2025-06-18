
const express = require('express');
const { body } = require('express-validator');
const { 
  createBooking, 
  getUserBookings, 
  getBookingById 
} = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createBookingValidation = [
  body('listingId').isUUID().withMessage('Valid listing ID required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date required'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
  body('specialRequests').optional().trim()
];

// Routes
router.post('/', authenticateToken, createBookingValidation, createBooking);
router.get('/', authenticateToken, getUserBookings);
router.get('/:id', authenticateToken, getBookingById);

module.exports = router;
