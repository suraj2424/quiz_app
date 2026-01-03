// dashboard2/components/Breadcrumbs.tsx
import { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    if (items.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && (
                        <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}

                    {item.path && index < items.length - 1 ? (
                        <button
                            onClick={() => {/* Handle navigation */ }}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className={index === items.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
