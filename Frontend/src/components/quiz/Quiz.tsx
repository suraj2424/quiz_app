import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import { Quiz as QuizType, User } from '../../utils/quizTypes';
import { useQuizState } from '../../hooks/useQuizState';
import { useQuizTimer } from '../../hooks/useQuizTimer';
import { useQuizAnswers } from '../../hooks/useQuizAnswers';

import QuizWelcome from './QuizWelcome';
import QuizHeader from './QuizHeader';
import QuizNavigation from './QuizNavigation';
import QuizContent from './QuizContent';
import QuizScore from './QuizScore';
import QuizReview from './QuizReview';
import ProgressBar from './ProgressBar';

export default function Quiz() {
  const { id } = useParams();
  const quizId = id?.split("=")[1];
  const cookies = new Cookies();

  // State
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Custom hooks
  const quizState = useQuizState();
  const quizAnswers = useQuizAnswers();
  
  const { timeElapsed, resetTimer, startTime } = useQuizTimer(
    quizState.currentScreen === 'quiz',
    quiz?.timeLimit || 0,
    () => handleTimeUp()
  );

  // Effects
  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz?.randomizeQuestions) {
      setQuiz(prevQuiz => prevQuiz ? {
        ...prevQuiz,
        questions: [...prevQuiz.questions].sort(() => Math.random() - 0.5)
      } : null);
    }
  }, [quiz?.randomizeQuestions]);

  // API calls
  const verifyToken = async () => {
    try {
      const token = cookies.get("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  };

  const fetchQuiz = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    try {
      const response = await fetch(`${backendUrl}/api/quiz/${quizId}`);
      if (!response.ok) throw new Error("Failed to fetch quiz");
      
      const data = await response.json();
      setQuiz({ ...data, timeLimit: data.timeLimit * 60 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleTimeUp = () => {
    toast.info("Time's up! Submitting your quiz...");
    handleQuizSubmit();
  };

  const handleStartQuiz = () => {
    quizState.startQuiz();
    quizAnswers.clearAnswers();
    resetTimer();
  };

  const handleAnswerSelect = (index: number) => {
    quizState.setSelectedAnswer(index);
  };

  const handleShortAnswerChange = (value: string) => {
    quizState.setShortAnswer(value);
  };

  const handleNext = () => {
    if (!quiz) return;
    
    const currentQuestionData = quiz.questions[quizState.currentQuestion];
    const answer = currentQuestionData.questionType === "Short Answer" 
      ? quizState.shortAnswer 
      : quizState.selectedAnswer;

    if (answer === null || (typeof answer === 'string' && !answer.trim())) {
      toast.warning("Please provide an answer before proceeding");
      return;
    }

    // Add answer
    quizAnswers.addAnswer(quizState.currentQuestion, answer, currentQuestionData);

    // Check if last question
    if (quizState.currentQuestion === quiz.questions.length - 1) {
      handleQuizSubmit();
    } else {
      quizState.nextQuestion();
      // Restore next question's answer if it exists
      const nextAnswer = quizAnswers.getAnswer(quizState.currentQuestion + 1);
      if (nextAnswer) {
        if (typeof nextAnswer.answerIndex === 'string') {
          quizState.setShortAnswer(nextAnswer.answerIndex);
        } else {
          quizState.setSelectedAnswer(nextAnswer.answerIndex);
        }
      }
    }
  };

  const handlePrevious = () => {
    quizState.previousQuestion();
    // Restore previous answer
    const prevAnswer = quizAnswers.getAnswer(quizState.currentQuestion - 1);
    if (prevAnswer) {
      if (typeof prevAnswer.answerIndex === 'string') {
        quizState.setShortAnswer(prevAnswer.answerIndex);
      } else {
        quizState.setSelectedAnswer(prevAnswer.answerIndex);
      }
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    quizState.goToQuestion(questionIndex, quizAnswers.answeredQuestions);
  };

  const handleQuizSubmit = async () => {
    if (!quiz || !user || !startTime) return;

    try {
      const token = cookies.get("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Process current question if not answered
      let finalAnswers = [...quizAnswers.answeredQuestions];
      const currentQuestionData = quiz.questions[quizState.currentQuestion];
      const currentAnswer = finalAnswers.find(q => q.questionIndex === quizState.currentQuestion);

      if (!currentAnswer && (quizState.selectedAnswer !== null || quizState.shortAnswer.trim())) {
        const answer = currentQuestionData.questionType === "Short Answer" 
          ? quizState.shortAnswer 
          : quizState.selectedAnswer;
        
        const newAnswer = quizAnswers.addAnswer(quizState.currentQuestion, answer!, currentQuestionData);
        finalAnswers = [...quizAnswers.answeredQuestions];
      }

      const endTime = new Date();
      const timeSpentInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const finalScore = quizAnswers.getTotalScore();

      const formattedAnswers = finalAnswers.map(answer => ({
        questionId: answer.question?._id || quiz.questions[answer.questionIndex]._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
        points: answer.points
      }));

      const attemptData = {
        quiz: quizId,
        user: user.user.id,
        answers: formattedAnswers,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        timeSpent: timeSpentInSeconds,
        completed: true,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalScore: quiz.totalScore
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attemptData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'Failed to save attempt');
      }

      quizState.setScore(finalScore);
      quizState.setCurrentScreen('score');
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error saving attempt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit quiz");
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
      quizState.resetQuiz();
    }
  };

  const handleHintClick = () => {
    quizState.setHintClicked(true);
    setTimeout(() => quizState.setHintClicked(false), 10000);
  };

  const handle5050Click = () => {
    if (!quiz) return;
    
    const currentOptions = quiz.questions[quizState.currentQuestion].options;
    const correctIndex = currentOptions.findIndex(option => option.isCorrect);
    const incorrectIndexes = currentOptions
      .map((_, index) => index)
      .filter(index => index !== correctIndex)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const updatedOptions = currentOptions.map((option, index) => ({
      ...option,
      hidden: incorrectIndexes.includes(index)
    }));

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[quizState.currentQuestion] = {
      ...updatedQuestions[quizState.currentQuestion],
      options: updatedOptions,
    };

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-600 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600">{error || "The requested quiz could not be loaded."}</p>
        </div>
      </div>
    );
  }

  // Render current screen
  return (
    <div className="relative">
      {quizState.currentScreen === 'welcome' && (
        <QuizWelcome quiz={quiz} onStartQuiz={handleStartQuiz} />
      )}

      {quizState.currentScreen === 'quiz' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
          <QuizHeader
            title={quiz.title}
            difficulty={quiz.difficulty}
            timeLimit={quiz.timeLimit}
            timeElapsed={timeElapsed}
            onExit={handleExit}
          />
          
          <div className="flex pt-16">
            <QuizNavigation
              questions={quiz.questions}
              currentQuestion={quizState.currentQuestion}
              answeredQuestions={quizAnswers.answeredQuestions}
              onQuestionSelect={handleQuestionSelect}
            />
            
            <QuizContent
              questions={quiz.questions}
              currentQuestion={quizState.currentQuestion}
              selectedAnswer={quizState.selectedAnswer}
              shortAnswer={quizState.shortAnswer}
              answeredQuestions={quizAnswers.answeredQuestions}
              showHint={quizState.hintClicked}
              onAnswerSelect={handleAnswerSelect}
              onShortAnswerChange={handleShortAnswerChange}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleQuizSubmit}
              onHintClick={handleHintClick}
              on5050Click={handle5050Click}
            />
          </div>
          
          <ProgressBar 
            current={quizAnswers.answeredQuestions.length} 
            total={quiz.questions.length} 
          />
        </div>
      )}

      {quizState.currentScreen === 'score' && (
        <QuizScore
          quiz={quiz}
          score={quizState.score}
          timeElapsed={timeElapsed}
          answeredQuestions={quizAnswers.answeredQuestions}
          onTryAgain={handleStartQuiz}
          onReview={() => quizState.setCurrentScreen('review')}
          onBackToHome={() => quizState.setCurrentScreen('welcome')}
        />
      )}

      {quizState.currentScreen === 'review' && (
        <QuizReview
          quiz={quiz}
          score={quizState.score}
          answeredQuestions={quizAnswers.answeredQuestions}
          onBackToScore={() => quizState.setCurrentScreen('score')}
          onTryAgain={handleStartQuiz}
          onBackToHome={() => quizState.setCurrentScreen('welcome')}
        />
      )}
    </div>
  );
}