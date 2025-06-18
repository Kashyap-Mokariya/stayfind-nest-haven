
const express = require('express');
const { body } = require('express-validator');
const { 
  getAllListings, 
  getListingById, 
  createListing, 
  getPopularListings 
} = require('../controllers/listingController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createListingValidation = [
  body('title').trim().isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('listingType').isIn(['entire_place', 'private_room', 'shared_room']),
  body('pricePerNight').isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  body('location').trim().isLength({ min: 5 }).withMessage('Location must be at least 5 characters'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('bedrooms').isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('bathrooms').isInt({ min: 1 }).withMessage('Bathrooms must be at least 1'),
  body('amenities').isArray().withMessage('Amenities must be an array'),
  body('images').isArray().withMessage('Images must be an array')
];

// Routes
router.get('/', optionalAuth, getAllListings);
router.get('/popular', optionalAuth, getPopularListings);
router.get('/:id', optionalAuth, getListingById);
router.post('/', authenticateToken, createListingValidation, createListing);

module.exports = router;
