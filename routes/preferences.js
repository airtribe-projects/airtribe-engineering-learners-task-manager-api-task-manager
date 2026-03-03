const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// GET /preferences
router.get("/", authMiddleware, (req, res) => {
  res.json(req.user.preferences);
});

// PUT /preferences
router.put("/", authMiddleware, (req, res) => {
  const { categories, languages } = req.body;
  if (
    (categories && !Array.isArray(categories)) ||
    (languages && !Array.isArray(languages))
  ) {
    return res.status(400).json({ error: "Preferences must be arrays" });
  }
  if (categories) req.user.preferences.categories = categories;
  if (languages) req.user.preferences.languages = languages;
  res.json(req.user.preferences);
});

module.exports = router;
