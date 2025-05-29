const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const User = require('../models/user.model');
const { fetchNewsFromAPI } = require('../services/news.service');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const articles = await fetchNewsFromAPI(user.preferences || {});
    res.json({ articles });
  } catch (err) {
    console.error(' News Fetch Error:', err.message);
    res.status(500).json({ message: 'Unable to fetch news' });
  }
});

module.exports = router;
