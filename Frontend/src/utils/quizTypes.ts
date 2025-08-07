export interface Option {
  optionText: string;
  isCorrect: boolean;
  hidden?: boolean;
}

export interface Question {
  questionType: "Multiple Choice" | "True/False" | "Short Answer";
  questionText: string;
  options: Option[];
  hint?: string;
  answerExplanation: string;
  points: number;
  _id: string;
  correctAnswer: number;
}

export interface Quiz {
  title: string;
  description: string;
  noOfQuestions: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  tags: string[];
  category: string;
  questions: Question[];
  status: "Draft" | "Published" | "Archived";
  totalScore: number;
}

export interface AnsweredQuestion {
  questionIndex: number;
  answerIndex: number | string;
  selectedAnswer?: number | string;
  isCorrect?: boolean;
  points?: number;
  question?: Question;
}

export interface User {
  user: {
    name: string;
    id: string;
    email: string;
  };
}

export type QuizScreen = 'welcome' | 'quiz' | 'score' | 'review';