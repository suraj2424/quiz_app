// dashboard2/sections/OverviewSection.tsx
import { Target, FileText, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import QuickStatCard from '../components/QuickStatCard';
import PerformanceChart from '../components/PerformanceChart';
import RecentActivity from '../components/RecentActivity';
import QuizSummaryCard from '../components/QuizSummaryCard';
import { formatTime } from '../../../utils/formatTime';
import type { QuizAttempts, AnalyticsData } from '../types';

interface OverviewSectionProps {
    quizAttempts: QuizAttempts[];
    analyticsData: AnalyticsData | null;
    onNavigateToHistory?: () => void;
}

export default function OverviewSection({
    quizAttempts,
    analyticsData,
    onNavigateToHistory
}: OverviewSectionProps) {
    const stats = [
        {
            title: 'Average Score',
            value: `${(analyticsData?.averageScore || 0).toFixed(1)}%`,
            icon: <Target className="w-5 h-5" />,
            trend: analyticsData?.scoresTrend,
            color: 'purple' as const
        },
        {
            title: 'Total Attempts',
            value: analyticsData?.totalAttempts || 0,
            icon: <FileText className="w-5 h-5" />,
            trend: analyticsData?.attemptsTrend,
            color: 'blue' as const
        },
        {
            title: 'Time Studied',
            value: formatTime(analyticsData?.totalTimeSpent || 0),
            icon: <Clock className="w-5 h-5" />,
            trend: analyticsData?.timeTrend,
            color: 'green' as const
        },
        {
            title: 'Completion Rate',
            value: `${(analyticsData?.completionRate || 0).toFixed(0)}%`,
            icon: <CheckCircle className="w-5 h-5" />,
            trend: analyticsData?.completionTrend,
            color: 'orange' as const
        }
    ];

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <QuickStatCard key={index} {...stat} />
                ))}
            </div>

            {/* Chart and Recent Activity - Side by side */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Performance Chart - Takes more space */}
                <div className="lg:col-span-3">
                    <PerformanceChart quizAttempts={quizAttempts} />
                </div>

                {/* Recent Activity - Compact sidebar */}
                <div className="lg:col-span-2">
                    <RecentActivity
                        quizAttempts={quizAttempts}
                        maxItems={4}
                        onShowMore={onNavigateToHistory}
                    />
                </div>
            </div>

            {/* Quiz Summary Section */}
            {quizAttempts && quizAttempts.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Your Quizzes</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {quizAttempts.length} quiz{quizAttempts.length !== 1 ? 'zes' : ''} available
                            </p>
                        </div>

                        {quizAttempts.length > 3 && (
                            <button
                                onClick={onNavigateToHistory}
                                className="flex items-center gap-1.5 text-sm font-medium text-purple-600 
                                           hover:text-purple-700 transition-colors group"
                            >
                                <span>View all</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizAttempts.slice(0, 3).map((quiz) => (
                            <QuizSummaryCard
                                key={quiz.quizId}
                                quiz={quiz}
                                onClick={() => {
                                    console.log('Navigate to quiz:', quiz.quizId);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
