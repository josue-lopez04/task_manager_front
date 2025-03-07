// File: backend/db/connect.js

const mongoose = require('mongoose');

const connectDB = async (url) => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;


