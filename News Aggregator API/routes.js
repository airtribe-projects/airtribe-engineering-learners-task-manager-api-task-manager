const express = require("express");
const { registerUser, loginUser, updatePreferences } = require("../controllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/preferences", authMiddleware, updatePreferences); // New route

module.exports = router;
