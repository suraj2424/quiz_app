// routes/attempts.js
const express = require("express");
const router = express.Router();
const Attempt = require("../models/attemptsSchema");
const { authenticate } = require("../services/authentication");
const { Quiz } = require("../models/quizSchema");

// POST /api/attempts - Save new attempt
router.post("/", authenticate, async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ["quiz", "answers", "score", "totalQuestions"];
    // Only treat fields as missing if they are undefined or null (allow 0 for numeric fields)
    const missingFields = requiredFields.filter((field) => req.body[field] === undefined || req.body[field] === null);

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Create new attempt with validated data
    const attempt = new Attempt({
      quiz: req.body.quiz,
      user: req.user.id,
      answers: req.body.answers,
      score: req.body.score,
      totalQuestions: req.body.totalQuestions,
      timeSpent: req.body.timeSpent,
      completed: req.body.completed || false,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      totalScore: req.body.totalScore,
    });

    const savedAttempt = await attempt.save();

    res.status(201).json({
      success: true,
      data: savedAttempt,
    });
  } catch (error) {
    console.error("Attempt save error:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate attempt",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error saving attempt",
      message: error.message,
    });
  }
});

router.get('/user/quizzes', authenticate, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id })
      .populate('quiz', 'title difficulty')
      .sort({ endTime: -1 });

    // Group attempts by quiz
    const quizAttemptsMap = attempts.reduce((acc, attempt) => {
      const quizId = attempt.quiz._id.toString();
      
      if (!acc[quizId]) {
        acc[quizId] = {
          quizId,
          quizTitle: attempt.quiz.title,
          quiz: attempt.quiz,
          attempts: [],
          stats: {
            totalAttempts: 0,
            highestScore: 0,
            averageScore: 0,
            totalTimeSpent: 0
          }
        };
      }

      // Add attempt
      acc[quizId].attempts.push({
        attemptId: attempt._id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        timeSpent: attempt.timeSpent,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        completed: attempt.completed,
        totalScore: attempt.totalScore,
        percentage: (attempt.score / attempt.totalScore) * 100
      });

      // Update stats
      const stats = acc[quizId].stats;
      stats.totalAttempts++;
      stats.totalTimeSpent += attempt.timeSpent || 0;
      stats.highestScore = Math.max(stats.highestScore, (attempt.score / attempt.totalScore) * 100);
      stats.averageScore = acc[quizId].attempts.reduce((sum, att) => 
        sum + (att.score / att.totalScore) * 100, 0) / stats.totalAttempts;

      return acc;
    }, {});

    // Convert map to array
    const groupedAttempts = Object.values(quizAttemptsMap);

    res.json(groupedAttempts);

  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({
      success: false, 
      error: 'Error fetching attempts'
    });
  }
});

router.get('/:id/summary', authenticate, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quiz');  // Make sure to populate quiz

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Attempt not found'
      });
    }

    const quiz = attempt.quiz;

    // Calculate summary statistics
    const summary = {
      attemptId: attempt._id,
      quizTitle: quiz.title,
      score: attempt.score,
      totalScore: attempt.totalScore,
      timeSpent: attempt.timeSpent,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      questions: quiz.questions.map(q => ({
        questionText: q.questionText,
        userAnswer: attempt.answers.find(a => a.questionId.toString() === q._id.toString())?.selectedOption || 'Not answered',
        correctAnswer: q.correctAnswer || q.options.find(opt => opt.isCorrect)?.optionText,
        isCorrect: attempt.answers.find(a => a.questionId.toString() === q._id.toString())?.isCorrect || false,
        points: q.points,
        earnedPoints: attempt.answers.find(a => a.questionId.toString() === q._id.toString())?.isCorrect ? q.points : 0,
        explanation: q.answerExplanation
      })),
      statistics: {
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.answers.filter(a => a.isCorrect).length,
        incorrectAnswers: attempt.answers.filter(a => !a.isCorrect).length,
        accuracy: ((attempt.score / attempt.totalScore) * 100) || 0
      }
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching attempt summary:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching attempt summary'
    });
  }
});

module.exports = router;
