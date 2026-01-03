// components/dashboard2/components/QuickStatCard.tsx
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickStatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: number;
    color: 'purple' | 'blue' | 'green' | 'orange';
}

export default function QuickStatCard({ title, value, icon, trend, color }: QuickStatCardProps) {
    const colorConfig = {
        purple: {
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            accent: 'bg-purple-500'
        },
        blue: {
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            accent: 'bg-blue-500'
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            accent: 'bg-green-500'
        },
        orange: {
            bg: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            accent: 'bg-orange-500'
        }
    };

    const config = colorConfig[color];

    const getTrendIcon = () => {
        if (trend === undefined || trend === 0) return <Minus className="w-3 h-3" />;
        return trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
    };

    const getTrendColor = () => {
        if (trend === undefined || trend === 0) return 'text-gray-500 bg-gray-100';
        return trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    };

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 
                        hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50
                        transition-all duration-300 ease-out overflow-hidden">
            {/* Accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${config.accent} 
                            transform origin-left scale-x-0 group-hover:scale-x-100
                            transition-transform duration-300`} />

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${config.iconBg} ${config.iconColor} 
                                    flex items-center justify-center mb-3
                                    group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>

                    {/* Title */}
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

                    {/* Value */}
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                </div>

                {/* Trend indicator */}
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                    ${getTrendColor()} transition-all duration-200`}>
                        {getTrendIcon()}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
