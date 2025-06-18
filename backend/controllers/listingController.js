
const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const getListings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      minPrice, 
      maxPrice, 
      guests, 
      listingType 
    } = req.query;

    let query = supabase
      .from('listings')
      .select('*')
      .eq('is_active', true);

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (minPrice) {
      query = query.gte('price_per_night', minPrice);
    }
    if (maxPrice) {
      query = query.lte('price_per_night', maxPrice);
    }
    if (guests) {
      query = query.gte('max_guests', guests);
    }
    if (listingType) {
      query = query.eq('listing_type', listingType);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      listings: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createListing = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
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

    const { data, error } = await supabase
      .from('listings')
      .insert({
        host_id: userId,
        title,
        description,
        listing_type: listingType,
        price_per_night: pricePerNight,
        location,
        max_guests: maxGuests,
        bedrooms,
        bathrooms,
        amenities: amenities || [],
        images: images || []
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPopularListings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings_with_likes')
      .select('*')
      .order('like_count', { ascending: false })
      .order('rating', { ascending: false })
      .limit(3);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get popular listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  getPopularListings
};
