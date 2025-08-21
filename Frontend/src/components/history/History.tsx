import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

interface AttemptItem {
  attemptId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  totalScore: number;
  percentage: number;
}

interface GroupedAttemptsItem {
  quizId: string;
  quizTitle: string;
  attempts: AttemptItem[];
  stats: {
    totalAttempts: number;
    highestScore: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

export default function History() {
  const { id } = useParams(); // not used by API; API uses token-bound user
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [data, setData] = useState<GroupedAttemptsItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = cookies.get('token');
        if (!token) {
          setError('Authentication required.');
          setLoading(false);
          return;
        }
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/attempts/user/quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load history');
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
        <div className="bg-white/80 backdrop-blur rounded-xl shadow border border-red-200 p-6 max-w-lg w-full text-center">
          <h2 className="text-red-600 font-semibold mb-2">Could not load history</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow border border-purple-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600">No attempts found yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Quiz History</h1>
          <button
            className="px-4 py-2 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          {data.map((group) => (
            <div key={group.quizId} className="bg-white/80 backdrop-blur rounded-2xl shadow border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{group.quizTitle}</h2>
                  <p className="text-sm text-gray-600">
                    Attempts: {group.stats.totalAttempts} · Best: {group.stats.highestScore.toFixed(1)}% · Avg: {group.stats.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-600 border-b">
                      <th className="py-2 pr-2">Attempt</th>
                      <th className="py-2 pr-2">Score</th>
                      <th className="py-2 pr-2">Time</th>
                      <th className="py-2 pr-2">Date</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.attempts.map((a, idx) => (
                      <tr key={a.attemptId} className="border-b last:border-0">
                        <td className="py-2 pr-2">#{idx + 1}</td>
                        <td className="py-2 pr-2">{Math.round((a.score / a.totalScore) * 100)}% ({a.score}/{a.totalScore})</td>
                        <td className="py-2 pr-2">{Math.floor((a.timeSpent || 0) / 60)}m {(a.timeSpent || 0) % 60}s</td>
                        <td className="py-2 pr-2">{new Date(a.endTime).toLocaleString()}</td>
                        <td className="py-2 pr-2">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                              onClick={() => navigate(`/attempt/${a.attemptId}`)}
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
