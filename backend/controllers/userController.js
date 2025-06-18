
const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { fullName, phone, bio, avatarUrl } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        phone,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleHostStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current host status
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('is_host')
      .eq('id', userId)
      .single();

    if (getError && getError.code !== 'PGRST116') {
      return res.status(400).json({ error: getError.message });
    }

    const newHostStatus = profile ? !profile.is_host : true;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        is_host: newHostStatus,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: `Host status ${newHostStatus ? 'enabled' : 'disabled'}`,
      profile: data 
    });
  } catch (error) {
    console.error('Toggle host status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  updateProfile,
  toggleHostStatus
};
