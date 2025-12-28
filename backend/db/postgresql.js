const { Pool } = require('pg');

let pool = null;

/**
 * Attempt to connect to PostgreSQL. If it fails (e.g., network timeout),
 * we log the error and keep `pool` as null so the app can continue running.
 */
const connectPostgreSQL = async () => {
  try {
    pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});


    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    console.log('PostgreSQL connected successfully');

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL error', err);
      // Do not exit process here; allow app to handle runtime reconnects
    });
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message || error);
    pool = null; // mark as unavailable
  }
};

const ensurePool = () => {
  if (!pool) {
    throw new Error('PostgreSQL is not available');
  }
  return pool;
};

/**
 * Create schema and tables for an assignment if they don't exist.
 */
const setupAssignmentSchema = async (schemaName, tableDefinitions = []) => {
  const pool = ensurePool();
  const client = await pool.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    for (const table of tableDefinitions) {
      if (table.createTableSQL) {
        // Replace the table name in the CREATE TABLE with a namespaced schema.table
        const replaced = table.createTableSQL.replace(/CREATE\s+TABLE\s+[`"']?([a-zA-Z0-9_]+)[`"']?/i, `CREATE TABLE IF NOT EXISTS "${schemaName}"."${table.name}"`);
        await client.query(replaced);
      }

      if (Array.isArray(table.sampleData) && table.sampleData.length > 0) {
        const columns = Object.keys(table.sampleData[0]);
        const colList = columns.map(c => `"${c}"`).join(', ');

        for (const row of table.sampleData) {
          const values = columns.map((c, i) => `$${i + 1}`);
          const params = columns.map(c => row[c]);
          const insertSQL = `INSERT INTO "${schemaName}"."${table.name}" (${colList}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING`;
          await client.query(insertSQL, params);
        }
      }
    }
  } finally {
    client.release();
  }
};

/**
 * Execute a SQL query inside a specific schema by setting the search_path
 */
const executeQueryInSchema = async (schemaName, sql) => {
  const pool = ensurePool();
  const client = await pool.connect();

  try {
    await client.query(`SET search_path TO "${schemaName}", public`);
    const result = await client.query(sql);
    return result;
  } finally {
    client.release();
  }
};

const isPostgresAvailable = () => !!pool;

module.exports = {
  connectPostgreSQL,
  setupAssignmentSchema,
  executeQueryInSchema,
  isPostgresAvailable,
};
