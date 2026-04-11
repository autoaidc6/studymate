import React from 'react';

interface FooterProps {
  onShowPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacy }) => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 mt-auto no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="text-base font-bold text-slate-900 dark:text-white mb-1">StudyMate</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} StudyMate. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button onClick={onShowPrivacy} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </button>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a>
        </div>

        <div className="text-center md:text-right max-w-xs">
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            UK GDPR Compliant. We prioritize student safety and data privacy above all else.
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Educational content is AI-generated and curated from public sources. Always verify critical information with your teachers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;