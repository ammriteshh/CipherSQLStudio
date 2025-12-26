const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // First connect to default 'postgres' database to create our database
  const adminClient = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres', // Connect to default database first
  });

  try {
    await adminClient.connect();
    console.log('Connected to PostgreSQL');

    const dbName = process.env.POSTGRES_DATABASE || 'cipher_sql_studio';
    
    // Check if database exists
    const checkResult = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rows.length === 0) {
      console.log(`Creating database: ${dbName}...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully!`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }

    await adminClient.end();
    
    // Test connection to the new database
    const testClient = new Client({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: dbName,
    });

    await testClient.connect();
    console.log(`✅ Successfully connected to '${dbName}' database`);
    await testClient.end();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();

