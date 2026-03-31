import { QuizProvider } from "./QuizContext";
import QuizManager from "./QuizManager";
import { Quiz } from "./types";

interface QuizPageProps {
  quiz: Quiz;
}

export default function QuizPage({ quiz }: QuizPageProps) {
  return (
    <QuizProvider>
      <QuizManager quiz={quiz} />
    </QuizProvider>
  );
}
