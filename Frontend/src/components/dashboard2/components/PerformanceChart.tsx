// components/dashboard2/components/PerformanceChart.tsx
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Calendar } from 'lucide-react';
import type { QuizAttempts } from '../types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface PerformanceChartProps {
    quizAttempts: QuizAttempts[];
}

export default function PerformanceChart({ quizAttempts }: PerformanceChartProps) {
    const chartData = useMemo(() => {
        const allAttempts = quizAttempts
            .flatMap((quiz) =>
                quiz.attempts.map((attempt) => ({
                    date: new Date(attempt.endTime),
                    score: (attempt.score / attempt.totalScore) * 100,
                }))
            )
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(-10); // Show last 10 attempts

        const labels = allAttempts.map(a =>
            a.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        const scores = allAttempts.map(a => a.score);

        // Calculate average
        const avg = scores.length > 0
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;

        return { labels, scores, average: avg };
    }, [quizAttempts]);

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                data: chartData.scores,
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.2)');
                    gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(147, 51, 234)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.04)',
                    drawBorder: false,
                },
                ticks: {
                    callback: (value: number | string) => `${value}%`,
                    font: { size: 11 },
                    color: '#9ca3af',
                    padding: 8,
                },
                border: { display: false }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11 },
                    color: '#9ca3af',
                    padding: 4,
                },
                border: { display: false }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#6b7280',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (items: any[]) => items[0]?.label || '',
                    label: (item: any) => `Score: ${item.raw.toFixed(1)}%`
                }
            }
        }
    };

    const hasData = chartData.scores.length > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 
                        hover:border-gray-200 transition-colors duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">Performance Trend</h3>
                    </div>
                    <p className="text-sm text-gray-500">Your score progression over time</p>
                </div>

                {hasData && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                            {chartData.average.toFixed(0)}% avg
                        </span>
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="h-56">
                {hasData ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <Calendar className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">No data yet</p>
                        <p className="text-xs text-gray-400">Complete quizzes to see your trend</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            {hasData && (
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-500">Quiz Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            {chartData.scores.length} attempts shown
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
