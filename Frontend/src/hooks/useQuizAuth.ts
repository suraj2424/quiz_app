// hooks/useQuizAuth.ts
import { useState } from 'react';

export const useQuizAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (token: string | undefined, quizId: string) => {
    if (isLoading) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!token) {
        return 'AUTH_REQUIRED';
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/verify-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setError("Session expired. Please login again.");
        return 'AUTH_REQUIRED';
      }

      return true;
    } catch (err) {
      setError("An error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    clearError,
    handleStartQuiz,
  };
};