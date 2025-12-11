import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, CheckSquare, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
    transition-all duration-200
    ${isActive(path) 
      ? 'bg-primary-50 text-primary-700' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                CoWork
              </span>
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <Link to="/teams" className={navLinkClass('/teams')}>
                  <Users className="w-4 h-4" />
                  Teams
                </Link>
                <Link to="/tasks" className={navLinkClass('/tasks')}>
                  <CheckSquare className="w-4 h-4" />
                  My Tasks
                </Link>
              </nav>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.nickname}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <nav className="md:hidden flex items-center gap-2 pb-3 -mt-1">
            <Link to="/teams" className={navLinkClass('/teams')}>
              <Users className="w-4 h-4" />
              Teams
            </Link>
            <Link to="/tasks" className={navLinkClass('/tasks')}>
              <CheckSquare className="w-4 h-4" />
              My Tasks
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
