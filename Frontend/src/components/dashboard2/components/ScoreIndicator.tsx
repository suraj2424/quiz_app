// components/dashboard2/components/ScoreIndicator.tsx
import { Trophy, Star, ThumbsUp, TrendingUp, BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface ScoreIndicatorProps {
    score: number;
}

export default function ScoreIndicator({ score }: ScoreIndicatorProps) {
    // Handle undefined/null/NaN scores
    const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;

    const getIndicator = (score: number): { color: string; bg: string; icon: ReactNode } => {
        if (score >= 90) return { color: 'text-green-600', bg: 'bg-green-100', icon: <Trophy className="w-4 h-4" /> };
        if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-100', icon: <Star className="w-4 h-4" /> };
        if (score >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <ThumbsUp className="w-4 h-4" /> };
        if (score >= 60) return { color: 'text-orange-600', bg: 'bg-orange-100', icon: <TrendingUp className="w-4 h-4" /> };
        return { color: 'text-red-600', bg: 'bg-red-100', icon: <BookOpen className="w-4 h-4" /> };
    };

    const indicator = getIndicator(validScore);

    return (
        <div className={`w-8 h-8 rounded-full ${indicator.bg} ${indicator.color} flex items-center justify-center`}>
            {indicator.icon}
        </div>
    );
}
