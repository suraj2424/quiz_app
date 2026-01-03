// dashboard2/MainContent.tsx
import { ReactNode } from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import { BreadcrumbItem } from './types';

interface MainContentProps {
    children: ReactNode;
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainContent({ children, title, description, breadcrumbs }: MainContentProps) {
    return (
        <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <Breadcrumbs items={breadcrumbs} />
                )}

                {/* Page Header */}
                {(title || description) && (
                    <div className="mb-6">
                        {title && (
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="mt-2 text-base text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="pb-6">
                    {children}
                </div>
            </div>
        </main>
    );
}
