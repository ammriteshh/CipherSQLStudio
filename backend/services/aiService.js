const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service for AI-powered SQL hints using Google Gemini
 */
class AIService {
    constructor() {
        this.client = null;
        this.modelName = 'gemini-1.5-flash';

        if (process.env.GOOGLE_AI_API_KEY) {
            this.client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        }
    }

    isConfigured() {
        return !!this.client;
    }

    
       @param {string} question 
       @param {string} schema 
       @param {string} userQuery 
       @returns {Promise<string>}
     
    async generateHint(question, schema, userQuery) {
        if (!this.client) {
            throw new Error('AI Service not configured. Set GOOGLE_AI_API_KEY.');
        }

        const prompt = `
      Context: SQL Tutor for students.
      Assignment: "${question}"
      Table Schema: ${schema}
      Current User Query: "${userQuery || 'None'}"

      Task: Provide a concise, helpful hint.
      - Don't give the full solution.
      - Focus on SQL concepts (e.g., JOIN, WHERE, GROUP BY).
      - Max 2-3 sentences.
      - Return ONLY the hint text.
    `.trim();

        try {
            const model = this.client.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();

            return text || "Try reviewing the table schema and column names.";
        } catch (error) {
            console.error('[AI SERVICE ERROR]', error.message);
            throw new Error('AI hint generation failed.');
        }
    }
}

module.exports = new AIService();

