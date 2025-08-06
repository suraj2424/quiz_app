// components/dashboard/QuickStatCard.tsx
import TrendIndicator from './TrendIndicator';

interface QuickStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

export default function QuickStatCard({ title, value, icon, trend, color }: QuickStatCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center text-sm`}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend !== undefined && <TrendIndicator value={trend} />}
          </div>
        </div>
      </div>
    </div>
  );
}