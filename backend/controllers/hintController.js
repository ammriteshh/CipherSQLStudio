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
    const { userQuery, hintLevel = 1, userId } = req.body;

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

    // Handle User Balance for Paid Hints
    if (hintLevel > 1 && userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const cost = hintLevel === 2 ? 1 : 2;

      if (user.stars < cost) {
        return res.status(403).json({
          error: `Insufficient stars. You need ${cost} stars for this hint.`,
          requiredStars: cost,
          currentStars: user.stars
        });
      }

      // Deduct stars
      user.stars -= cost;
      await user.save();
    }

    // Prepare table schema info
    const tableSchemas = assignment.tableDefinitions
      .map(t => `Table: ${t.name}\nDescription: ${t.description || 'N/A'}`)
      .join('\n\n');

    // Define Prompt based on Level
    let promptInstruction = '';
    switch (parseInt(hintLevel)) {
      case 2:
        promptInstruction = `Provide a PARTIAL SOLUTION structure. 
        - Explain the logic step-by-step.
        - Show the skeleton of the query (e.g., SELECT ... FROM ... WHERE ...).
        - Do not fill in the specific column names or conditions yet.
        - Keep it under 4 sentences.`;
        break;
      case 3:
        promptInstruction = `Provide a FILL-IN-THE-BLANKS query.
        - Write the almost complete query but replace key parts (like column names, table names, or conditions) with '______'.
        - Example: SELECT ______ FROM employees WHERE salary > ______;
        - Do not provide the exact answer.`;
        break;
      case 1:
      default:
        promptInstruction = `Provide a GENERAL APPROACH hint.
        - Suggest which SQL concepts to use (e.g., "Use a JOIN", "Try using GROUP BY").
        - Mention relevant tables.
        - Do NOT show any code or query structure.
        - Keep it encouraging and under 3 sentences.`;
        break;
    }

    // Construct Prompt
    const prompt = `You are a helpful SQL tutor.
ASSIGNMENT: ${assignment.question}

TABLES:
${tableSchemas}

${userQuery ? `STUDENT QUERY:\n${userQuery}\n` : ''}

TASK: ${promptInstruction}

Provide ONLY the hint text. No headers, no markdown blocks.`;

    try {
      const model = llmClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
