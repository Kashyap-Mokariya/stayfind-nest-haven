
const db = require('../config/database');

const toggleLike = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Check if like already exists
    const existingLike = await db.query(
      'SELECT id FROM listing_likes WHERE user_id = $1 AND listing_id = $2',
      [userId, listingId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await db.query(
        'DELETE FROM listing_likes WHERE user_id = $1 AND listing_id = $2',
        [userId, listingId]
      );
      
      res.json({ 
        message: 'Listing unliked successfully',
        isLiked: false
      });
    } else {
      // Like
      await db.query(
        'INSERT INTO listing_likes (user_id, listing_id) VALUES ($1, $2)',
        [userId, listingId]
      );
      
      res.json({ 
        message: 'Listing liked successfully',
        isLiked: true
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

const getLikeStatus = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id FROM listing_likes WHERE user_id = $1 AND listing_id = $2',
      [userId, listingId]
    );

    res.json({ isLiked: result.rows.length > 0 });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ error: 'Failed to get like status' });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT l.*, ll.created_at as liked_at
      FROM listing_likes ll
      JOIN listings l ON ll.listing_id = l.id
      WHERE ll.user_id = $1 AND l.is_active = true
      ORDER BY ll.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await db.query(query, [userId, limit, offset]);

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM listing_likes ll 
       JOIN listings l ON ll.listing_id = l.id 
       WHERE ll.user_id = $1 AND l.is_active = true`,
      [userId]
    );

    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      likedListings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user likes error:', error);
    res.status(500).json({ error: 'Failed to get user likes' });
  }
};

module.exports = {
  toggleLike,
  getLikeStatus,
  getUserLikes
};
