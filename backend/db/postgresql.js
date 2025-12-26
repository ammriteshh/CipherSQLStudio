const { Pool } = require('pg');

let pool = null;

const connectPostgreSQL = async () => {
  try {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE || 'cipher_sql_studio',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });

  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
};

/**
 * Execute a query in an isolated schema
 * @param {string} schemaName - The schema name to isolate to
 * @param {string} query - The SQL query to execute
 * @returns {Promise<Object>} Query result
 */
const executeQueryInSchema = async (schemaName, query) => {
  if (!pool) {
    throw new Error('PostgreSQL pool is not initialized');
  }

  const client = await pool.connect();
  
  try {
    // Escape schema name to prevent SQL injection
    const escapedSchemaName = `"${schemaName}"`;
    
    // Ensure schema exists
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${escapedSchemaName}`);
    
    // Set search_path to isolate query execution
    await client.query(`SET search_path = ${escapedSchemaName}, public`);
    
    // Execute the query
    const result = await client.query(query);
    
    return {
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Setup assignment tables in a schema
 * @param {string} schemaName - The schema name
 * @param {Array} tableDefinitions - Array of table definition objects
 */
const setupAssignmentSchema = async (schemaName, tableDefinitions) => {
  if (!pool) {
    throw new Error('PostgreSQL pool is not initialized');
  }

  const client = await pool.connect();
  
  try {
    // Escape schema name to prevent SQL injection
    const escapedSchemaName = `"${schemaName}"`;
    
    // Create schema if not exists
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${escapedSchemaName}`);
    
    // Check if tables already exist (to avoid recreating if schema is already set up)
    const existingTables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = $1
    `, [schemaName]);
    
    // Only recreate if tables don't exist
    if (existingTables.rows.length > 0) {
      // Schema already set up, skip
      return;
    }
    
    // Set search_path
    await client.query(`SET search_path = ${escapedSchemaName}, public`);
    
    // Create tables and insert sample data
    for (const tableDef of tableDefinitions) {
      // Create table (modify SQL to use schema)
      const createSQL = tableDef.createTableSQL
        .replace(/CREATE TABLE\s+(\w+)/i, `CREATE TABLE ${escapedSchemaName}."$1"`);
      await client.query(createSQL);
      
      // Insert sample data if provided
      if (tableDef.sampleData && tableDef.sampleData.length > 0) {
        const columns = Object.keys(tableDef.sampleData[0]);
        const placeholders = tableDef.sampleData.map((_, i) => 
          `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
        ).join(', ');
        
        const values = tableDef.sampleData.flatMap(row => 
          columns.map(col => row[col])
        );
        
        const escapedTableName = `"${tableDef.name}"`;
        const insertQuery = `
          INSERT INTO ${escapedSchemaName}.${escapedTableName} (${columns.map(c => `"${c}"`).join(', ')})
          VALUES ${placeholders}
        `;
        
        await client.query(insertQuery, values);
      }
    }
    
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get pool instance (for advanced usage)
 */
const getPool = () => pool;

module.exports = {
  connectPostgreSQL,
  executeQueryInSchema,
  setupAssignmentSchema,
  getPool,
};

