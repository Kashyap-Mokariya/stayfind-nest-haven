
const express = require('express');
const { 
  toggleLike, 
  getLikeStatus, 
  getUserLikes,
  getPopularListings 
} = require('../controllers/likeController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/popular', getPopularListings);
router.post('/:listingId/toggle', authenticateToken, toggleLike);
router.get('/:listingId/status', authenticateToken, getLikeStatus);
router.get('/user', authenticateToken, getUserLikes);

module.exports = router;
