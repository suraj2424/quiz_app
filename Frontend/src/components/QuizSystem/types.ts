export type QuizStatus =
  | "WELCOME"
  | "IN_PROGRESS"
  | "SUBMITTING"
  | "COMPLETED"
  | "REVIEWING"
  | "ERROR";

export interface QuestionOption {
  optionText: string;
  isCorrect?: boolean;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string | number;
  points: number;
  questionType?: string;
  hint?: string;
  answerExplanation?: string;
}

export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
  noOfQuestions?: number;
  createdBy?: {
    name?: string;
  };
}

export interface QuizState {
  status: QuizStatus;
  currentQuestionIndex: number;
  answers: Record<number, string | number>; // questionIndex -> answer
  startTime: Date | null;
  endTime: Date | null;
  score: number;
  error: string | null;
  elapsedSeconds: number;
}

export type QuizAction =
  | { type: "START_QUIZ" }
  | { type: "TICK" }
  | { type: "SET_ANSWER"; questionIndex: number; answer: string | number }
  | { type: "GO_TO_QUESTION"; index: number }
  | { type: "SUBMIT_ATTEMPT" }
  | { type: "SUBMIT_SUCCESS"; score: number }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "START_REVIEW" }
  | { type: "SHOW_RESULTS" }
  | { type: "RESET" };

export const initialState: QuizState = {
  status: "WELCOME",
  currentQuestionIndex: 0,
  answers: {}, // Stores index: value pairs
  startTime: null,
  endTime: null,
  score: 0,
  error: null,
  elapsedSeconds: 0,
};
