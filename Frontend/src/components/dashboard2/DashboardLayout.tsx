// dashboard2/DashboardLayout.tsx
import { useState } from 'react';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useSidebar } from './hooks/useSidebar';
import { BreadcrumbItem } from './types';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeSection: string;
    onSectionChange: (section: string) => void;
    pageTitle?: string;
    pageDescription?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function DashboardLayout({
    children,
    activeSection,
    onSectionChange,
    pageTitle,
    pageDescription,
    breadcrumbs
}: DashboardLayoutProps) {
    const { isOpen, toggle, close, isMobile } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <TopHeader onMenuToggle={toggle} isSidebarOpen={isOpen} />

            {/* Layout Container */}
            <div className="pt-16 flex">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isOpen}
                    isMobile={isMobile}
                    activeSection={activeSection}
                    onNavigate={onSectionChange}
                    onClose={close}
                />

                {/* Main Content Area */}
                <div
                    className={`
            flex-1 transition-all duration-300 ease-in-out
            ${isOpen && !isMobile ? 'ml-60' : 'ml-0 lg:ml-16'}
          `}
                >
                    <MainContent
                        title={pageTitle}
                        description={pageDescription}
                        breadcrumbs={breadcrumbs}
                    >
                        {children}
                    </MainContent>
                </div>
            </div>
        </div>
    );
}
