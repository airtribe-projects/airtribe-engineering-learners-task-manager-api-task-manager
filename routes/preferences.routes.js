const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); 
const authMiddleware = require('../middlewares/auth.middleware');
const User = require('../models/user.model');

router.put('/',
  authMiddleware,
  [
    body('categories').optional().isArray().withMessage('Categories must be an array'),
    body('languages').optional().isArray().withMessage('Languages must be an array'),
    body('sources').optional().isArray().withMessage('Sources must be an array')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categories, languages, sources } = req.body;

    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.preferences = {
        categories: categories || [],
        languages: languages || [],
        sources: sources || []
      };

      await user.save();
      res.json({ message: 'Preferences updated', preferences: user.preferences });
    } catch (err) {
      console.error(' Preferences Update Error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


router.get('/',
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('preferences');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ preferences: user.preferences || {} });
    } catch (err) {
      console.error(' Error getting preferences:', err.message);
      res.status(500).json({ message: 'Failed to fetch preferences' });
    }
  }
);


module.exports = router; 