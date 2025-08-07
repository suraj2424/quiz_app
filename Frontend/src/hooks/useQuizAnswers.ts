import { useState, useCallback } from 'react';
import { AnsweredQuestion, Question } from '../utils/quizTypes';
import { checkAnswer } from '../utils/quizHelpers';

export const useQuizAnswers = () => {
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

  const addAnswer = useCallback((
    questionIndex: number,
    answer: number | string,
    question: Question
  ) => {
    const result = checkAnswer(question, answer);
    
    const newAnswer: AnsweredQuestion = {
      questionIndex,
      answerIndex: answer,
      selectedAnswer: answer,
      isCorrect: result.isCorrect,
      points: result.points,
      question
    };

    setAnsweredQuestions(prev => {
      const existingIndex = prev.findIndex(q => q.questionIndex === questionIndex);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });

    return newAnswer;
  }, []);

  const getAnswer = useCallback((questionIndex: number) => {
    return answeredQuestions.find(q => q.questionIndex === questionIndex);
  }, [answeredQuestions]);

  const clearAnswers = useCallback(() => {
    setAnsweredQuestions([]);
  }, []);

  const getTotalScore = useCallback(() => {
    return answeredQuestions.reduce((total, answer) => total + (answer.points || 0), 0);
  }, [answeredQuestions]);

  return {
    answeredQuestions,
    addAnswer,
    getAnswer,
    clearAnswers,
    getTotalScore,
    setAnsweredQuestions
  };
};