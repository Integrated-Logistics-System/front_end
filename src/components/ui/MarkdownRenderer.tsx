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
          // 제목들 - 섹션별 명확한 구분
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 pb-3 border-b-2 border-orange-200 dark:border-orange-700 flex items-center">
              <span className="mr-3 text-2xl">🍳</span>
              <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                {children}
              </span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4 mt-6 flex items-center bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 px-4 py-3 rounded-lg border-l-4 border-orange-400">
              <span className="mr-3 text-xl">📖</span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-medium text-orange-500 dark:text-orange-300 mb-3 mt-6 flex items-center bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
              <span className="mr-2 text-lg">
                {children.toString().includes('재료') ? '🥘' : 
                 children.toString().includes('조리') ? '👩‍🍳' : 
                 children.toString().includes('주의') ? '⚠️' : 
                 children.toString().includes('팁') ? '💡' : '📝'}
              </span>
              {children}
            </h3>
          ),
          
          // 강조
          strong: ({ children }) => (
            <strong className="font-semibold text-orange-600 dark:text-orange-400">
              {children}
            </strong>
          ),
          
          // 기울임
          em: ({ children }) => (
            <em className="italic text-gray-700 dark:text-gray-300">
              {children}
            </em>
          ),
          
          // 리스트 - 섹션별 다른 처리
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
          li: ({ children, ...props }) => {
            // 부모 요소를 확인하여 섹션 구분
            const parentTag = props.node?.parent?.tagName;
            
            if (parentTag === 'ol') {
              // 조리과정 - 번호 자동 생성
              return (
                <li className="flex items-start text-gray-800 dark:text-gray-200 leading-relaxed mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="mr-3 text-base flex-shrink-0 text-blue-600 font-bold">👩‍🍳</span>
                  <div className="flex-1">{children}</div>
                </li>
              );
            } else {
              // 재료/팁/주의사항 - 일반 리스트
              return (
                <li className="flex items-start text-gray-800 dark:text-gray-200 leading-relaxed mb-1">
                  <span className="mr-3 text-base flex-shrink-0">🥘</span>
                  <div className="flex-1">{children}</div>
                </li>
              );
            }
          },
          
          // 인라인 코드
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            
            if (isBlock) {
              // 코드 블록
              return (
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-3 overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    {children}
                  </code>
                </pre>
              );
            } else {
              // 인라인 코드
              return (
                <code className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            }
          },
          
          // 블록인용 - 더 예쁜 주의사항/팁 표시
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 pl-4 pr-3 py-3 mb-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <span className="mr-2 text-orange-500">💡</span>
                <div className="text-orange-800 dark:text-orange-200">
                  {children}
                </div>
              </div>
            </blockquote>
          ),
          
          // 단락 - 더 나은 가독성
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200 text-sm">
              {children}
            </p>
          ),
          
          // 구분선
          hr: () => (
            <hr className="border-gray-300 dark:border-gray-600 my-4" />
          ),
          
          // 링크
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 underline"
            >
              {children}
            </a>
          ),
          
          // 테이블
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-orange-50 dark:bg-orange-900/30">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-orange-800 dark:text-orange-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
