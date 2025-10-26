
import React, { useState, useCallback } from 'react';
import { KeyStage, StudyMaterial, ResourceType, Year } from './types';
import { KEY_STAGES } from './constants';
import { generateStudyGuide } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [selectedKeyStage, setSelectedKeyStage] = useState<KeyStage | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selectedKeyStage || !selectedYear || !topic.trim()) {
      setError("Please select a Key Stage, Year, and enter a topic.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setStudyMaterials(null);

    try {
      const result = await generateStudyGuide(selectedKeyStage, selectedYear, topic, references);
      
      const typeOrder = [
        ResourceType.VIDEO_GUIDE,
        ResourceType.SUMMARY,
        ResourceType.FLASHCARDS,
        ResourceType.CONCEPT_MAP,
        ResourceType.CHEAT_SHEET,
        ResourceType.KEY_POINTS,
        ResourceType.PDF_NOTES,
        ResourceType.GOOGLE_DOC,
        ResourceType.RESOURCE_LINK,
      ];
      
      const sortedMaterials = result.studyMaterials.sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.type);
        const bIndex = typeOrder.indexOf(b.type);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      
      setStudyMaterials(sortedMaterials);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeyStage, selectedYear, topic, references]);

  const canGenerate = selectedKeyStage !== null && selectedYear !== null && topic.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="text-lg font-medium text-slate-700 dark:text-slate-200">1. Select a Key Stage</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {KEY_STAGES.map((ks) => (
                  <button
                    key={ks.id}
                    onClick={() => {
                      setSelectedKeyStage(ks);
                      setSelectedYear(null);
                    }}
                    className={`p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                      selectedKeyStage?.id === ks.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {ks.name}
                    <span className="block text-xs font-normal opacity-75">{ks.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedKeyStage && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <label className="text-lg font-medium text-slate-700 dark:text-slate-200">2. Select a Year</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {selectedKeyStage.years.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setSelectedYear(year)}
                      className={`p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                        selectedYear?.id === year.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      {year.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label htmlFor="topic" className="text-lg font-medium text-slate-700 dark:text-slate-200">3. Enter a Topic</label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, The Tudors, Algebra"
                className="mt-2 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label htmlFor="references" className="text-lg font-medium text-slate-700 dark:text-slate-200">4. Add References <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(Optional)</span></label>
              <textarea
                id="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Paste URLs, YouTube links, or book chapters to guide the AI..."
                className="mt-2 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Generating...' : 'Generate Study Materials'}
            </button>
          </div>
        </div>
        
        <div className="mt-12 max-w-7xl mx-auto">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
          {!isLoading && !error && !studyMaterials && (
             <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Let's start learning!</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Select a Key Stage and topic to begin.</p>
            </div>
          )}
          {studyMaterials && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyMaterials.map((material, index) => (
                <ResultCard key={index} material={material} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;