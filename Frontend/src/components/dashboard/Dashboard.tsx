// components/dashboard/Dashboard.tsx
import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import TabNavigation from './TabNavigation';
import OverviewSection from './OverviewSection';
import AnalyticsSection from './AnalyticsSection';
import HistorySection from './HistorySection';
import LoadingSpinner from '../UI/LoadingSpinner';
import AttemptSummaryModal from './AttemptSummaryModal';
import { useDashboardData } from '../../hooks/useDashboardData';
import type { Attempt } from './types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  
  const { quizAttempts, analyticsData, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        
        <DashboardHeader />
        
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-8">
          {activeTab === 'overview' && (
            <OverviewSection 
              quizAttempts={quizAttempts}
              analyticsData={analyticsData}
            />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsSection quizAttempts={quizAttempts} />
          )}
          
          {activeTab === 'history' && (
            <HistorySection 
              quizAttempts={quizAttempts}
              onAttemptSelect={setSelectedAttempt}
            />
          )}
        </div>
      </div>

      <AttemptSummaryModal
        attempt={selectedAttempt}
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
      />
    </div>
  );
}