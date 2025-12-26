const express = require('express');
const router = express.Router();
const { getAllAssignments } = require('../controllers/assignmentController');
const { getAssignment, executeQuery } = require('../controllers/queryController');
const { generateHint } = require('../controllers/hintController');

// Get all assignments
router.get('/', getAllAssignments);

// Get assignment details
router.get('/:id', getAssignment);

// Execute SQL query
router.post('/:assignmentId/execute', executeQuery);

// Get AI-generated hint
router.post('/:assignmentId/hint', generateHint);

module.exports = router;

