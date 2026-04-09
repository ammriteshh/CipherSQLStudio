const mongoose = require('mongoose');

// Disable query buffering globally. If the database is not connected, queries
// will immediately throw an error instead of hanging indefinitely.
mongoose.set('bufferCommands', false);

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('[DATABASE ERROR] MONGODB_URI is not defined in environment variables. Valid MongoDB connection is required.');
      return; 
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Don't spend 30 seconds failing to connect during startup
    });

    console.log('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // don't throw - allow the server to start in degraded mode
    return;
  }
};

module.exports = connectMongoDB;

