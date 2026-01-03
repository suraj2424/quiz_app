// dashboard2/Dashboard.tsx
import { useState } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import OverviewSection from './sections/OverviewSection';
import AnalyticsSection from './sections/AnalyticsSection';
import HistorySection from './sections/HistorySection';
import LoadingSpinner from '../UI/LoadingSpinner';
import AttemptSummaryModal from './components/AttemptSummaryModal';
import { useDashboardData } from '../../hooks/useDashboardData';
import type { Attempt, BreadcrumbItem } from './types';

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');
    const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

    const { quizAttempts, analyticsData, loading, error } = useDashboardData();

    // Define breadcrumbs based on active section
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const base: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/dashboard' }];

        if (activeSection === 'analytics') {
            return [...base, { label: 'Analytics' }];
        } else if (activeSection === 'history') {
            return [...base, { label: 'History' }];
        }

        return base;
    };

    // Define page title and description based on active section
    const getPageInfo = () => {
        switch (activeSection) {
            case 'analytics':
                return {
                    title: 'Detailed Analytics',
                    description: 'Deep dive into your learning performance'
                };
            case 'history':
                return {
                    title: 'Quiz History',
                    description: 'View all your past quiz attempts'
                };
            default:
                return {
                    title: 'Overview',
                    description: 'Track your learning progress and achievements'
                };
        }
    };

    const handleNavigateToHistory = () => {
        setActiveSection('history');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
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

    const pageInfo = getPageInfo();

    return (
        <>
            <DashboardLayout
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                pageTitle={pageInfo.title}
                pageDescription={pageInfo.description}
                breadcrumbs={getBreadcrumbs()}
            >
                {/* Render active section */}
                {activeSection === 'overview' && (
                    <OverviewSection
                        quizAttempts={quizAttempts}
                        analyticsData={analyticsData}
                        onNavigateToHistory={handleNavigateToHistory}
                    />
                )}

                {activeSection === 'analytics' && (
                    <AnalyticsSection quizAttempts={quizAttempts} />
                )}

                {activeSection === 'history' && (
                    <HistorySection
                        quizAttempts={quizAttempts}
                        onAttemptSelect={setSelectedAttempt}
                    />
                )}

                {/* Settings and Help sections - placeholders */}
                {activeSection === 'settings' && (
                    <div className="text-center py-12">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                        <p className="text-gray-600 mt-2">Settings page coming soon</p>
                    </div>
                )}

                {activeSection === 'help' && (
                    <div className="text-center py-12">
                        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Help & Support</h3>
                        <p className="text-gray-600 mt-2">Help page coming soon</p>
                    </div>
                )}
            </DashboardLayout>

            {/* Attempt Summary Modal */}
            <AttemptSummaryModal
                attempt={selectedAttempt}
                isOpen={!!selectedAttempt}
                onClose={() => setSelectedAttempt(null)}
            />
        </>
    );
}
