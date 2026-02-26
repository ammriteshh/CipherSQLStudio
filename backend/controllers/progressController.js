const UserProgress = require('../models/UserProgress');

/**
 * Fetch progress for a specific user
 */
const getUserProgress = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const progress = await UserProgress.find({ userId })
            .populate('assignmentId', 'title difficulty')
            .sort({ updatedAt: -1 });

        res.json(progress);
    } catch (error) {
        next(error);
    }
};

/**
 * Save or update user progress for an assignment
 */
const updateUserProgress = async (req, res, next) => {
    try {
        const { userId, assignmentId, lastQuery, completed } = req.body;

        if (!userId || !assignmentId) {
            const error = new Error('UserId and assignmentId are required');
            error.status = 400;
            throw error;
        }

        const updateData = {
            lastQuery: lastQuery || '',
            completed: !!completed,
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
};

module.exports = {
    getUserProgress,
    updateUserProgress
};
