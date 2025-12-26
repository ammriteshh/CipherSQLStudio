const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  lastQuery: {
    type: String,
    default: '',
  },
  attempts: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index to ensure one progress record per user-assignment pair
userProgressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);

