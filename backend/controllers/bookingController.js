
const { validationResult } = require('express-validator');
const db = require('../config/database');

const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { listingId, checkIn, checkOut, guests, specialRequests } = req.body;
    const guestId = req.user.id;

    // Check if listing exists and is active
    const listingResult = await db.query(
      'SELECT id, price_per_night, max_guests FROM listings WHERE id = $1 AND is_active = true',
      [listingId]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or not available' });
    }

    const listing = listingResult.rows[0];

    if (guests > listing.max_guests) {
      return res.status(400).json({ 
        error: `Maximum guests allowed: ${listing.max_guests}` 
      });
    }

    // Check for overlapping bookings
    const conflictResult = await db.query(`
      SELECT id FROM bookings 
      WHERE listing_id = $1 
      AND status IN ('confirmed', 'pending')
      AND (
        (check_in <= $2 AND check_out > $2) OR
        (check_in < $3 AND check_out >= $3) OR
        (check_in >= $2 AND check_out <= $3)
      )
    `, [listingId, checkIn, checkOut]);

    if (conflictResult.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Listing is not available for the selected dates' 
      });
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * parseFloat(listing.price_per_night);

    const result = await db.query(`
      INSERT INTO bookings (
        listing_id, guest_id, check_in, check_out, 
        guests, total_price, special_requests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [listingId, guestId, checkIn, checkOut, guests, totalPrice, specialRequests]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, l.title, l.location, l.images[1] as listing_image
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      WHERE b.guest_id = $1
    `;
    
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings WHERE guest_id = $1';
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      bookings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.query(`
      SELECT b.*, l.title, l.location, l.images, l.amenities,
             p.full_name as host_name, p.phone as host_phone
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      JOIN profiles p ON l.host_id = p.id
      WHERE b.id = $1 AND b.guest_id = $2
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById
};
