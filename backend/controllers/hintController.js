const aiService = require('../services/aiService');

const fallbackHint = (question) =>
  `Focus on the core SQL operation needed for "${question}". Start by identifying the relevant tables, columns, and any filtering or grouping you may need.`;

const getHint = async (req, res, next) => {
  try {
    const question = req.query.question?.trim();

    if (!question) {
      return res.status(400).json({
        error: 'The "question" query parameter is required.'
      });
    }

    if (!aiService.isConfigured()) {
      return res.json({
        hint: fallbackHint(question)
      });
    }

    const hint = await aiService.generateHint(
      question,
      'General SQL hint request. No schema was provided.',
      ''
    );

    return res.json({ hint });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getHint
};
