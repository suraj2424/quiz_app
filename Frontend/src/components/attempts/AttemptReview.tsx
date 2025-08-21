import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

interface QuestionSummary {
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  explanation?: string;
}

interface AttemptSummary {
  attemptId: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  questions: QuestionSummary[];
  statistics: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracy: number;
  };
}

export default function AttemptReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const token = cookies.get('token');
        const res = await fetch(`${backendUrl}/api/attempts/${id}/summary`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to load attempt');
        setSummary(data.data);
      } catch (e) {
        setError('Failed to load attempt details');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load attempt</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-purple-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{summary.quizTitle}</h1>
              <p className="text-gray-600">Attempt Review</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border-2 border-purple-600 text-purple-700 hover:bg-purple-50"
            >
              Back
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat label="Score" value={`${summary.score}/${summary.totalScore}`} />
            <Stat label="Accuracy" value={`${summary.statistics.accuracy.toFixed(1)}%`} />
            <Stat label="Correct" value={summary.statistics.correctAnswers} />
            <Stat label="Incorrect" value={summary.statistics.incorrectAnswers} />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {summary.questions.map((q, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border ${
                q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-gray-900">{i + 1}. {q.questionText}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  q.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Your answer: </span>
                  <span className={q.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {q.userAnswer}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Correct answer: </span>
                  <span className="text-gray-900 font-medium">{q.correctAnswer}</span>
                </div>
                {q.explanation && (
                  <div className="mt-2 p-3 rounded-lg bg-white/70 border border-gray-200 text-gray-700">
                    <p className="text-sm">
                      <span className="font-medium text-purple-700">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/70 border border-gray-200 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-semibold text-gray-900">{value}</div>
    </div>
  );
}
