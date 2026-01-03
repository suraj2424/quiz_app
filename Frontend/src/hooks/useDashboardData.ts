// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';
import type { QuizAttempts, AnalyticsData } from '../components/dashboard/types';

export const useDashboardData = () => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempts[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token");
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        const [attemptsResponse, analyticsResponse] = await Promise.all([
          fetch(`${backendUrl}/api/attempts/user/quizzes`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/api/analytics/user/current`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!attemptsResponse.ok) {
          throw new Error(`Failed to fetch attempts: ${attemptsResponse.status} ${attemptsResponse.statusText}`);
        }
        if (!analyticsResponse.ok) {
          throw new Error(`Failed to fetch analytics: ${analyticsResponse.status} ${analyticsResponse.statusText}`);
        }

        const [attemptsData, analyticsData] = await Promise.all([
          attemptsResponse.json(),
          analyticsResponse.json()
        ]);

        // Validate and set data with fallbacks
        setQuizAttempts(Array.isArray(attemptsData) ? attemptsData : []);
        setAnalyticsData(analyticsData?.data || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { quizAttempts, analyticsData, loading, error };
};