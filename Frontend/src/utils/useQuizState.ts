import { useState, useCallback } from 'react';
import { Quiz, AnsweredQuestion, QuizScreen } from '../utils/quizTypes';

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
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShortAnswer('');
    setHintClicked(false);
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestion(prev => prev - 1);
    setSelectedAnswer(null);
    setHintClicked(false);
  }, []);

  const goToQuestion = useCallback((questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setSelectedAnswer(null);
    setHintClicked(false);
    
    // Restore answer if it exists
    const existingAnswer = answeredQuestions.find(
      q => q.questionIndex === questionIndex
    );
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.answerIndex);
      setShortAnswer(existingAnswer.answerIndex as string || '');
    } else {
      setShortAnswer('');
    }
  }, [answeredQuestions]);

  return {
    currentScreen,
    currentQuestion,
    selectedAnswer,
    shortAnswer,
    answeredQuestions,
    score,
    hintClicked,
    setCurrentScreen,
    setSelectedAnswer,
    setShortAnswer,
    setAnsweredQuestions,
    setScore,
    setHintClicked,
    resetQuiz,
    startQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion
  };
};