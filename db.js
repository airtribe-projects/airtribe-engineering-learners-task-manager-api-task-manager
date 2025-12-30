const mongoose = require("mongoose");

let isMongoConnected = false;

async function connectDB(uri) {
  if (isMongoConnected) return;

  try {
    await mongoose.connect(uri);
    isMongoConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    throw err; // fail fast so app does not start in broken state
  }
}

module.exports = connectDB;
