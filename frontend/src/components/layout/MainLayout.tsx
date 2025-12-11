import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function MainLayout({ children, title, subtitle, action }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          {(title || action) && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {title && (
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
              </div>
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
