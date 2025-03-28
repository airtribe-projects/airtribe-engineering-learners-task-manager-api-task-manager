require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes (Updated paths)
const authRoutes = require("./routes/routes"); // Assuming this is the correct file for authentication
const newsRoutes = require("./newsroutes"); // Your `newsroutes.js` is inside `src/`

// Error Handler Middleware
const errorHandler = require("./errorhandler");
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
