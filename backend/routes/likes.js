
const express = require('express');
const { 
  toggleLike, 
  getLikeStatus, 
  getUserLikes 
} = require('../controllers/likeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/listing/:listingId', authenticateToken, toggleLike);
router.get('/listing/:listingId', authenticateToken, getLikeStatus);
router.get('/user', authenticateToken, getUserLikes);

module.exports = router;
