const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizSchema'); // Adjust the path as needed
const { authenticate } = require('../services/authentication'); // Adjust the path as needed

// Create a new quiz
router.post('/', authenticate, async (req, res) => {
  try {
    // Sanitize the input
    const sanitizedQuiz = {
      ...req.body,
      createdBy: req.user.id,
      questions: req.body.questions.map(q => ({
        ...q,
        questionText: q.questionText.trim(),
        answerExplanation: q.answerExplanation.trim(),
        hint: q.hint?.trim(),
        correctAnswer: q.correctAnswer?.trim(),
        options: q.options.map(opt => ({
          ...opt,
          optionText: opt.optionText.trim()
        }))
      }))
    };

    const newQuiz = new Quiz(sanitizedQuiz);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Quiz creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
});

// Get all quizzes (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, tags, difficulty, status, minScore, maxScore } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (tags) filter.tags = { $all: tags.split(',') };
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    if (minScore) filter.totalScore = { $gte: Number(minScore) };
    if (maxScore) filter.totalScore = { ...filter.totalScore, $lte: Number(maxScore) };

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer'); // Hide correct answers in listing

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get a specific quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update a quiz
router.put('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (quiz.createdBy.toString() !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedQuiz);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete a quiz
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (quiz.createdBy.toString() !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;