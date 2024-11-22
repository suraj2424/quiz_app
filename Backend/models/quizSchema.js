const mongoose = require("mongoose");

// Option Schema (for Multiple Choice and True/False questions)
const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

// Question Schema
const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ["Multiple Choice", "True/False", "Short Answer"],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (value) {
        if (this.questionType === "Multiple Choice") {
          return Array.isArray(value) && value.length === 4;
        }
        if (this.questionType === "True/False") {
          return Array.isArray(value) && value.length === 2;
        }
        return true; // For Short Answer
      },
      message: props => {
        if (props.value.questionType === "Multiple Choice") {
          return "Multiple Choice questions must have exactly 4 options.";
        }
        if (props.value.questionType === "True/False") {
          return "True/False questions must have exactly 2 options.";
        }
        return "Invalid options configuration.";
      }
    }
  },
  correctAnswer: {
    type: String,
    required: function() { return this.questionType === "Short Answer"; },
    trim: true,
    validate: {
      validator: function(value) {
        return this.questionType !== "Short Answer" || (value && value.trim().length > 0);
      },
      message: "Correct answer is required for Short Answer questions."
    }
  },
  hint: {
    type: String,
    trim: true
  },
  answerExplanation: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: [1, "Points must be at least 1"],
    max: [100, "Points cannot exceed 100"]
  },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  noOfQuestions: {
    type: Number,
    required: true,
    min: [1, "Quiz must have at least one question"]
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
    min: [1, "Time limit must be at least 1 minute"],
    max: [180, "Time limit cannot exceed 180 minutes"]
  },
  totalScore: {
    type: Number,
    default: 0
  },
  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
  randomizeOptions: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: "Cannot have more than 10 tags"
    }
  },
  category: {
    type: String,
    trim: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Quiz must have at least one question"
    }
  },
  status: {
    type: String,
    enum: ["Draft", "Published", "Archived"],
    default: "Draft",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  timestamps: true
});

// Pre-save middleware to calculate total score and validate questions
quizSchema.pre('save', function(next) {
  // Calculate total score
  this.totalScore = this.questions.reduce((sum, question) => sum + question.points, 0);
  
  // Validate noOfQuestions matches actual questions length
  if (this.noOfQuestions !== this.questions.length) {
    this.noOfQuestions = this.questions.length;
  }

  // Validate options for Multiple Choice and True/False questions
  const validationError = this.questions.find((question, idx) => {
    if (question.questionType === "Multiple Choice" || question.questionType === "True/False") {
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return true;
      }
    }
    return false;
  });

  if (validationError) {
    next(new Error("Each question must have exactly one correct answer"));
    return;
  }

  next();
});

module.exports = mongoose.model("quizzes", quizSchema);