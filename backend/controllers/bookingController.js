
const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { listingId, checkIn, checkOut, guests, specialRequests } = req.body;

    // Get listing to calculate total price
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('price_per_night')
      .eq('id', listingId)
      .single();

    if (listingError) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Calculate total price (simplified calculation)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price_per_night;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: listingId,
        guest_id: userId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
        special_requests: specialRequests || null
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listing:listings(*)
      `)
      .eq('guest_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listing:listings(*)
      `)
      .eq('id', id)
      .eq('guest_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById
};
