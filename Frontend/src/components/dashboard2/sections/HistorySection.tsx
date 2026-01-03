// dashboard2/sections/HistorySection.tsx
import { History, Search } from 'lucide-react';
import { useState } from 'react';
import QuizHistoryCard from '../components/QuizHistoryCard';
import type { QuizAttempts, Attempt } from '../types';

interface HistorySectionProps {
    quizAttempts: QuizAttempts[];
    onAttemptSelect: (attempt: Attempt) => void;
}

export default function HistorySection({ quizAttempts, onAttemptSelect }: HistorySectionProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAttempts = quizAttempts.filter(quiz =>
        quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (quizAttempts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No quiz history yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Start taking quizzes to build your history and track your progress over time.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Quiz History</h2>
                    <p className="text-sm text-gray-500">
                        {quizAttempts.length} quizzes • {quizAttempts.reduce((acc, curr) => acc + curr.attempts.length, 0)} total attempts
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                                 w-full sm:w-64 transition-all"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {filteredAttempts.length > 0 ? (
                    filteredAttempts.map((quiz) => (
                        <QuizHistoryCard
                            key={quiz.quizId}
                            quiz={quiz}
                            onAttemptSelect={onAttemptSelect}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No quizzes found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
