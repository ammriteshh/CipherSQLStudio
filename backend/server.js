const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Database connections
const connectMongoDB = require('./db/mongodb');
const { connectPostgreSQL, isPostgresAvailable } = require('./db/postgresql');

// Route imports
const assignmentRoutes = require('./routes/assignment.routes');
const authRoutes = require('./routes/auth.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();

// Port configuration
const PORT = parseInt(process.env.PORT, 10) || 5000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cipher-sql-studio-ui.onrender.com",
  "https://ciphersqlstudio.onrender.com",
  "https://cipher-sql-studio-0zlp.onrender.com",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (Only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoState,
      postgresql: isPostgresAvailable() ? 'available' : 'unavailable'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CipherSQL API is operational' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[ERROR] ${status}: ${err.message}`);
  
  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Bootstrap server
async function bootstrap() {
  try {
    await Promise.all([
      connectMongoDB(),
      connectPostgreSQL()
    ]);
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('Fatal error during bootstrap:', err);
    process.exit(1);
  }
}

bootstrap();

module.exports = app;
