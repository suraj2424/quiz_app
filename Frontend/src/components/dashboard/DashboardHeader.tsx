import { useAuth } from '../../hooks/useAuth';

export default function DashboardHeader() {
  const { userData } = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.name || 'Student'}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Track your learning progress and achievements
          </p>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Current streak</p>
            <p className="text-2xl font-bold text-purple-600">🔥 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}