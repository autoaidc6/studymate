import React from 'react';
import ThemeToggle from './ThemeToggle';
import { User, signInWithPopup, signOut, googleProvider, auth } from '../firebase';
import { LogIn, LogOut, Bookmark } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onShowSavedGuides: () => void;
  onShowPricing: () => void;
  onShowDashboard: () => void;
  onShowSubscription: () => void;
  onShowAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onShowSavedGuides, onShowPricing, onShowDashboard, onShowSubscription, onShowAuth }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 no-print border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer" onClick={onShowDashboard}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.962 7.962 0 015.5 4c-1.105 0-2.138.17-3 .482V15.5a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4.804zM14.5 15c-1.38 0-2.653-.433-3.682-1.222a.5.5 0 00-.636 0C9.153 14.567 7.88 15 6.5 15c-1.105 0-2.138-.17-3-.482V5.482c.862-.312 1.895-.482 3-.482 1.38 0 2.653.433 3.682 1.222a.5.5 0 00.636 0C11.847 5.433 13.12 5 14.5 5c1.105 0 2.138.17 3 .482v9.036c-.862.312-1.895.482-3 .482z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer" onClick={onShowDashboard}>
            StudyMate
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onShowPricing}
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </button>
          {user ? (
            <>
              <button
                onClick={onShowSubscription}
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Manage Subscription
              </button>
              <button
                onClick={onShowSavedGuides}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                My Guides
              </button>
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border-2 border-blue-500" />
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;