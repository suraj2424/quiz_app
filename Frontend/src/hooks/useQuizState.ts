import { useState, useCallback } from 'react';
import { AnsweredQuestion, QuizScreen } from '../utils/quizTypes';

export const useQuizState = () => {
  const [currentScreen, setCurrentScreen] = useState<QuizScreen>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [hintClicked, setHintClicked] = useState(false);

  const resetQuiz = useCallback(() => {
    setCurrentScreen('welcome');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShortAnswer('');
    setAnsweredQuestions([]);
    setScore(0);
    setHintClicked(false);
  }, []);

  const startQuiz = useCallback(() => {
    setCurrentScreen('quiz');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShortAnswer('');
    setAnsweredQuestions([]);
    setScore(0);
    setHintClicked(false);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShortAnswer('');
    setHintClicked(false);
  }, []);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShortAnswer('');
      setHintClicked(false);
    }
  }, [currentQuestion]);

  const goToQuestion = useCallback((questionIndex: number, answeredQuestions: AnsweredQuestion[]) => {
    setCurrentQuestion(questionIndex);
    setSelectedAnswer(null);
    setHintClicked(false);
    
    // Restore answer if it exists
    const existingAnswer = answeredQuestions.find(
      q => q.questionIndex === questionIndex
    );
    if (existingAnswer) {
      if (typeof existingAnswer.answerIndex === 'string') {
        setShortAnswer(existingAnswer.answerIndex);
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(existingAnswer.answerIndex);
        setShortAnswer('');
      }
    } else {
      setShortAnswer('');
      setSelectedAnswer(null);
    }
  }, []);

  return {
    // State
    currentScreen,
    currentQuestion,
    selectedAnswer,
    shortAnswer,
    answeredQuestions,
    score,
    hintClicked,
    
    // Setters
    setCurrentScreen,
    setSelectedAnswer,
    setShortAnswer,
    setAnsweredQuestions,
    setScore,
    setHintClicked,
    setCurrentQuestion,
    
    // Actions
    resetQuiz,
    startQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion
  };
};