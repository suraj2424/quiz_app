// dashboard2/components/UserProfile.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

export default function UserProfile() {
    const { userData, removeToken } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        removeToken();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
                {/* Avatar */}
                <div className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {userData?.avatar ? (
                        <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getInitials(userData?.name || 'User')
                    )}
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{userData?.email || ''}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>Profile</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span>Settings</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                            <HelpCircle className="w-4 h-4 text-gray-500" />
                            <span>Help & Support</span>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
