const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');

/**
 * Get user progress for all assignments
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const progress = await UserProgress.find({ userId })
      .populate('assignmentId', 'title difficulty')
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (error) {
    next(error);
  }
});

/**
 * Save or update user progress
 */
router.post('/', async (req, res, next) => {
  try {
    const { userId, assignmentId, lastQuery, completed } = req.body;

    if (!userId || !assignmentId) {
      return res.status(400).json({ error: 'UserId and assignmentId are required' });
    }

    const updateData = {
      lastQuery: lastQuery || '',
      attempts: 1,
      completed: completed || false,
    };

    if (completed) {
      updateData.completedAt = new Date();
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId, assignmentId },
      {
        $set: updateData,
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

