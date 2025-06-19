
const { supabase } = require('../config/supabase');

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    // Check if like exists
    const { data: existingLike, error: checkError } = await supabase
      .from('listing_likes')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(400).json({ error: checkError.message });
    }

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('listing_likes')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', userId);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }

      res.json({ liked: false, message: 'Listing unliked successfully' });
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('listing_likes')
        .insert({
          listing_id: listingId,
          user_id: userId,
        });

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }

      res.json({ liked: true, message: 'Listing liked successfully' });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLikeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    const { data, error } = await supabase
      .from('listing_likes')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: error.message });
    }

    res.json({ liked: !!data });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('listing_likes')
      .select(`
        listing_id,
        listings (*)
      `)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const likedListings = data.map(item => item.listings);
    res.json(likedListings);
  } catch (error) {
    console.error('Get user likes error:', error);
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
  toggleLike,
  getLikeStatus,
  getUserLikes,
  getPopularListings
};
