import { initialState, QuizAction, QuizState } from "./types";

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...initialState,
        status: "IN_PROGRESS",
        startTime: new Date(),
      };
    case "TICK":
      if (state.status !== "IN_PROGRESS") {
        return state;
      }
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionIndex]: action.answer },
      };
    case "GO_TO_QUESTION":
      return { ...state, currentQuestionIndex: action.index };
    case "SUBMIT_ATTEMPT":
      if (state.status !== "IN_PROGRESS") {
        return state;
      }
      return {
        ...state,
        status: "SUBMITTING",
        endTime: new Date(),
        error: null,
      };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        status: "COMPLETED",
        score: action.score,
        endTime: state.endTime ?? new Date(),
        error: null,
      };
    case "SUBMIT_ERROR":
      return { ...state, status: "ERROR", error: action.error };
    case "START_REVIEW":
      return { ...state, status: "REVIEWING", currentQuestionIndex: 0 };
    case "SHOW_RESULTS":
      return { ...state, status: "COMPLETED" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};
