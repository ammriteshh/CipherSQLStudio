const { Pool } = require('pg');

let pool;

const connectPostgreSQL = async () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();
  console.log('PostgreSQL connected successfully');
  client.release();

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error', err);
    process.exit(1);
  });
};

module.exports = {
  connectPostgreSQL,
};
