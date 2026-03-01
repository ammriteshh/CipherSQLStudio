const express = require('express');
const router = express.Router();
const {
    getAllAssignments,
    getAssignmentById,
    executeAssignmentQuery,
    getAssignmentHint
} = require('../controllers/assignmentController');

// List assignments
router.get('/', getAllAssignments);

// Assignment details
router.get('/:id', getAssignmentById);

router.post('/:id/execute', executeAssignmentQuery);
router.post('/:id/hint', getAssignmentHint);

module.exports = router;


