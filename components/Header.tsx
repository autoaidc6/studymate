
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.962 7.962 0 015.5 4c-1.105 0-2.138.17-3 .482V15.5a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4.804zM14.5 15c-1.38 0-2.653-.433-3.682-1.222a.5.5 0 00-.636 0C9.153 14.567 7.88 15 6.5 15c-1.105 0-2.138-.17-3-.482V5.482c.862-.312 1.895-.482 3-.482 1.38 0 2.653.433 3.682 1.222a.5.5 0 00.636 0C11.847 5.433 13.12 5 14.5 5c1.105 0 2.138.17 3 .482v9.036c-.862.312-1.895.482-3 .482z" />
        </svg>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          StudyMate
        </h1>
      </div>
      <p className="text-center text-slate-500 dark:text-slate-400 mt-2">
        Your AI Partner for the UK Curriculum
      </p>
    </header>
  );
};

export default Header;
