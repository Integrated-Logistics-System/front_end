'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function MarkdownRenderer({ 
  content, 
  isStreaming = false, 
  className = '' 
}: MarkdownRendererProps) {
  
  return (
    <div className={`markdown-content ${className} ${isStreaming ? 'streaming-text' : ''} w-full`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 pb-3 border-b-2 border-orange-200 dark:border-orange-700 flex items-center">
              <span className="mr-3 text-2xl">🍳</span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4 mt-6 flex items-center bg-orange-50 dark:bg-orange-900/20 px-4 py-3 rounded-lg border-l-4 border-orange-400">
              <span className="mr-3 text-xl">📖</span>
              {children}
            </h2>
          ),
          h3: ({ children }) => {
            const childrenStr = children ? String(children) : '';
            return (
              <h3 className="text-md font-medium text-orange-500 dark:text-orange-300 mb-3 mt-6 flex items-center bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                <span className="mr-2 text-lg">
                  {childrenStr.includes('재료') ? '🥘' : 
                   childrenStr.includes('조리') ? '👩‍🍳' : 
                   childrenStr.includes('주의') ? '⚠️' : 
                   childrenStr.includes('팁') ? '💡' : '📝'}
                </span>
                {children}
              </h3>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-orange-600 dark:text-orange-400">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-none ml-0 mb-6 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none ml-0 mb-6 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start text-gray-800 dark:text-gray-200 leading-relaxed mb-1">
              <span className="mr-3 text-base flex-shrink-0">🥘</span>
              <div className="flex-1">{children}</div>
            </li>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200 text-sm">
              {children}
            </p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
