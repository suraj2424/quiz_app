// dashboard2/components/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Notification } from '../types';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        // Mock notifications - replace with real data
        {
            id: '1',
            title: 'Quiz Completed',
            message: 'You scored 85% on JavaScript Basics',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
            type: 'success'
        },
        {
            id: '2',
            title: 'New Quiz Available',
            message: 'React Advanced Concepts is now available',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            read: false,
            type: 'info'
        }
    ]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

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

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
                <Bell className="w-6 h-6 text-gray-600" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${!notification.read ? 'bg-purple-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.read ? 'bg-purple-600' : 'bg-transparent'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100">
                            <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
