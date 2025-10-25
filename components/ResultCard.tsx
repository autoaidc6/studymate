
import React from 'react';
import { StudyMaterial, ResourceType } from '../types';

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
    default:
      return null;
  }
};

const renderMarkdown = (text: string) => {
  const blocks: {type: 'p' | 'h3' | 'h4' | 'ul', content: string[]}[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    const lastBlock = blocks[blocks.length - 1];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('# ')) {
      blocks.push({ type: 'h3', content: [trimmedLine.substring(2)] });
    } else if (trimmedLine.startsWith('## ')) {
      blocks.push({ type: 'h4', content: [trimmedLine.substring(3)] });
    } else if (trimmedLine.startsWith('- ')) {
      const content = trimmedLine.substring(2);
      if (lastBlock?.type === 'ul') {
        lastBlock.content.push(content);
      } else {
        blocks.push({ type: 'ul', content: [content] });
      }
    } else {
      blocks.push({ type: 'p', content: [line] });
    }
  }

  return blocks.map((block, index) => {
    switch(block.type) {
      case 'h3': return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100">{block.content[0]}</h3>;
      case 'h4': return <h4 key={index} className="text-md font-semibold mt-3 mb-1 text-slate-700 dark:text-slate-200">{block.content[0]}</h4>;
      case 'p': return <p key={index} className="text-slate-600 dark:text-slate-300">{block.content[0]}</p>;
      case 'ul': return (
        <ul key={index} className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          {block.content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }
  });
};

const getYouTubeId = (urlOrId: string): string | null => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = urlOrId.match(regex);
  return match ? match[1] : null;
};


const ResultCard: React.FC<ResultCardProps> = ({ material }) => {
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
        return (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={material.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg w-full h-full"
            ></iframe>
          </div>
        );
      case ResourceType.PDF_NOTES:
        return <div className="space-y-2">{renderMarkdown(material.content)}</div>;
      case ResourceType.GOOGLE_DOC:
        const handleCreateDoc = () => {
          navigator.clipboard.writeText(material.content).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        };
        return (
          <div className="space-y-4">
            <div className="space-y-2">{renderMarkdown(material.content)}</div>
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <ResourceIcon type={material.type} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{material.title}</h3>
        </div>
        {material.source && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Source: {material.source}</p>}
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;