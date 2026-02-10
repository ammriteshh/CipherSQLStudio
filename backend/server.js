const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
// Ensure PORT is a valid numeric port (sometimes envs may mistakenly contain a URL)
const _rawPort = process.env.PORT;
const _parsedPort = _rawPort ? parseInt(_rawPort, 10) : NaN;
const PORT = Number.isInteger(_parsedPort) && _parsedPort > 0 ? _parsedPort : 5000;
if (_rawPort && !(Number.isInteger(_parsedPort) && _parsedPort > 0)) {
  console.warn(`Invalid PORT environment variable (${_rawPort}), falling back to ${PORT}`);
}

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cipher-sql-studio-ui.onrender.com",
  "https://ciphersqlstudio.onrender.com", // Add potential other frontend URL
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / server-to-server

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS for origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Database connections
const connectMongoDB = require('./db/mongodb');
const { connectPostgreSQL } = require('./db/postgresql');

// Routes
const assignmentRoutes = require('./routes/assignments');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Root route for health check / monitoring
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CipherSQL Backend is running. Access API at /api' });
});

// Health check endpoint
const { isPostgresAvailable } = require('./db/postgresql');
const Assignment = require('./models/Assignment');

app.get('/api/health', async (req, res) => {
  const mongoEnvDefined = !!process.env.MONGODB_URI;
  const mongoState = mongoose.connection.readyState === 1 ? 'connected' : (mongoEnvDefined ? 'disconnected' : 'missing_env');

  let assignmentsCount = 'unknown';
  if (mongoState === 'connected') {
    try {
      assignmentsCount = await Assignment.countDocuments();
    } catch (e) {
      assignmentsCount = 'error';
    }
  }

  res.json({
    status: 'ok',
    mongodb: {
      envConfigured: mongoEnvDefined,
      state: mongoState,
      readyState: mongoose.connection.readyState,
      assignmentsCount
    },
    postgresql: {
      available: isPostgresAvailable()
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Initialize database connections and start server
async function startServer() {
  try {
    console.log('[DEBUG] Connecting to MongoDB...');
    await connectMongoDB();
    console.log('[DEBUG] MongoDB connected.');
  } catch (err) {
    console.error('[DEBUG] MongoDB connection failed (continuing):', err);
  }

  try {
    console.log('[DEBUG] Connecting to PostgreSQL...');
    await connectPostgreSQL();
    console.log('[DEBUG] PostgreSQL connected.');
  } catch (err) {
    console.error('[DEBUG] PostgreSQL connection failed (continuing):', err);
  }

  console.log('[DEBUG] Starting Express server...');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

module.exports = app;