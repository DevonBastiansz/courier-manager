import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-slate-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#0c1738] dark:text-white">
                Courier Manager
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' || location.pathname === '/admin'
                    ? 'bg-[#0c1738] bg-opacity-10 text-[#0c1738] dark:bg-opacity-20 dark:text-white'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
              >
                {user?.role === 'admin' ? 'Admin Dashboard' : 'My Shipments'}
              </Link>
              <Link
                to="/track"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/track'
                    ? 'bg-[#0c1738] bg-opacity-10 text-[#0c1738] dark:bg-opacity-20 dark:text-white'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
              >
                Track Package
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="text-slate-600 dark:text-gray-300">
                {user?.name}
              </div>
              {user?.role === 'admin' && (
                <span className="px-2 py-1 bg-[#0c1738] bg-opacity-10 text-[#0c1738] dark:bg-opacity-20 dark:text-white rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
