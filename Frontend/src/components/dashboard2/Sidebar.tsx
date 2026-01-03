// dashboard2/Sidebar.tsx
import { LayoutDashboard, BarChart3, History, Settings, HelpCircle, User } from 'lucide-react';
import { NavigationItem } from './types';
import SidebarItem from './components/SidebarItem';
import { ReactNode } from 'react';

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    activeSection: string;
    onNavigate: (sectionId: string) => void;
    onClose: () => void;
}

interface NavItemWithIcon extends Omit<NavigationItem, 'icon'> {
    icon: ReactNode;
}

const navigationItems: NavItemWithIcon[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard/analytics' },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" />, path: '/dashboard/history' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
    { id: 'help', label: 'Help', icon: <HelpCircle className="w-5 h-5" />, path: '/dashboard/help' },
];

export default function Sidebar({ isOpen, isMobile, activeSection, onNavigate, onClose }: SidebarProps) {
    const handleItemClick = (sectionId: string) => {
        onNavigate(sectionId);
        if (isMobile) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? (isMobile ? 'translate-x-0' : 'w-60') : (isMobile ? '-translate-x-full' : 'w-16')}
          ${isMobile ? 'w-60' : ''}
        `}
            >
                <nav className="h-full flex flex-col p-3 overflow-y-auto">
                    {/* Navigation Items */}
                    <div className="space-y-1 flex-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                    ${activeSection === item.id
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                    ${!isOpen && !isMobile ? 'justify-center' : ''}
                                `}
                                title={!isOpen && !isMobile ? item.label : undefined}
                            >
                                <span className={activeSection === item.id ? 'text-purple-600' : 'text-gray-500'}>
                                    {item.icon}
                                </span>
                                {(isOpen || isMobile) && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        {!isOpen && !isMobile ? (
                            <div className="flex justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Dashboard v2.0</p>
                                <p className="text-xs text-gray-400 mt-1">Modern UI</p>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>
        </>
    );
}
