
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-lg text-slate-600 dark:text-slate-300">Curating your study materials...</p>
    </div>
  );
};

export default LoadingSpinner;
