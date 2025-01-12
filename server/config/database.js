// server/config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use the Atlas connection string from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected to Atlas successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
