// src/hooks/useQuizData.ts
import { useState, useEffect } from 'react';

export interface Quiz {
  _id: string;
  id: number;
  title: string;
  tags: string[];
  difficulty: string;
  questionCount: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[];
  createdBy: {
    name?: string;
  };
}

interface UseQuizDataReturn {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useQuizData = (): UseQuizDataReturn => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${backendUrl}/api/quiz`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formattedQuizzes = data.map((quiz: Quiz) => ({
          _id: quiz._id,
          id: quiz.id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          tags: quiz.tags,
          questionCount: quiz.questions.length,
          questions: quiz.questions,
          createdBy: { name: quiz.createdBy?.name },
        }));
        
        setQuizzes(formattedQuizzes);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching quizzes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return {
    quizzes,
    isLoading,
    error,
    refetch: fetchQuizzes,
  };
};