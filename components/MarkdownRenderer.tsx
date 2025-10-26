import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100" {...props} />,
        h4: ({node, ...props}) => <h4 className="text-md font-semibold mt-3 mb-1 text-slate-700 dark:text-slate-200" {...props} />,
        p: ({node, ...props}) => <p className="mb-2 text-slate-600 dark:text-slate-300 text-sm" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-2 text-slate-600 dark:text-slate-300 text-sm" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 mb-2 text-slate-600 dark:text-slate-300 text-sm" {...props} />,
        li: ({node, ...props}) => <li className="pl-2" {...props} />,
        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
        a: ({node, ...props}) => <a className="text-indigo-500 hover:underline" {...props} />,
        code: ({node, inline, ...props}) => {
            const codeClass = inline 
                ? "px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-sm text-sm" 
                : "block p-2 bg-slate-100 dark:bg-slate-700 rounded-md overflow-x-auto text-sm";
            return <code className={codeClass} {...props} />;
        },
        blockquote: ({node, ...props}) => <blockquote className="pl-4 border-l-4 border-slate-300 dark:border-slate-600 text-slate-500 italic my-2" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;