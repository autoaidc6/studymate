import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onShowSavedGuides: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowSavedGuides }) => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 no-print border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.962 7.962 0 015.5 4c-1.105 0-2.138.17-3 .482V15.5a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4.804zM14.5 15c-1.38 0-2.653-.433-3.682-1.222a.5.5 0 00-.636 0C9.153 14.567 7.88 15 6.5 15c-1.105 0-2.138-.17-3-.482V5.482c.862-.312 1.895-.482 3-.482 1.38 0 2.653.433 3.682 1.222a.5.5 0 00.636 0C11.847 5.433 13.12 5 14.5 5c1.105 0 2.138.17 3 .482v9.036c-.862.312-1.895.482-3 .482z" />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 text-transparent bg-clip-text">
            StudyMate
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onShowSavedGuides}
            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-blue-500"
          >
            My Saved Guides
          </button>
          <ThemeToggle />
        </div>
      </div>
      <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
        Your AI Partner for the UK Curriculum
      </p>
    </header>
  );
};

export default Header;