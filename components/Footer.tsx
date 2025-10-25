
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} StudyMate. All rights reserved.
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        Educational content is AI-generated and curated from public sources. Always verify critical information.
      </p>
    </footer>
  );
};

export default Footer;
