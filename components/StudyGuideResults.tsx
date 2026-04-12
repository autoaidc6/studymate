import React, { useState } from 'react';
import { StudyMaterial, ResourceType } from '../types';
import ResultCard from './ResultCard';

interface StudyGuideResultsProps {
  materials: StudyMaterial[];
  topic: string;
  onBack: () => void;
}

enum Tab {
  OVERVIEW = 'OVERVIEW',
  VIDEO = 'VIDEO',
  CONCEPT = 'CONCEPT',
  FLASHCARDS = 'FLASHCARDS',
  CONCEPT_MAP = 'CONCEPT_MAP',
  CHEAT_SHEET = 'CHEAT_SHEET',
  NOTES = 'NOTES',
}

const ITEMS_PER_PAGE = 2;

const StudyGuideResults: React.FC<StudyGuideResultsProps> = ({ materials, topic, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { id: Tab.OVERVIEW, label: 'Overview', icon: '🏠' },
    { id: Tab.VIDEO, label: 'Video Guide', icon: '📺' },
    { id: Tab.CONCEPT, label: 'Core Concept', icon: '💡' },
    { id: Tab.FLASHCARDS, label: 'Flashcards', icon: '🗂️' },
    { id: Tab.CONCEPT_MAP, label: 'Concept Map', icon: '🗺️' },
    { id: Tab.CHEAT_SHEET, label: 'Cheat Sheet', icon: '📝' },
    { id: Tab.NOTES, label: 'Notes', icon: '📚' },
  ];

  const getMaterialsForTab = (tab: Tab) => {
    switch (tab) {
      case Tab.VIDEO:
        return materials.filter(m => m.type === ResourceType.VIDEO_GUIDE);
      case Tab.CONCEPT:
        return materials.filter(m => m.type === ResourceType.SUMMARY || m.type === ResourceType.KEY_POINTS);
      case Tab.FLASHCARDS:
        return materials.filter(m => m.type === ResourceType.FLASHCARDS);
      case Tab.CONCEPT_MAP:
        return materials.filter(m => m.type === ResourceType.CONCEPT_MAP);
      case Tab.CHEAT_SHEET:
        return materials.filter(m => m.type === ResourceType.CHEAT_SHEET);
      case Tab.NOTES:
        return materials.filter(m => m.type === ResourceType.PDF_NOTES || m.type === ResourceType.GOOGLE_DOC);
      default:
        return materials;
    }
  };

  const filteredMaterials = getMaterialsForTab(activeTab);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = activeTab === Tab.OVERVIEW 
    ? filteredMaterials 
    : filteredMaterials.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Back Button & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Generator
        </button>

        <div className="overflow-x-auto pb-2 sm:pb-0">
          <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }
                `}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6 min-h-[60vh]">
        {activeTab === Tab.OVERVIEW ? (
          <div className="space-y-12">
            {/* Overview Page with Headings */}
            <section className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Study Overview: {topic}</h2>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-lg">
                Welcome to your comprehensive study guide. We've organized your learning materials into specialized sections to help you master this topic effectively. Use the navigation above to explore each resource in detail.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Core Concept Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">💡</span> Core Concept
                </h3>
                <div className="space-y-4">
                  {getMaterialsForTab(Tab.CONCEPT).map((m, i) => (
                    <ResultCard key={i} material={m} topic={topic} />
                  ))}
                </div>
              </div>

              {/* Video Guide Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">📺</span> Video Guide
                </h3>
                <div className="space-y-4">
                  {getMaterialsForTab(Tab.VIDEO).map((m, i) => (
                    <ResultCard key={i} material={m} topic={topic} />
                  ))}
                </div>
              </div>

              {/* Flashcards Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">🗂️</span> Flashcards
                </h3>
                <div className="space-y-4">
                  {getMaterialsForTab(Tab.FLASHCARDS).map((m, i) => (
                    <ResultCard key={i} material={m} topic={topic} />
                  ))}
                </div>
              </div>

              {/* Cheat Sheet Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">📝</span> Cheat Sheet
                </h3>
                <div className="space-y-4">
                  {getMaterialsForTab(Tab.CHEAT_SHEET).map((m, i) => (
                    <ResultCard key={i} material={m} topic={topic} />
                  ))}
                </div>
              </div>
            </div>

            {/* Full Width Sections for Overview */}
            <div className="space-y-8">
               <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">🗺️</span> Concept Map
                </h3>
                {getMaterialsForTab(Tab.CONCEPT_MAP).map((m, i) => (
                  <ResultCard key={i} material={m} topic={topic} />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <span className="mr-2">📚</span> Detailed Notes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getMaterialsForTab(Tab.NOTES).map((m, i) => (
                    <ResultCard key={i} material={m} topic={topic} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <span className="mr-4 text-4xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                {activeTab === Tab.VIDEO && "Recommended video content to reinforce your learning."}
                {activeTab === Tab.CONCEPT && "The essential building blocks and summaries of the topic."}
                {activeTab === Tab.FLASHCARDS && "Test your knowledge with these interactive cards."}
                {activeTab === Tab.CONCEPT_MAP && "Visualize the relationships between different ideas."}
                {activeTab === Tab.CHEAT_SHEET && "Quick reference for formulas, dates, and key facts."}
                {activeTab === Tab.NOTES && "Comprehensive study notes and worksheets for deep learning."}
              </p>
            </div>
            
            <div className={`grid grid-cols-1 ${activeTab === Tab.FLASHCARDS || activeTab === Tab.CONCEPT_MAP ? 'max-w-4xl mx-auto' : 'md:grid-cols-2'} gap-8`}>
              {paginatedMaterials.length > 0 ? (
                paginatedMaterials.map((material, index) => (
                  <div key={index} className={activeTab === Tab.CONCEPT_MAP || activeTab === Tab.FLASHCARDS ? 'col-span-full' : ''}>
                    <ResultCard material={material} topic={topic} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-xl text-slate-500 dark:text-slate-400">No materials found for this section.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center space-x-4 no-print">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGuideResults;
