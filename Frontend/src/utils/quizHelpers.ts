import { Question, AnsweredQuestion } from './quizTypes';

export const calculateLevenshteinRatio = (a: string, b: string): number => {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
};

export const checkAnswer = (
  question: Question,
  userAnswer: number | string
): { isCorrect: boolean; points: number } => {
  try {
    if (question.questionType === "Short Answer") {
      const correctAnswer = question.options[0].optionText;
      const userText = String(userAnswer).trim();
      const similarity = calculateLevenshteinRatio(
        userText.toLowerCase(),
        correctAnswer.toLowerCase()
      );
      const isCorrect = similarity >= 0.85;
      const points = isCorrect
        ? question.points
        : Math.floor(question.points * similarity);

      return { isCorrect, points };
    }

    if (question.questionType === "Multiple Choice" || question.questionType === "True/False") {
      const selectedOption = question.options[Number(userAnswer)];
      const isCorrect = selectedOption?.isCorrect ?? false;
      const points = isCorrect ? question.points : 0;

      return { isCorrect, points };
    }

    return { isCorrect: false, points: 0 };
  } catch (error) {
    console.error("Error checking answer:", error);
    return { isCorrect: false, points: 0 };
  }
};

export const calculateFinalScore = (answers: AnsweredQuestion[]): number => {
  return answers.reduce((total, answer) => total + (answer.points || 0), 0);
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-700 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "HARD":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getPerformanceMessage = (score: number, totalScore: number): string => {
  const percentage = (score / totalScore) * 100;
  
  if (percentage === 100) {
    return "🎉 Perfect Score! Outstanding performance!";
  } else if (percentage >= 80) {
    return "🌟 Excellent work! You've got a strong understanding!";
  } else if (percentage >= 60) {
    return "👍 Good job! Keep practicing to improve!";
  } else {
    return "💪 Keep learning! You'll do better next time!";
  }
};