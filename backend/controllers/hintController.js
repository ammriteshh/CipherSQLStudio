const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini
let llmClient = null;

if (process.env.GOOGLE_AI_API_KEY) {
  llmClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}

/**
 * Generate Progressive Hint using Gemini
 * Level 1: General approach (Free)
 * Level 2: Partial solution structure (1 Star)
 * Level 3: Sample query with blanks (2 Stars)
 */
const generateHint = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userQuery, userId } = req.body;

    if (!llmClient) {
      return res.status(503).json({
        error: 'LLM service is not configured. Please set GOOGLE_AI_API_KEY.',
      });
    }

    // Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Handle User Balance for Paid Hints (Single level = 1 star cost)
    // REMOVED: Making hints free as per user request
    /*
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const cost = 1;

      if (user.stars < cost) {
        return res.status(403).json({
          error: `Insufficient stars. You need ${cost} star for a hint.`,
          requiredStars: cost,
          currentStars: user.stars
        });
      }

      // Deduct stars
      user.stars -= cost;
      await user.save();
    }
    */

    // Prepare table schema info
    const tableSchemas = assignment.tableDefinitions
      .map(t => `Table: ${t.name}\nDescription: ${t.description || 'N/A'}`)
      .join('\n\n');

    // Single Hint Prompt
    const prompt = `You are a helpful SQL tutor.
ASSIGNMENT: ${assignment.question}

TABLES:
${tableSchemas}

${userQuery ? `STUDENT QUERY:\n${userQuery}\n` : ''}

TASK: Provide a helpful hint to solve this problem.
- Explain the logic briefly.
- Suggest SQL keywords or concepts to use (e.g., "Use JOIN", "GROUP BY").
- Show a skeleton of the query if helpful, but DO NOT give the exact full answer.
- Keep it under 3 sentences.

Provide ONLY the hint text. No headers, no markdown blocks.`;

    try {
      const model = llmClient.getGenerativeModel({ model: 'gemini-flash-latest' });
      const result = await model.generateContent(prompt);
      const hint = result.response.text().trim();

      return res.json({
        success: true,
        hint,
        starsRemaining: userId ? (await User.findById(userId))?.stars : null
      });
    } catch (llmError) {
      console.error('LLM API error:', llmError);
      return res.status(500).json({ error: 'Failed to generate hint.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateHint,
};
