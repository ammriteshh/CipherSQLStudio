const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
});

const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({})
      .select('title description difficulty createdAt')
      .sort({ createdAt: -1 });

    res.json(assignments.map(assignment => ({
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty,
      createdAt: assignment.createdAt,
    })));
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Only return what's needed for the frontend
    res.json({
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty,
      question: assignment.question,
      tableDefinitions: assignment.tableDefinitions.map(td => ({
        name: td.name,
        description: td.description,
        createTableSQL: td.createTableSQL,
        sampleData: td.sampleData
      })),
      initialQuery: `SELECT * FROM ${assignment.tableDefinitions[0].name.toLowerCase()};`
    });
  } catch (error) {
    next(error);
  }
};

const executeAssignmentQuery = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { query, userId, sessionId } = req.body;
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // 1. Sanitize Session ID (Schema Name)
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50);
    const userSchema = `workspace_${safeSessionId}`;

    // 2. Start Transaction
    await client.query('BEGIN');

    // 3. Create Schema
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${userSchema}"`);
    await client.query(`SET search_path TO "${userSchema}"`);

    // 4. Create Tables and Insert Data (Lowercase enforced)
    for (const table of assignment.tableDefinitions) {
      // Create Table
      await client.query(table.createTableSQL);

      // Insert Data
      if (table.sampleData && table.sampleData.length > 0) {
        const columns = Object.keys(table.sampleData[0]).join(', ');
        const values = table.sampleData.map(row => {
          const rowValues = Object.values(row).map(val => {
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`; // Escape single quotes
            return val;
          }).join(', ');
          return `(${rowValues})`;
        }).join(', ');

        await client.query(`INSERT INTO ${table.name} (${columns}) VALUES ${values}`);
      }
    }

    // 5. Execute User Query
    const result = await client.query(query);

    await client.query('COMMIT');

    // 6. Return Results
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      columns: result.fields.map(f => f.name)
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Query execution error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    // Ideally drop schema here to clean up, or use a cleanup job
    // await client.query(`DROP SCHEMA IF EXISTS "${userSchema}" CASCADE`);
    client.release();
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  executeAssignmentQuery
};

