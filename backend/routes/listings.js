
const express = require('express');
const { body } = require('express-validator');
const { 
  getListings, 
  getListingById, 
  createListing,
  getPopularListings 
} = require('../controllers/listingController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createListingValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('listingType').isIn(['entire_place', 'private_room', 'shared_room']).withMessage('Invalid listing type'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().isLength({ min: 3 }).withMessage('Location must be at least 3 characters'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('bedrooms').isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('bathrooms').isInt({ min: 1 }).withMessage('Bathrooms must be at least 1')
];

// Routes
router.get('/', optionalAuth, getListings);
router.get('/popular', getPopularListings);
router.get('/:id', optionalAuth, getListingById);
router.post('/', authenticateToken, createListingValidation, createListing);

module.exports = router;
