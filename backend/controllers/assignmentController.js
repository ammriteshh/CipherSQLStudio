const Assignment = require('../models/Assignment');

/**
 * Get all assignments
 */
const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({})
      .select('title description difficulty createdAt')
      .sort({ createdAt: -1 });

    res.json(assignments.map(assignment => ({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty,
      createdAt: assignment.createdAt,
    })));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
};

