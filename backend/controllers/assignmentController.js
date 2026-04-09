const { Pool } = require('pg');
const Assignment = require('../models/Assignment');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getAllAssignments = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database service is currently missing or unavailable. Please verify MONGODB_URI.' });
    }

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

/**
 * Fetch a single assignment by ID with necessary details for the workspace
 */
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = 404;
      throw error;
    }

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

/**
 * Execute user query in a temporary isolated schema
 */
const executeAssignmentQuery = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { query, sessionId } = req.body;
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = 404;
      throw error;
    }

    // Sanitize Session ID to create a safe schema name
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50);
    const workspaceSchema = `workspace_${safeSessionId}`;

    await client.query('BEGIN');

    // Isolate user execution in their own schema
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${workspaceSchema}"`);
    await client.query(`SET search_path TO "${workspaceSchema}"`);

    // Setup assignment tables and data
    for (const table of assignment.tableDefinitions) {
      await client.query(table.createTableSQL);

      if (table.sampleData && table.sampleData.length > 0) {
        const columns = Object.keys(table.sampleData[0]).join(', ');
        const values = table.sampleData.map(row => {
          const rowValues = Object.values(row).map(val => {
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            return val;
          }).join(', ');
          return `(${rowValues})`;
        }).join(', ');

        await client.query(`INSERT INTO ${table.name} (${columns}) VALUES ${values}`);
      }
    }

    // Execute the user's SQL query
    const result = await client.query(query);

    await client.query('COMMIT');

    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      columns: result.fields.map(f => f.name)
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[DATABASE ERROR]', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * Generate an AI-powered hint for the assignment
 */
const getAssignmentHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userQuery } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = 404;
      throw error;
    }

    const tableSchemaInfo = assignment.tableDefinitions
      .map(td => `Table "${td.name}": ${td.description}`)
      .join('\n');

    const hint = await aiService.generateHint(
      assignment.question,
      tableSchemaInfo,
      userQuery
    );

    res.json({ success: true, hint });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  executeAssignmentQuery,
  getAssignmentHint
};



