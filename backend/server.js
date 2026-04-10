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
  ...(process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [])
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(o =>
      origin.startsWith(o)
    );

    if (isAllowed) {
      return callback(null, true);
    }

    console.warn("Blocked by CORS:", origin);

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for assignment APIs to help debug production fetch issues
app.use('/api/assignments', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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
  console.error(`[ERROR] ${status} at ${req.method} ${req.originalUrl}: ${err.message}`);
  if (status >= 500) {
    console.error(err.stack); // Log full stack for server errors
  }
  
  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Bootstrap server
async function bootstrap() {
  // Check essential environment variables
  const requiredEnvVars = ['DATABASE_URL', 'NODE_ENV'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.warn(`[CRITICAL WARNING] Missing essential environment variables: ${missingEnvVars.join(', ')}`);
  }

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
