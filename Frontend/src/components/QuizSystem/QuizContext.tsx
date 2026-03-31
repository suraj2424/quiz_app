import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { QuizState, QuizAction, initialState } from "./types";
import { quizReducer } from "./quizReducer";

// 1. Create the Context (The "Pipe")
const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | undefined>(undefined);

// 2. The Provider (The "Water Tank")
// This is the ONLY component that returns <QuizContext.Provider>
export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    if (state.status !== "IN_PROGRESS") {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [state.status]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

// 3. The Hook (The "Tap")
export const useQuizSystem = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizSystem must be used inside QuizProvider.");
  }
  return context;
};
