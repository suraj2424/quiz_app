// routes/attempts.js
const express = require("express");
const router = express.Router();
const Attempt = require("../models/attemptsSchema");
const { authenticate } = require("../services/authentication");

// POST /api/attempts - Save new attempt
router.post("/", authenticate, async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ["quiz", "answers", "score", "totalQuestions"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

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
    // Fetch all attempts for the logged-in user
    const attempts = await Attempt.find({ user: req.user.id })
      .populate('quiz', 'title') // Populate quiz details
      .sort({ endTime: -1 });

    // Group attempts by quiz
    const quizAttemptsMap = attempts.reduce((acc, attempt) => {
      const quizId = attempt.quiz._id.toString();
      
      if (!acc[quizId]) {
        acc[quizId] = {
          quizId,
          quizTitle: attempt.quiz.title,
          attempts: []
        };
      }

      acc[quizId].attempts.push({
        attemptId: attempt._id,
        score: attempt.score,
        maxScore: attempt.maxScore,
        startTime: attempt.startTime.toISOString(),
        endTime: attempt.endTime.toISOString(),
        timeSpent: attempt.timeSpent
      });

      return acc;
    }, {});

    // Convert map to array and calculate statistics
    const quizAttempts = Object.values(quizAttemptsMap).map(quizData => {
      const scores = quizData.attempts.map(a => a.score);
      
      return {
        ...quizData,
        stats: {
          totalAttempts: quizData.attempts.length,
          highestScore: Math.max(...scores),
          averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
          totalTimeSpent: quizData.attempts.reduce((sum, a) => sum + a.timeSpent, 0),
          latestAttempt: quizData.attempts[0] // Already sorted by endTime
        }
      };
    });

    res.json(quizAttempts);

  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ 
      message: 'Error fetching attempts',
      error: error.message 
    });
  }
});

// GET /api/attempts/:userId/:quizId - Get attempts for specific quiz
router.get('/user/quiz/:quizId', authenticate, async (req, res) => {
  try {
    const attempts = await Attempt.find({
      user: req.user.id,
      quiz: req.params.quizId
    })
    .populate('quiz', 'title')
    .sort({ endTime: -1 });

    if (!attempts.length) {
      return res.status(404).json({
        success: false,
        message: 'No attempts found for this quiz'
      });
    }

    const quizDetails = {
      quizId: attempts[0].quiz._id,
      quizTitle: attempts[0].quiz.title,
      attempts: attempts.map(attempt => ({
        attemptId: attempt._id,
        score: attempt.score,
        maxScore: attempt.maxScore,
        startTime: attempt.startTime.toISOString(),
        endTime: attempt.endTime.toISOString(),
        timeSpent: attempt.timeSpent
      }))
    };

    res.json(quizDetails);

  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching attempts'
    });
  }
});

module.exports = router;
