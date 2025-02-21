const express = require('express');
const router = express.Router();
const { authenticate } = require('../services/authentication');
const Attempt = require('../models/attemptsSchema');

// Get user's analytics
router.get('/user/current', authenticate, async (req, res) => {
  try {
    const userAttempts = await Attempt.find({ user: req.user.id })
      .populate('quiz')
      .sort('-createdAt');

    // Calculate comprehensive analytics
    const analytics = {
      totalQuizzes: new Set(userAttempts.map(a => a.quiz._id)).size,
      totalAttempts: userAttempts.length,
      averageScore: userAttempts.reduce((acc, curr) => 
        acc + (curr.score / curr.totalScore * 100), 0) / userAttempts.length || 0,
      timeSpent: userAttempts.reduce((acc, curr) => acc + curr.timeSpent, 0),
      completionRate: (userAttempts.filter(a => a.completed).length / userAttempts.length) * 100,
      recentAttempts: userAttempts.slice(0, 5).map(attempt => ({
        quizTitle: attempt.quiz.title,
        score: (attempt.score / attempt.totalScore) * 100,
        date: attempt.endTime,
        timeSpent: attempt.timeSpent
      })),
      performanceByDifficulty: userAttempts.reduce((acc, curr) => {
        if (!acc[curr.quiz.difficulty]) {
          acc[curr.quiz.difficulty] = {
            totalAttempts: 0,
            totalScore: 0
          };
        }
        acc[curr.quiz.difficulty].totalAttempts++;
        acc[curr.quiz.difficulty].totalScore += (curr.score / curr.totalScore) * 100;
        return acc;
      }, {})
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get quiz-specific analytics
router.get('/quiz/:quizId', authenticate, async (req, res) => {
  try {
    const quizAttempts = await Attempt.find({ quiz: req.params.quizId })
      .populate('user', 'name');

    const analytics = {
      totalAttempts: quizAttempts.length,
      averageScore: quizAttempts.reduce((acc, curr) => 
        acc + (curr.score / curr.totalScore) * 100, 0) / quizAttempts.length || 0,
      highestScore: Math.max(...quizAttempts.map(a => (a.score / a.totalScore) * 100)),
      averageTime: quizAttempts.reduce((acc, curr) => 
        acc + curr.timeSpent, 0) / quizAttempts.length || 0,
      questionAnalysis: computeQuestionAnalysis(quizAttempts)
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;