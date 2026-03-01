const express = require('express');
const router = express.Router();
const {
    getAllAssignments,
    getAssignmentById,
    executeAssignmentQuery,
    getAssignmentHint
} = require('../controllers/assignmentController');

router.get('/', getAllAssignments);

router.get('/:id', getAssignmentById);

router.post('/:id/execute', executeAssignmentQuery);
router.post('/:id/hint', getAssignmentHint);

module.exports = router;


