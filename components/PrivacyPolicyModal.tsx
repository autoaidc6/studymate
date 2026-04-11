import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy & UK GDPR</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="text-lg font-bold mb-2">1. Introduction</h3>
            <p className="text-sm">StudyMate is committed to protecting the privacy of our users, especially students. This policy explains how we handle your data in compliance with UK GDPR.</p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold mb-2">2. Data Collection</h3>
            <p className="text-sm">We collect your name and email address when you sign in via Google. We also store the study guides you save and any feedback you provide to improve our AI models.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2">3. Minor Mode (Under 18s)</h3>
            <p className="text-sm">We provide a "Minor Mode" toggle. When enabled:</p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>All targeted advertising is disabled.</li>
              <li>Third-party tracking scripts are blocked.</li>
              <li>Data is strictly used for educational purposes only.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2">4. Your Rights</h3>
            <p className="text-sm">Under UK GDPR, you have the right to access, rectify, or delete your personal data. You can delete your saved guides at any time within the app.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2">5. Contact</h3>
            <p className="text-sm">For any privacy-related queries, please contact our Data Protection Officer at privacy@studymate.uk.</p>
          </section>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
