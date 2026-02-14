const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        this.client = null;
        if (process.env.GOOGLE_AI_API_KEY) {
            this.client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        }
    }

    isConfigured() {
        return !!this.client;
    }

    /**
     * Generate a hint for a SQL assignment
     * @param {string} question - Usage question
     * @param {string} tableSchemas - Schema definitions
     * @param {string} userQuery - Current user query (optional)
     * @returns {Promise<string>} - Generated hint
     */
    async generateHint(question, tableSchemas, userQuery) {
        if (!this.client) {
            throw new Error('LLM service is not configured. Please set GOOGLE_AI_API_KEY.');
        }

        const prompt = `You are a helpful SQL tutor.
ASSIGNMENT: ${question}

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
            const model = this.client.getGenerativeModel({ model: 'gemini-flash-latest' });
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error('LLM API error:', error);
            throw new Error('Failed to generate hint.');
        }
    }
}

module.exports = new AIService();
