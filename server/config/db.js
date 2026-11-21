const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('[DB] MONGODB_URI is not set. Skipping DB connection.');
    return false;
  }

  const maskedURI = mongoURI.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/, '$1****$2');
  console.log(`[DB] Connecting to: ${maskedURI}`);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[DB] MongoDB disconnected.');
    });
    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[DB] MongoDB reconnected.');
    });
    console.log('✓ MongoDB connected successfully.');
    return true;
  } catch (err) {
    isConnected = false;
    console.error('[DB] Connection failed:', err.message);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
