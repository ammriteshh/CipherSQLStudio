const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testHint() {
    console.log('Testing Hint Generation...');
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('API Key present:', !!apiKey);

    if (!apiKey) {
        console.error('API Key missing!');
        return;
    }

    const llmClient = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-flash-latest', 'gemini-pro-latest'];

    const prompt = `You are a helpful SQL tutor. Provide a hint for "SELECT * FROM users"`;

    for (const modelName of models) {
        console.log(`Trying model: ${modelName}`);
        try {
            const model = llmClient.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log(`SUCCESS with ${modelName}:`, text);
            return;
        } catch (error) {
            console.error(`FAILED with ${modelName}:`, error.toString());
            if (error.response) console.error('Response:', JSON.stringify(error.response, null, 2));
        }
    }
}

testHint();
