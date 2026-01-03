// dashboard2/components/SidebarItem.tsx
import { NavigationItem } from '../types';

interface SidebarItemProps {
    item: NavigationItem;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}

export default function SidebarItem({ item, isActive, isCollapsed, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg
        transition-all duration-200 group relative
        ${isActive
                    ? 'bg-purple-50 text-purple-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }
        ${isCollapsed ? 'justify-center' : ''}
      `}
            title={isCollapsed ? item.label : undefined}
        >
            {/* Icon */}
            <span className="text-xl flex-shrink-0">{item.icon}</span>

            {/* Label - hidden when collapsed */}
            {!isCollapsed && (
                <span className="flex-1 text-left text-sm">{item.label}</span>
            )}

            {/* Badge - hidden when collapsed */}
            {!isCollapsed && item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="
          absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 whitespace-nowrap z-50
        ">
                    {item.label}
                    {item.badge && item.badge > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-purple-600 rounded-full text-xs">
                            {item.badge}
                        </span>
                    )}
                </div>
            )}
        </button>
    );
}
