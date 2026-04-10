const express = require('express');
const { getHint } = require('../controllers/hintController');

const router = express.Router();

router.get('/', getHint);

module.exports = router;
