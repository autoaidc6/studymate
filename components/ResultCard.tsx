import React, { useState, useEffect } from 'react';
import { StudyMaterial, ResourceType, Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ResultCardProps {
  material: StudyMaterial;
  topic: string;
}

const ResourceIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
  const baseClasses = "h-6 w-6 text-blue-500 dark:text-blue-400";
  switch (type) {
    case ResourceType.SUMMARY:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case ResourceType.KEY_POINTS:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    case ResourceType.RESOURCE_LINK:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    case ResourceType.VIDEO_GUIDE:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case ResourceType.PDF_NOTES:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case ResourceType.GOOGLE_DOC:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case ResourceType.FLASHCARDS:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
    case ResourceType.CONCEPT_MAP:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>;
    case ResourceType.CHEAT_SHEET:
      return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
    default:
      return null;
  }
};

const FlashcardPlayer: React.FC<{ content: string }> = ({ content }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    try {
      const cardBlocks = content.split('---').filter(s => s.trim());
      if (cardBlocks.length === 0) {
        throw new Error("No flashcard data found.");
      }

      const parsedCards = cardBlocks.map(block => {
        const qIndex = block.indexOf('Q: ');
        const aIndex = block.indexOf('A: ');

        if (qIndex === -1 || aIndex === -1 || aIndex < qIndex) {
          throw new Error(`Malformed card block: "${block.substring(0, 50)}..."`);
        }

        const question = block.substring(qIndex + 3, aIndex).trim();
        const answer = block.substring(aIndex + 3).trim();

        if (!question || !answer) {
             throw new Error(`Empty question or answer in block: "${block.substring(0, 50)}..."`);
        }
        
        return { question, answer };
      });

      setCards(parsedCards);
      setError(null);

    } catch (e: any) {
      console.error("Failed to parse flashcards:", e.message);
      setError("Could not load flashcards. The data might be malformed.");
    }
  }, [content]);

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(i => (i - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex(i => (i + 1) % cards.length);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-4">
      <div 
        className="relative w-full h-56 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
        aria-live="polite"
      >
        <div 
          className="absolute w-full h-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute w-full h-full flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner" style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium uppercase tracking-wider">Question</p>
              <p className="text-slate-800 dark:text-slate-200 text-lg">{currentCard.question}</p>
            </div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg shadow-inner" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
             <div className="text-center">
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-2 font-medium uppercase tracking-wider">Answer</p>
              <p className="text-blue-800 dark:text-blue-200 text-lg">{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between no-print">
        <button onClick={handlePrev} aria-label="Previous card" className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Prev</button>
        <p className="text-sm text-slate-500 dark:text-slate-400" aria-label={`Card ${currentIndex + 1} of ${cards.length}`}>{currentIndex + 1} / {cards.length}</p>
        <button onClick={handleNext} aria-label="Next card" className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Next</button>
      </div>
    </div>
  );
};


const ResultCard: React.FC<ResultCardProps> = ({ material, topic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = `card-content-${material.type}-${material.title.replace(/\W/g, '-')}`;

  const renderContent = () => {
    switch (material.type) {
      case ResourceType.SUMMARY:
        return <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">{material.content}</p>;
      case ResourceType.KEY_POINTS:
        return (
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-base">
            {material.content.split('\n').map((item, index) => item.trim() && <li key={index}>{item.replace(/^- /, '')}</li>)}
          </ul>
        );
      case ResourceType.RESOURCE_LINK:
        return (
          <a
            href={material.content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors no-print"
          >
            Visit Resource
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        );
      case ResourceType.VIDEO_GUIDE:
        const searchQueries = material.content.split('\n').filter(q => q.trim());
        
        return (
            <div className="space-y-3 no-print">
                <p className="text-base text-slate-600 dark:text-slate-300">
                    To find the best video, the AI recommends these searches on YouTube:
                </p>
                <ul className="space-y-2">
                    {searchQueries.map((query, index) => {
                        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                        return (
                            <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                <p className="text-base font-medium text-slate-800 dark:text-slate-200 flex-grow mb-2 sm:mb-0 sm:mr-4">
                                    "{query}"
                                </p>
                                <a
                                    href={searchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-red-500 transition-colors flex-shrink-0"
                                    aria-label={`Search YouTube for: ${query}`}
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 28 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M27.5 7.2S27.2 5.5 26.5 4.8C25.5 3.8 24.3 3.8 23.8 3.7c-3.4-.2-8.3-.2-8.3-.2s-5 0-8.3.2C6.7 3.8 5.5 3.8 4.5 4.8C3.8 5.5 3.5 7.2 3.5 7.2s-.2 1.9-.2 3.8v2s.2 1.9.2 3.8c0 1.9.3 3.6.3 3.6s.3 1.7 1 2.4c1 1 2.2 1 2.7 1.2 3.4.2 8.3.2 8.3.2s5 0 8.3-.2c.5-.1 1.7-.1 2.7-1.2c.7-.7 1-2.4 1-2.4s.2-1.9.2-3.8v-2s-.2-1.9-.2-3.8zm-16 8.1V8.6l7.4 3.4-7.4 3.3z"></path>
                                    </svg>
                                    Search
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
      case ResourceType.PDF_NOTES:
      case ResourceType.CHEAT_SHEET:
      case ResourceType.CONCEPT_MAP:
        return <MarkdownRenderer content={material.content} />;
      case ResourceType.FLASHCARDS:
        return <FlashcardPlayer content={material.content} />;
      case ResourceType.GOOGLE_DOC:
        const handleCreateDoc = () => {
          navigator.clipboard.writeText(material.content).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        };
        return (
          <div className="space-y-4">
            <MarkdownRenderer content={material.content} />
            <div className="no-print">
              <a
                href={`https://docs.google.com/document/create?title=${encodeURIComponent(material.title)}`}
                onClick={handleCreateDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
              >
                Create Google Doc
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                This copies the content and opens a new doc. Just paste (Ctrl+V) to get started.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-slate-200 dark:border-slate-700 print-bg-white print:shadow-none print:border-gray-300 print:break-inside-avoid print-card">
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 focus-visible:ring-blue-500 rounded-lg no-print"
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <div className="flex items-center space-x-4">
            <ResourceIcon type={material.type} />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 print-text-black">{material.title}</h3>
          </div>
          <svg
            className={`h-6 w-6 text-slate-500 dark:text-slate-400 transform transition-transform duration-300 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 ${!isExpanded ? 'hidden' : ''} print:block`}>
             {material.source && <p className="text-sm text-slate-500 mb-4">Source: {material.source}</p>}
            {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default ResultCard;