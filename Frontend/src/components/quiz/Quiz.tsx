import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuizPage from '../QuizSystem/QuizPage';
import SyncingLoader from '../QuizSystem/views/SyncingLoader';
import { Quiz as QuizData } from '../QuizSystem/types';

export default function Quiz() {
  const { id } = useParams();
  const quizId = id?.split("=")[1]; // Keeping your logic for ID extraction
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error(`Failed to load quiz: ${response.status}`);
        }
        const data = await response.json();
        setQuizData(data);
        setError(null);
      } catch (err) {
        console.error("INITIAL_LOAD_FAILURE", err);
        setError("We couldn't load this quiz. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchInitialData();
      return;
    }

    setError("This quiz link is missing an id.");
    setLoading(false);
  }, [quizId]);

  if (loading) {
    return (
      <SyncingLoader
        title="Loading quiz"
        message="Please wait while we prepare your questions."
      />
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-rose-100 flex items-center justify-center p-6 font-mono">
        <div className="max-w-xl w-full border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase">Unable to load quiz</h2>
          <p className="mt-4 font-bold text-zinc-700">
            {error ?? "The quiz could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return <QuizPage quiz={quizData} />;
}
