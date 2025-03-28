// src/controllers/authController.js

const registerUser = async (req, res) => {
    res.status(201).json({ message: "User registered successfully" });
};

const loginUser = async (req, res) => {
    res.status(200).json({ message: "User logged in successfully" });
};

const updatePreferences = async (req, res) => {
    res.status(200).json({ message: "Preferences updated successfully" });
};

module.exports = { registerUser, loginUser, updatePreferences };
