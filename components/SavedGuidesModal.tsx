import React from 'react';
import { SavedStudyGuide } from '../types';

interface SavedGuidesModalProps {
  guides: SavedStudyGuide[];
  onLoad: (guide: SavedStudyGuide) => void;
  onDelete: (guideId: string) => void;
  onClose: () => void;
}

const SavedGuidesModal: React.FC<SavedGuidesModalProps> = ({ guides, onLoad, onDelete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Saved Guides</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {guides.length > 0 ? (
            <ul className="space-y-4">
              {guides.map((guide) => (
                <li key={guide.id} className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{guide.topic}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {guide.keyStageName} - {guide.yearName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Saved on: {new Date(guide.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={() => onLoad(guide)} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">Load</button>
                    <button onClick={() => onDelete(guide.id)} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">No Saved Guides</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Generate a study guide and save it to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedGuidesModal;