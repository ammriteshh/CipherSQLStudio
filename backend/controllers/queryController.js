const { executeQueryInSchema, setupAssignmentSchema } = require('../db/postgresql');
const { validateQuery, sanitizeQuery } = require('./queryValidator');
const Assignment = require('../models/Assignment');

/**
 * Execute a SQL query in a sandboxed schema
 */
const executeQuery = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { query, userId, sessionId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Validate and sanitize query
    const validation = validateQuery(query);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const sanitizedQuery = sanitizeQuery(query);

    // Get assignment to access table definitions
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Create schema name based on user/session (sanitize to prevent SQL injection)
    const sanitizeIdentifier = (str) => String(str || '').replace(/[^a-zA-Z0-9_]/g, '_');
    const safeUserId = sanitizeIdentifier(userId || sessionId || 'guest');
    const safeAssignmentId = sanitizeIdentifier(assignmentId);
    const schemaName = `workspace_${safeUserId}_${safeAssignmentId}`;

    // Setup assignment schema if not already done (idempotent)
    try {
      await setupAssignmentSchema(schemaName, assignment.tableDefinitions);
    } catch (setupError) {
      console.error('Schema setup error:', setupError);
      // Continue execution if schema already exists
    }

    // Execute query in isolated schema
    try {
      const result = await executeQueryInSchema(schemaName, sanitizedQuery);
      
      res.json({
        success: true,
        data: result.rows,
        rowCount: result.rowCount,
        command: result.command,
      });
    } catch (execError) {
      // Return PostgreSQL error message to user
      res.status(400).json({
        success: false,
        error: execError.message || 'Query execution failed',
        code: execError.code,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignment details including table schemas and sample data
 */
const getAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Return assignment without sensitive information
    res.json({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty,
      question: assignment.question,
      tableDefinitions: assignment.tableDefinitions.map(table => ({
        name: table.name,
        description: table.description,
        sampleData: table.sampleData,
        // Don't include createTableSQL in response for security
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeQuery,
  getAssignment,
};

