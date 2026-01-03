// dashboard2/sections/AnalyticsSection.tsx
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { QuizAttempts } from '../types';
import { TimeRangeSelector } from '../components/analytics/TimeRangeSelector';
import { PerformanceMetrics } from '../components/analytics/PerformanceMetrics';
import { PerformanceTrends } from '../components/analytics/PerformanceTrends';
import { QuizBreakdown } from '../components/analytics/QuizBreakdown';
import { PerformanceDistribution, CategoryPerformanceChart } from '../components/analytics/PerformanceDistribution';

interface AnalyticsSectionProps {
    quizAttempts: QuizAttempts[];
}

export default function AnalyticsSection({ quizAttempts }: AnalyticsSectionProps) {
    const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

    // Calculate overall analytics
    const overallStats = calculateOverallStats(quizAttempts);

    // Filter data based on selected time range
    const filteredData = filterByTimeRange(quizAttempts, selectedTimeRange);

    if (!quizAttempts || quizAttempts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
                <p className="text-gray-600">Complete some quizzes to see your detailed analytics.</p>
            </div>
        );
    }

    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range);
    };

    const handleQuizSelect = (quizId: string) => {
        setSelectedQuiz(quizId);
    };

    return (
        <div className="space-y-6">
            {/* Header with Time Range Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-gray-600">Deep dive into your learning performance</p>
                </div>
                <TimeRangeSelector
                    selectedTimeRange={selectedTimeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                />
            </div>

            {/* Overall Performance Metrics */}
            <PerformanceMetrics
                totalQuizzes={overallStats.totalQuizzes}
                totalAttempts={overallStats.totalAttempts}
                averageScore={overallStats.averageScore}
                totalTimeSpent={overallStats.totalTimeSpent}
            />

            {/* Performance Trends */}
            <PerformanceTrends quizAttempts={filteredData} />

            {/* Quiz Breakdown */}
            <QuizBreakdown
                quizAttempts={quizAttempts}
                onQuizSelect={handleQuizSelect}
            />

            {/* Performance Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
                <PerformanceDistribution quizAttempts={quizAttempts} />
                <CategoryPerformanceChart quizAttempts={quizAttempts} />
            </div>
        </div>
    );
}

// Helper functions
function calculateOverallStats(quizAttempts: QuizAttempts[]) {
    if (!quizAttempts || quizAttempts.length === 0) {
        return {
            totalQuizzes: 0,
            totalAttempts: 0,
            averageScore: 0,
            totalTimeSpent: 0
        };
    }

    const totalQuizzes = quizAttempts.length;
    const totalAttempts = quizAttempts.reduce((sum, quiz) => sum + (quiz.attempts?.length || 0), 0);

    const allScores = quizAttempts.flatMap(quiz =>
        (quiz.attempts || []).map(attempt => {
            if (!attempt.totalScore || attempt.totalScore === 0) return 0;
            const score = (attempt.score / attempt.totalScore) * 100;
            return isNaN(score) ? 0 : score;
        })
    ).filter(score => score >= 0);

    const averageScore = allScores.length > 0
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
        : 0;

    const totalTimeSpent = quizAttempts.reduce((sum, quiz) =>
        sum + (quiz.attempts || []).reduce((quizSum, attempt) =>
            quizSum + (attempt.timeSpent || 0), 0
        ), 0
    );

    return {
        totalQuizzes,
        totalAttempts,
        averageScore: isNaN(averageScore) ? 0 : averageScore,
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
        attempts: (quiz.attempts || []).filter(attempt =>
            new Date(attempt.endTime) >= cutoffDate
        )
    })).filter(quiz => quiz.attempts.length > 0);
}
