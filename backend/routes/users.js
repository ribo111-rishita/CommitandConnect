const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is populated by middleware
    res.json(req.user);
  } catch (err) {
    console.error('/users/me error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;