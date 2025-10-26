import React, { useState, useEffect } from 'react';
import { StudyMaterial, ResourceType, Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ResultCardProps {
  material: StudyMaterial;
}

const ResourceIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
  const baseClasses = "h-6 w-6 text-indigo-500";
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

const getYouTubeId = (urlOrId: string): string | null => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = urlOrId.match(regex);
  return match ? match[1] : null;
};

const FlashcardPlayer: React.FC<{ content: string }> = ({ content }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    try {
      const parsedCards = JSON.parse(content);
      if (Array.isArray(parsedCards) && parsedCards.every(c => typeof c.question === 'string' && typeof c.answer === 'string')) {
        setCards(parsedCards);
      } else {
        throw new Error("Invalid flashcard format.");
      }
    } catch (e) {
      console.error("Failed to parse flashcards:", e);
      setError("Could not load flashcards. The data might be malformed.");
    }
  }, [content]);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
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
        className="relative w-full h-48 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
        aria-live="polite"
      >
        <div 
          className="absolute w-full h-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute w-full h-full flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow" style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Question</p>
              <p className="text-slate-800 dark:text-slate-100">{currentCard.question}</p>
            </div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full flex items-center justify-center p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg shadow" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="text-center">
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-2">Answer</p>
              <p className="text-indigo-800 dark:text-indigo-200">{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} aria-label="Previous card" className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Prev</button>
        <p className="text-sm text-slate-500 dark:text-slate-400" aria-label={`Card ${currentIndex + 1} of ${cards.length}`}>{currentIndex + 1} / {cards.length}</p>
        <button onClick={handleNext} aria-label="Next card" className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Next</button>
      </div>
    </div>
  );
};


const ResultCard: React.FC<ResultCardProps> = ({ material }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const contentId = `card-content-${material.type}-${material.title.replace(/\W/g, '-')}`;

  const renderContent = () => {
    switch (material.type) {
      case ResourceType.SUMMARY:
        return <p className="text-slate-600 dark:text-slate-300 text-sm">{material.content}</p>;
      case ResourceType.KEY_POINTS:
        return (
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-sm">
            {material.content.split('\n').map((item, index) => item.trim() && <li key={index}>{item.replace(/^- /, '')}</li>)}
          </ul>
        );
      case ResourceType.RESOURCE_LINK:
        return (
          <a
            href={material.content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Visit Resource
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        );
      case ResourceType.VIDEO_GUIDE:
        const videoId = getYouTubeId(material.content);
        if (!videoId) {
          return <p className="text-sm text-red-600 dark:text-red-400">Could not find a valid YouTube video ID.</p>;
        }
        
        if (videoError) {
           return (
            <div className="space-y-2">
              <div className="flex items-center justify-center h-48 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-center text-red-600 dark:text-red-400 px-4">
                  Sorry, this video could not be loaded.<br/>It may no longer be available.
                </p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center transition-colors"
              >
                Try on YouTube
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          );
        }
        
        if (showPlayer) {
            return (
              <div className="space-y-2">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={material.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center transition-colors"
                >
                  Watch on YouTube
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            );
        }

        return (
           <div className="space-y-2">
            <button
              onClick={() => setShowPlayer(true)}
              className="relative w-full block group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-lg"
              aria-label={`Play video: ${material.title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                alt={`Thumbnail for ${material.title}`}
                className="w-full rounded-lg shadow-md"
                onError={() => {
                  if (!showPlayer) setVideoError(true);
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-lg">
                <div className="bg-black bg-opacity-50 rounded-full p-3 transform group-hover:scale-110 transition-transform">
                  <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center transition-colors"
            >
              Watch on YouTube
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
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
            <div>
              <a
                href={`https://docs.google.com/document/create?title=${encodeURIComponent(material.title)}`}
                onClick={handleCreateDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Google Doc
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 focus-visible:ring-indigo-500 rounded-lg"
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <div className="flex items-center space-x-3">
            <ResourceIcon type={material.type} />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{material.title}</h3>
          </div>
          <svg
            className={`h-5 w-5 text-slate-500 transform transition-transform duration-300 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div id={contentId} className="mt-4">
             {material.source && <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Source: {material.source}</p>}
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;