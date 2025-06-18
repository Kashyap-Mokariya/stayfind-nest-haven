
const express = require('express');
const { body } = require('express-validator');
const { updateProfile, toggleHostStatus } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('fullName').optional().trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('phone').optional().trim(),
  body('bio').optional().trim(),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be valid')
];

// Routes
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.patch('/host-status', authenticateToken, toggleHostStatus);

module.exports = router;
