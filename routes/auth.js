const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const data = require("../data");
const { validateEmail } = require("../helpers/validators");

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }
  if (data.users.some((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: data.getNextUserId(),
    email,
    passwordHash,
    preferences: { categories: [], languages: [] },
  };
  data.users.push(newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email });
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const user = data.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, email: user.email }, data.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

module.exports = router;
