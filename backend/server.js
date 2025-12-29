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

const corsOrigin = process.env.CORS_ORIGIN ||
  'http://localhost:3000,https://cipher-sql-studio-ui.onrender.com,https://cipher-sql-studio-0zlp.onrender.com';


const allowedOrigins = corsOrigin.split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, server-side requests) when origin is undefined
    if (!origin) return callback(null, true);
    // Allow when wildcard is set
    if (allowedOrigins.includes('*')) return callback(null, true);
    // Allow matching origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Otherwise block
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check endpoint
const { isPostgresAvailable } = require('./db/postgresql');

app.get('/api/health', (req, res) => {
  const mongoEnvDefined = !!process.env.MONGODB_URI;
  const mongoState = mongoose.connection.readyState === 1 ? 'connected' : (mongoEnvDefined ? 'disconnected' : 'missing_env');

  res.json({
    status: 'ok',
    mongodb: {
      envConfigured: mongoEnvDefined,
      state: mongoState,
      readyState: mongoose.connection.readyState
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
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database connections and start server
async function startServer() {
  try {
    await connectMongoDB();
    await connectPostgreSQL();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;