// components/QuizCard/QuizCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import QuizCardHeader from "./QuizCardHeader";
import QuizCardInfo from "./QuizCardInfo";
import QuizCardFooter from "./QuizCardFooter";
import AuthDialog from "./AuthDialog";
import ErrorAlert from "./ErrorAlert";
import { useQuizAuth } from "../../hooks/useQuizAuth";

export interface Quiz {
  _id: string;
  title: string;
  difficulty: string;
  questionCount: number;
  tags: string[];
  createdBy: {
    name?: string;
  };
}

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("token");

  const {
    isLoading,
    error,
    clearError,
    handleStartQuiz: startQuizProcess
  } = useQuizAuth();

  const handleStartQuiz = async () => {
    const success = await startQuizProcess(token, quiz._id);
    
    if (success === 'AUTH_REQUIRED') {
      setShowAuthDialog(true);
    } else if (success === true) {
      navigate(`/quiz/id=${quiz._id}`);
    }
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  const handleRegister = () => {
    setShowAuthDialog(false);
    navigate("/register?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
          <QuizCardHeader 
            title={quiz.title}
            difficulty={quiz.difficulty}
            tags={quiz.tags}
          />
          
          <QuizCardInfo 
            questionCount={quiz.questionCount}
            estimatedTime={Math.ceil(quiz.questionCount * 1.5)}
          />
          
          <QuizCardFooter
            createdBy={quiz.createdBy}
            onStartQuiz={handleStartQuiz}
            isLoading={isLoading}
          />
        </div>

        <ErrorAlert 
          error={error}
          onClose={clearError}
          isVisible={!!error && !showAuthDialog}
        />
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
        onClearError={clearError}
      />
    </>
  );
}