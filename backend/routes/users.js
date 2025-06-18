
const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Update user profile
router.put('/profile', 
  authenticateToken,
  [
    body('fullName').optional().trim().isLength({ min: 2 }),
    body('phone').optional().trim(),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('avatarUrl').optional().isURL()
  ],
  async (req, res) => {
    try {
      const { fullName, phone, bio, avatarUrl } = req.body;
      const userId = req.user.id;

      const result = await db.query(`
        UPDATE profiles 
        SET full_name = COALESCE($1, full_name),
            phone = COALESCE($2, phone),
            bio = COALESCE($3, bio),
            avatar_url = COALESCE($4, avatar_url),
            updated_at = NOW()
        WHERE id = $5
        RETURNING id, email, full_name, phone, bio, avatar_url, is_host, created_at, updated_at
      `, [fullName, phone, bio, avatarUrl, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Toggle host status
router.patch('/host-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(`
      UPDATE profiles 
      SET is_host = NOT is_host,
          updated_at = NOW()
      WHERE id = $1
      RETURNING is_host
    `, [userId]);

    res.json({
      message: 'Host status updated successfully',
      isHost: result.rows[0].is_host
    });
  } catch (error) {
    console.error('Toggle host status error:', error);
    res.status(500).json({ error: 'Failed to update host status' });
  }
});

module.exports = router;
