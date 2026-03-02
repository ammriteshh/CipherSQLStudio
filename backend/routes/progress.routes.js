const express = require('express');
const router = express.Router();
const { getUserProgress, updateUserProgress } = require('../controllers/progressController');

router.get('/:userId', getUserProgress);
router.post('/', updateUserProgress);

module.exports = router;


