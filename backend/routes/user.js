const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// Fetch profile image
router.get('/profile-image', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user is set by the authentication middleware
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ profileImage: user.profileImage || '/images/default-profile.png' });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;