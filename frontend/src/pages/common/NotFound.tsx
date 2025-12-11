import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[180px] font-bold text-gray-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">🔍</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-3 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved to another location.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
