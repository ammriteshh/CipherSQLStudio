const { Pool } = require('pg');

let pool = null;

const connectPostgreSQL = async () => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully (Neon)');

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
};
