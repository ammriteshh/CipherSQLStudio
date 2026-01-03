const Assignment = require('../models/Assignment');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini
let llmClient = null;

if (process.env.GOOGLE_AI_API_KEY) {
  llmClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}

/**
 * Generate Hint using Gemini (No solution, only guidance)
 */
const generateHint = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userQuery } = req.body;

    if (!llmClient) {
      return res.status(503).json({
        error:
          'LLM service is not configured. Please set GOOGLE_AI_API_KEY in environment variables.',
      });
    }

    // Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Prepare table schema info
    const tableSchemas = assignment.tableDefinitions
      .map(
        (table) =>
          `Table: ${table.name}\nDescription: ${
            table.description || 'N/A'
          }`
      )
      .join('\n\n');

    // Prompt for Gemini
    const prompt = `You are a helpful SQL tutor. A student is working on the following SQL assignment:

ASSIGNMENT QUESTION:
${assignment.question}

AVAILABLE TABLES:
${tableSchemas}

${
  userQuery
    ? `STUDENT'S CURRENT QUERY:
${userQuery}

`
    : ''
}Your task is to provide a helpful hint that guides the student toward the solution WITHOUT giving away the complete or near-complete answer.

Guidelines:
- Point them in the right direction
- Suggest SQL concepts or functions they might need to use
- Mention relevant table relationships or columns
- DO NOT provide the complete SQL query
- DO NOT provide more than 60% of the solution
- Keep the hint concise (2-4 sentences)
- Be encouraging and educational

Provide only the hint text, no extra explanation or formatting.`;

    try {
      const model = llmClient.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',   // ✅ FIXED MODEL
      });

      const result = await model.generateContent(prompt);
      const hint = result.response.text().trim();

      return res.json({
        success: true,
        hint: hint || 'Unable to generate hint. Please try again.',
      });
    } catch (llmError) {
      console.error('LLM API error:', llmError);
      return res
        .status(500)
        .json({ error: 'Failed to generate hint. Please try again later.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateHint,
};
