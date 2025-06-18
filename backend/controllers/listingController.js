
const { validationResult } = require('express-validator');
const db = require('../config/database');

const getAllListings = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, minPrice, maxPrice, guests } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, 
             COALESCE(like_counts.like_count, 0) as like_count,
             CASE WHEN user_likes.user_id IS NOT NULL THEN true ELSE false END as is_liked_by_user
      FROM listings l
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as like_count
        FROM listing_likes
        GROUP BY listing_id
      ) like_counts ON l.id = like_counts.listing_id
      LEFT JOIN listing_likes user_likes ON l.id = user_likes.listing_id AND user_likes.user_id = $1
      WHERE l.is_active = true
    `;
    
    const params = [req.user?.id || null];
    let paramIndex = 2;

    if (location) {
      query += ` AND l.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (minPrice) {
      query += ` AND l.price_per_night >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND l.price_per_night <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    if (guests) {
      query += ` AND l.max_guests >= $${paramIndex}`;
      params.push(guests);
      paramIndex++;
    }

    query += ` ORDER BY l.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM listings WHERE is_active = true';
    const countParams = [];
    let countParamIndex = 1;

    if (location) {
      countQuery += ` AND location ILIKE $${countParamIndex}`;
      countParams.push(`%${location}%`);
      countParamIndex++;
    }

    if (minPrice) {
      countQuery += ` AND price_per_night >= $${countParamIndex}`;
      countParams.push(minPrice);
      countParamIndex++;
    }

    if (maxPrice) {
      countQuery += ` AND price_per_night <= $${countParamIndex}`;
      countParams.push(maxPrice);
      countParamIndex++;
    }

    if (guests) {
      countQuery += ` AND max_guests >= $${countParamIndex}`;
      countParams.push(guests);
      countParamIndex++;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      listings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT l.*, 
             p.full_name as host_name, p.avatar_url as host_avatar,
             COALESCE(like_counts.like_count, 0) as like_count,
             CASE WHEN user_likes.user_id IS NOT NULL THEN true ELSE false END as is_liked_by_user
      FROM listings l
      JOIN profiles p ON l.host_id = p.id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as like_count
        FROM listing_likes
        GROUP BY listing_id
      ) like_counts ON l.id = like_counts.listing_id
      LEFT JOIN listing_likes user_likes ON l.id = user_likes.listing_id AND user_likes.user_id = $1
      WHERE l.id = $2 AND l.is_active = true
    `;

    const result = await db.query(query, [req.user?.id || null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ listing: result.rows[0] });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

const createListing = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      listingType,
      pricePerNight,
      location,
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
      images
    } = req.body;

    const result = await db.query(`
      INSERT INTO listings (
        host_id, title, description, listing_type, price_per_night,
        location, max_guests, bedrooms, bathrooms, amenities, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      req.user.id, title, description, listingType, pricePerNight,
      location, maxGuests, bedrooms, bathrooms, amenities, images
    ]);

    res.status(201).json({
      message: 'Listing created successfully',
      listing: result.rows[0]
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

const getPopularListings = async (req, res) => {
  try {
    const query = `
      SELECT l.*, 
             COALESCE(like_counts.like_count, 0) as like_count,
             CASE WHEN user_likes.user_id IS NOT NULL THEN true ELSE false END as is_liked_by_user
      FROM listings l
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as like_count
        FROM listing_likes
        GROUP BY listing_id
      ) like_counts ON l.id = like_counts.listing_id
      LEFT JOIN listing_likes user_likes ON l.id = user_likes.listing_id AND user_likes.user_id = $1
      WHERE l.is_active = true
      ORDER BY like_counts.like_count DESC, l.rating DESC
      LIMIT 3
    `;

    const result = await db.query(query, [req.user?.id || null]);

    res.json({ listings: result.rows });
  } catch (error) {
    console.error('Get popular listings error:', error);
    res.status(500).json({ error: 'Failed to fetch popular listings' });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  getPopularListings
};
