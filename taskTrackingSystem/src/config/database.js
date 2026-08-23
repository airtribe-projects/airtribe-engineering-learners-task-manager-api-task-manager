const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskTrackerDb';
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
