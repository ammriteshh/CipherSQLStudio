const Assignment = require('../models/Assignment');
const User = require('../models/User');
const aiService = require('../services/aiService');

/**
 * Generate Progressive Hint using Gemini
 */
const generateHint = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userQuery, userId } = req.body;

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        error: 'LLM service is not configured. Please set GOOGLE_AI_API_KEY.',
      });
    }

    // Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Prepare table schema info
    const tableSchemas = assignment.tableDefinitions
      .map(t => `Table: ${t.name}\nDescription: ${t.description || 'N/A'}`)
      .join('\n\n');

    try {
      const hint = await aiService.generateHint(assignment.question, tableSchemas, userQuery);

      return res.json({
        success: true,
        hint,
        starsRemaining: userId ? (await User.findById(userId))?.stars : null
      });
    } catch (llmError) {
      return res.status(500).json({ error: llmError.message });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateHint,
};
