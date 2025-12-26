const mongoose = require('mongoose');

const tableDefinitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createTableSQL: {
    type: String,
    required: true,
  },
  sampleData: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  expectedResult: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  tableDefinitions: {
    type: [tableDefinitionSchema],
    required: true,
  },
  hints: {
    type: [String],
    default: [],
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

assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);

