const Assignment = require('../models/Assignment');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize LLM client (prioritize OpenAI, fallback to Google AI)
let llmClient = null;
let llmType = null;

if (process.env.OPENAI_API_KEY) {
  llmClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  llmType = 'openai';
} else if (process.env.GOOGLE_AI_API_KEY) {
  llmClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  llmType = 'google';
}

/**
 * Generate a helpful hint using LLM without revealing the solution
 */
const generateHint = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userQuery } = req.body;

    if (!llmClient) {
      return res.status(503).json({ 
        error: 'LLM service is not configured. Please set OPENAI_API_KEY or GOOGLE_AI_API_KEY in environment variables.' 
      });
    }

    // Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Build context for the LLM
    const tableSchemas = assignment.tableDefinitions.map(table => ({
      name: table.name,
      description: table.description,
    })).map(table => `Table: ${table.name}\nDescription: ${table.description || 'N/A'}`).join('\n\n');

    // Craft a prompt that encourages hints, not solutions
    const prompt = `You are a helpful SQL tutor. A student is working on the following SQL assignment:

ASSIGNMENT QUESTION:
${assignment.question}

AVAILABLE TABLES:
${tableSchemas}

${userQuery ? `STUDENT'S CURRENT QUERY:
${userQuery}

` : ''}Your task is to provide a helpful hint that guides the student toward the solution WITHOUT giving away the complete or near-complete answer. 

Guidelines:
- Point them in the right direction
- Suggest SQL concepts or functions they might need to use
- Mention relevant table relationships or columns
- DO NOT provide the complete SQL query
- DO NOT provide more than 60% of the solution
- Keep the hint concise (2-4 sentences)
- Be encouraging and educational

Provide only the hint text, no additional explanation or formatting.`;

    let hint = '';

    try {
      if (llmType === 'openai') {
        const response = await llmClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful SQL tutor who provides hints without giving complete solutions.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        });

        hint = response.choices[0]?.message?.content?.trim() || 'Unable to generate hint.';
      } else if (llmType === 'google') {
        const model = llmClient.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        hint = result.response.text().trim();
      }

      res.json({
        success: true,
        hint: hint || 'Unable to generate hint. Please try again.',
      });
    } catch (llmError) {
      console.error('LLM API error:', llmError);
      res.status(500).json({
        error: 'Failed to generate hint. Please try again later.',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateHint,
};

