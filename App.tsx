import React, { useState, useCallback, useEffect } from 'react';
import { KeyStage, StudyMaterial, ResourceType, Year, SavedStudyGuide } from './types';
import { KEY_STAGES } from './constants';
import { generateStudyGuide } from './services/geminiService';
import * as storageService from './services/storageService';
import { exportAsDocx } from './services/exportService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import SavedGuidesModal from './components/SavedGuidesModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import Pricing from './components/Pricing';
import SubscriptionModal from './components/SubscriptionModal';
import AuthPage from './components/AuthPage';
import { auth, onAuthStateChanged, User } from './firebase';
import { Shield, Smartphone, ThumbsUp, ThumbsDown, CreditCard, ExternalLink, Info, Bookmark, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'pricing' | 'auth'>('dashboard');
  const [selectedKeyStage, setSelectedKeyStage] = useState<KeyStage | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [minorMode, setMinorMode] = useState<boolean>(true);

  const [savedGuides, setSavedGuides] = useState<SavedStudyGuide[]>([]);
  const [showSavedGuides, setShowSavedGuides] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        storageService.getSavedGuides(currentUser.uid).then(setSavedGuides);
      } else {
        setSavedGuides([]);
      }
    });
    return () => unsubscribe();
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
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeyStage, selectedYear, topic, references]);

  const handleSaveGuide = useCallback(async () => {
    if (!studyMaterials || !topic || !selectedKeyStage || !selectedYear || !user) {
      if (!user) alert('Please sign in to save guides.');
      return;
    }
    const newGuide: Omit<SavedStudyGuide, 'id'> = {
        userId: user.uid,
        topic,
        keyStageName: selectedKeyStage.name,
        yearName: selectedYear.name,
        savedAt: new Date().toISOString(),
        materials: studyMaterials,
    };
    await storageService.saveGuide(newGuide);
    const updatedGuides = await storageService.getSavedGuides(user.uid);
    setSavedGuides(updatedGuides);
    alert('Study guide saved successfully!');
  }, [studyMaterials, topic, selectedKeyStage, selectedYear, user]);

  const handleLoadGuide = (guide: SavedStudyGuide) => {
      setTopic(guide.topic);
      const ks = KEY_STAGES.find(k => k.name === guide.keyStageName);
      if(ks) {
          setSelectedKeyStage(ks);
          const y = ks.years.find(y => y.name === guide.yearName);
          setSelectedYear(y || null);
      }
      setStudyMaterials(guide.materials);
      setShowSavedGuides(false);
      setView('dashboard');
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleDeleteGuide = async (guideId: string) => {
      if (confirm('Are you sure you want to delete this guide?')) {
        await storageService.deleteGuide(guideId);
        if (user) {
          const updatedGuides = await storageService.getSavedGuides(user.uid);
          setSavedGuides(updatedGuides);
        }
      }
  };

  const handleExportDocx = () => {
    if (!studyMaterials || !topic) return;
    exportAsDocx(studyMaterials, topic);
  };

  const handleFeedback = async (materialTitle: string, isPositive: boolean) => {
    if (!user) return;
    await storageService.saveFeedback({
      userId: user.uid,
      topic,
      materialTitle,
      isPositive
    });
    alert('Thank you for your feedback!');
  };

  const canGenerate = selectedKeyStage !== null && selectedYear !== null && topic.trim().length > 0;

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('dashboard')} />;
  }

  if (view === 'pricing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header 
          user={user} 
          onShowSavedGuides={() => setShowSavedGuides(true)} 
          onShowPricing={() => setView('pricing')} 
          onShowDashboard={() => setView('dashboard')}
          onShowSubscription={() => setShowSubscription(true)}
          onShowAuth={() => setView('auth')}
        />
        <Pricing onBack={() => setView('dashboard')} />
        <Footer onShowPrivacy={() => setShowPrivacyPolicy(true)} />
        {showSavedGuides && (
          <SavedGuidesModal
            guides={savedGuides}
            onClose={() => setShowSavedGuides(false)}
            onLoad={handleLoadGuide}
            onDelete={handleDeleteGuide}
          />
        )}
        {showPrivacyPolicy && (
          <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
        )}
        {showSubscription && (
          <SubscriptionModal 
            user={user} 
            onClose={() => setShowSubscription(false)} 
            onUpgrade={() => {
              setShowSubscription(false);
              setView('pricing');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header 
        user={user} 
        onShowSavedGuides={() => setShowSavedGuides(true)} 
        onShowPricing={() => setView('pricing')} 
        onShowDashboard={() => setView('dashboard')}
        onShowSubscription={() => setShowSubscription(true)}
        onShowAuth={() => setView('auth')}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AdSense Placeholder */}
        {!minorMode && !user && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-slate-200 dark:bg-slate-800 rounded-lg text-center text-slate-500 text-xs uppercase tracking-widest border border-dashed border-slate-400 no-print">
            Advertisement Placeholder (AdSense)
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 no-print">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Revision Deck</h2>
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  <button 
                    onClick={() => setMinorMode(!minorMode)}
                    className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${minorMode ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                  >
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Minor Mode {minorMode ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">1. Select Key Stage</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                    {KEY_STAGES.map((ks) => (
                      <button
                        key={ks.id}
                        onClick={() => {
                          setSelectedKeyStage(ks);
                          setSelectedYear(null);
                        }}
                        className={`p-3 text-sm font-semibold rounded-xl transition-all ${
                          selectedKeyStage?.id === ks.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800'
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {ks.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedKeyStage && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">2. Select Year</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {selectedKeyStage.years.map((year) => (
                        <button
                          key={year.id}
                          onClick={() => setSelectedYear(year)}
                          className={`p-3 text-sm font-semibold rounded-xl transition-all ${
                            selectedYear?.id === year.id
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-400'
                          }`}
                        >
                          {year.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="topic" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">3. Topic</label>
                    <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis"
                      className="mt-2 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="references" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">4. References (Optional)</label>
                    <input
                      id="references"
                      type="text"
                      value={references}
                      onChange={(e) => setReferences(e.target.value)}
                      placeholder="URLs or Book Chapters"
                      className="mt-2 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner />
                      <span className="ml-2">Verifying Syllabus & Generating...</span>
                    </div>
                  ) : 'Generate Revision Deck'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start">
                <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {studyMaterials && (
              <div id="results-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between no-print">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Revision Deck</h2>
                  <div className="flex space-x-2">
                    {user && (
                      <button onClick={handleSaveGuide} className="p-2 text-slate-500 hover:text-blue-500 transition-colors" title="Save to Cloud">
                        <Bookmark className="w-6 h-6" />
                      </button>
                    )}
                    <button onClick={handleExportDocx} className="p-2 text-slate-500 hover:text-blue-500 transition-colors" title="Export DOCX">
                      <ExternalLink className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {studyMaterials.map((material, idx) => (
                    <div key={idx} className="relative group">
                      <ResultCard material={material} topic={topic} />
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                        <button 
                          onClick={() => handleFeedback(material.title, true)}
                          className="p-1.5 bg-white dark:bg-slate-700 shadow-md rounded-full text-green-500 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleFeedback(material.title, false)}
                          className="p-1.5 bg-white dark:bg-slate-700 shadow-md rounded-full text-red-500 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onShowPrivacy={() => setShowPrivacyPolicy(true)} />

      {showSavedGuides && (
        <SavedGuidesModal
          guides={savedGuides}
          onClose={() => setShowSavedGuides(false)}
          onLoad={handleLoadGuide}
          onDelete={handleDeleteGuide}
        />
      )}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}
      {showSubscription && (
        <SubscriptionModal 
          user={user} 
          onClose={() => setShowSubscription(false)} 
          onUpgrade={() => {
            setShowSubscription(false);
            setView('pricing');
          }}
        />
      )}
    </div>
  );
};

export default App;
