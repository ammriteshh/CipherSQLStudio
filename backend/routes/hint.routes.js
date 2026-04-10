const express = require('express');
const { getHint } = require('../controllers/hintController');

const router = express.Router();

console.log('[ROUTES] hint.routes.js loaded');

router.get('/', (req, res, next) => {
  console.log(`[HINT ROUTE] ${req.method} ${req.originalUrl}`, {
    question: req.query.question || null
  });

  return getHint(req, res, next);
});

module.exports = router;
