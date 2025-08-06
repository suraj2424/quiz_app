// components/dashboard/types.ts (Updated to match your API)
export interface Quiz {
  difficulty: "easy" | "medium" | "hard";
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number;
}

// components/dashboard/types.ts (Exact match to your API)
export interface Attempt {
  attemptId: string;
  score: number;
  totalQuestions: number;  // Your API has this
  timeSpent: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  totalScore: number;      // Your API also has this
  percentage: number;      // Your API has this (not optional)
}

export interface QuizAttempts {
  quizId: string;
  quizTitle: string;
  attempts: Attempt[];
  stats: {
    totalAttempts: number;
    highestScore: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

export interface AnalyticsData {
  averageScore: number;
  totalTimeSpent: number;
  totalAttempts: number;
  completionRate: number;
  scoresTrend?: number;
  attemptsTrend?: number;
  timeTrend?: number;
  completionTrend?: number;
}