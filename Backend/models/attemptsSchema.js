// attemptSchema.ts
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'quizzes', 
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: String,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number
  },analysisData: {
    timePerQuestion: Number,
    accuracyRate: Number,
    improvementRate: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for calculating percentage score
AttemptSchema.virtual('percentageScore').get(function() {
  return (this.score / this.totalScore) * 100;
});

// Add methods for analytics
AttemptSchema.methods.calculateAnalytics = function() {
  const timePerQuestion = this.timeSpent / this.totalQuestions;
  const accuracyRate = (this.score / this.totalScore) * 100;
  
  return {
    timePerQuestion,
    accuracyRate
  };
};

const Attempt = mongoose.model('attempts', AttemptSchema);

module.exports = Attempt;