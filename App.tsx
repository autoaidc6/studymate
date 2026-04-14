import React, { useState, useCallback, useEffect } from 'react';
import { KeyStage, StudyMaterial, ResourceType, Year, SavedStudyGuide } from './types';
import { KEY_STAGES } from './constants';
import { generateStudyGuide } from './services/geminiService';
import * as storageService from './services/storageService';
import { exportAsDocx } from './services/exportService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import SavedGuidesModal from './components/SavedGuidesModal';
import StudyGuideResults from './components/StudyGuideResults';
import Learn from './src/components/learn/Learn';

const App: React.FC = () => {
  const [module, setModule] = useState<'GUIDE' | 'LEARN'>('GUIDE');
  const [view, setView] = useState<'INPUT' | 'RESULTS'>('INPUT');
  const [selectedKeyStage, setSelectedKeyStage] = useState<KeyStage | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[] | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedGuides, setSavedGuides] = useState<SavedStudyGuide[]>([]);
  const [showSavedGuides, setShowSavedGuides] = useState(false);

  useEffect(() => {
    setSavedGuides(storageService.getSavedGuides());
  }, []);

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
      setIsSaved(false);
      setView('RESULTS');
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeyStage, selectedYear, topic, references]);

  const handleSaveGuide = useCallback(() => {
    if (!studyMaterials || !topic || !selectedKeyStage || !selectedYear) return;
    const newGuide: SavedStudyGuide = {
        id: `${topic.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
        topic,
        keyStageName: selectedKeyStage.name,
        yearName: selectedYear.name,
        savedAt: new Date().toISOString(),
        materials: studyMaterials,
    };
    storageService.saveGuide(newGuide);
    setSavedGuides(storageService.getSavedGuides());
    setIsSaved(true);
    alert('Study guide saved successfully!');
  }, [studyMaterials, topic, selectedKeyStage, selectedYear]);

  const handleLoadGuide = (guide: SavedStudyGuide) => {
      setTopic(guide.topic);
      const ks = KEY_STAGES.find(k => k.name === guide.keyStageName);
      if(ks) {
          setSelectedKeyStage(ks);
          const y = ks.years.find(y => y.name === guide.yearName);
          setSelectedYear(y || null);
      }
      setStudyMaterials(guide.materials);
      setIsSaved(true);
      setShowSavedGuides(false);
      setView('RESULTS');
  };

  const handleDeleteGuide = (guideId: string) => {
      if (confirm('Are you sure you want to delete this guide?')) {
        storageService.deleteGuide(guideId);
        setSavedGuides(storageService.getSavedGuides());
      }
  };

  const handleExportDocx = () => {
    if (!studyMaterials || !topic) return;
    exportAsDocx(studyMaterials, topic);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleBack = useCallback(() => {
    if (!isSaved && studyMaterials) {
      const confirmBack = confirm('You have unsaved changes. Are you sure you want to go back to the generator? Your current study guide will be lost unless saved.');
      if (!confirmBack) return;
    }
    setView('INPUT');
  }, [isSaved, studyMaterials]);

  const canGenerate = selectedKeyStage !== null && selectedYear !== null && topic.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowSavedGuides={() => setShowSavedGuides(true)} 
        activeModule={module}
        onModuleChange={setModule}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {module === 'LEARN' ? (
          <Learn />
        ) : view === 'INPUT' ? (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 no-print">
            <div className="space-y-8">
              <div>
                <label className="text-lg font-semibold text-slate-700 dark:text-slate-200">1. Select a Key Stage</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-3">
                  {KEY_STAGES.map((ks) => (
                    <button
                      key={ks.id}
                      onClick={() => {
                        setSelectedKeyStage(ks);
                        setSelectedYear(null);
                      }}
                      className={`p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${
                        selectedKeyStage?.id === ks.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {ks.name}
                      <span className="block text-xs font-normal opacity-75">{ks.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedKeyStage && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                  <label className="text-lg font-semibold text-slate-700 dark:text-slate-200">2. Select a Year</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {selectedKeyStage.years.map((year) => (
                      <button
                        key={year.id}
                        onClick={() => setSelectedYear(year)}
                        className={`p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${
                          selectedYear?.id === year.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                        }`}
                      >
                        {year.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <label htmlFor="topic" className="text-lg font-semibold text-slate-700 dark:text-slate-200">3. Enter a Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, The Tudors, Algebra"
                  className="mt-3 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <label htmlFor="references" className="text-lg font-semibold text-slate-700 dark:text-slate-200">4. Add References <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(Optional)</span></label>
                <textarea
                  id="references"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Paste URLs, YouTube links, or book chapters to guide the AI..."
                  className="mt-3 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isLoading}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? 'Generating...' : 'Generate Study Materials'}
              </button>
            </div>
          </div>
        ) : (
          <div id="results-section" className="max-w-7xl mx-auto print-container">
            {studyMaterials && (
              <div className="space-y-6">
                <div className="text-center mb-8 space-y-4 no-print">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Study Guide for "{topic}"</h2>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    <button onClick={handleSaveGuide} className="px-5 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-blue-500">Save Guide</button>
                    <button onClick={handleExportPdf} className="px-5 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-slate-500 border border-slate-300 dark:border-slate-600">Download as PDF</button>
                    <button onClick={handleExportDocx} className="px-5 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-slate-500 border border-slate-300 dark:border-slate-600">Download as DOCX</button>
                  </div>
                </div>
                <StudyGuideResults 
                  materials={studyMaterials} 
                  topic={topic} 
                  onBack={handleBack}
                />
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4">
              <LoadingSpinner />
              <p className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Generating your study guide...</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This usually takes about 10-20 seconds.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 max-w-3xl mx-auto text-center p-4 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold underline">Dismiss</button>
          </div>
        )}
      </main>

      <Footer />
      
      {showSavedGuides && (
        <SavedGuidesModal
          guides={savedGuides}
          onLoad={handleLoadGuide}
          onDelete={handleDeleteGuide}
          onClose={() => setShowSavedGuides(false)}
        />
      )}
    </div>
  );
};

export default App;