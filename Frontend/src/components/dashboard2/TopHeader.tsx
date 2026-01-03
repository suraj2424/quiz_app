// dashboard2/TopHeader.tsx
import UserProfile from './components/UserProfile';
import NotificationBell from './components/NotificationBell';

interface TopHeaderProps {
    onMenuToggle: () => void;
    isSidebarOpen: boolean;
}

export default function TopHeader({ onMenuToggle, isSidebarOpen }: TopHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Menu Toggle Button */}
                    <button
                        onClick={onMenuToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Q</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-gray-900">Quiz Dashboard</h1>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Notifications */}
                    <NotificationBell />

                    {/* User Profile */}
                    <UserProfile />
                </div>
            </div>
        </header>
    );
}
