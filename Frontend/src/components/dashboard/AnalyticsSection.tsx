// components/dashboard/AnalyticsSection.tsx
import { useState } from 'react';
import QuizStatCard from './QuizStatCard';
import PerformanceChart from './PerformanceChart';
import type { QuizAttempts } from './types';
import { formatTime } from '../../utils/formatTime';

interface AnalyticsSectionProps {
  quizAttempts: QuizAttempts[];
}

export default function AnalyticsSection({ quizAttempts }: AnalyticsSectionProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  console.log('AnalyticsSection quizAttempts:', quizAttempts); // Debug log

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '3m', label: 'Last 3 months' },
    { value: 'all', label: 'All time' }
  ];

  // Calculate overall analytics
  const overallStats = calculateOverallStats(quizAttempts);
  
  // Filter data based on selected time range
  const filteredData = filterByTimeRange(quizAttempts, selectedTimeRange);

  if (!quizAttempts || quizAttempts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
        <p className="text-gray-600">Complete some quizzes to see your detailed analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detailed Analytics</h2>
          <p className="text-gray-600">Deep dive into your learning performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="timeRange" className="text-sm font-medium text-gray-700">
            Time Range:
          </label>
          <select
            id="timeRange"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Quizzes"
          value={overallStats.totalQuizzes}
          icon="📚"
          color="blue"
        />
        <MetricCard
          title="Total Attempts"
          value={overallStats.totalAttempts}
          icon="🎯"
          color="green"
        />
        <MetricCard
          title="Average Score"
          value={`${overallStats.averageScore.toFixed(1)}%`}
          icon="⭐"
          color="yellow"
        />
        <MetricCard
          title="Study Time"
          value={formatTime(overallStats.totalTimeSpent)}
          icon="⏰"
          color="purple"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <PerformanceChart quizAttempts={filteredData} />
      </div>

      {/* Quiz Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Performance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizAttempts.map((quiz) => {
            return (
              <QuizStatCard
                key={quiz.quizId}
                quiz={quiz}
                onViewDetails={() => setSelectedQuiz(quiz.quizId)}
              />
            );
          })}
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ScoreDistributionChart quizAttempts={quizAttempts} />
        <CategoryPerformanceChart quizAttempts={quizAttempts} />
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreDistributionChart({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  const allScores = quizAttempts.flatMap(quiz => 
    quiz.attempts.map(attempt => (attempt.score / attempt.totalScore) * 100)
  );

  const distribution = {
    'A (90-100%)': allScores.filter(s => s >= 90).length,
    'B (80-89%)': allScores.filter(s => s >= 80 && s < 90).length,
    'C (70-79%)': allScores.filter(s => s >= 70 && s < 80).length,
    'D (60-69%)': allScores.filter(s => s >= 60 && s < 70).length,
    'F (<60%)': allScores.filter(s => s < 60).length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h4>
      <div className="space-y-3">
        {Object.entries(distribution).map(([grade, count]) => {
          const percentage = allScores.length > 0 ? (count / allScores.length) * 100 : 0;
          return (
            <div key={grade} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{grade}</span>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPerformanceChart({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  // This would be more useful if you have quiz categories/tags
  const timeDistribution = {
    'Quick (< 5 min)': 0,
    'Short (5-15 min)': 0,
    'Medium (15-30 min)': 0,
    'Long (> 30 min)': 0
  };

  quizAttempts.forEach(quiz => {
    quiz.attempts.forEach(attempt => {
      const minutes = attempt.timeSpent / 60;
      if (minutes < 5) timeDistribution['Quick (< 5 min)']++;
      else if (minutes < 15) timeDistribution['Short (5-15 min)']++;
      else if (minutes < 30) timeDistribution['Medium (15-30 min)']++;
      else timeDistribution['Long (> 30 min)']++;
    });
  });

  const total = Object.values(timeDistribution).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Time Distribution</h4>
      <div className="space-y-3">
        {Object.entries(timeDistribution).map(([duration, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={duration} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{duration}</span>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper functions
function calculateOverallStats(quizAttempts: QuizAttempts[]) {
  const totalQuizzes = quizAttempts.length;
  const totalAttempts = quizAttempts.reduce((sum, quiz) => sum + quiz.attempts.length, 0);
  const allScores = quizAttempts.flatMap(quiz => 
    quiz.attempts.map(attempt => (attempt.score / attempt.totalScore) * 100)
  );
  const averageScore = allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
  const totalTimeSpent = quizAttempts.reduce((sum, quiz) => 
    sum + quiz.attempts.reduce((quizSum, attempt) => quizSum + attempt.timeSpent, 0), 0
  );

  return {
    totalQuizzes,
    totalAttempts,
    averageScore,
    totalTimeSpent
  };
}

function filterByTimeRange(quizAttempts: QuizAttempts[], timeRange: string) {
  if (timeRange === 'all') return quizAttempts;
  
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (timeRange) {
    case '7d':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case '3m':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    default:
      return quizAttempts;
  }

  return quizAttempts.map(quiz => ({
    ...quiz,
    attempts: quiz.attempts.filter(attempt => 
      new Date(attempt.endTime) >= cutoffDate
    )
  })).filter(quiz => quiz.attempts.length > 0);
}