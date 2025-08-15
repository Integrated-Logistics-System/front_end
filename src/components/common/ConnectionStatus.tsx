'use client';

import { useState } from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

const ConnectionStatus = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { connectionInfo, refreshApiConnection, refreshWebSocketConnection } = useConnectionStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'checking':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return '연결됨';
      case 'connecting':
        return '연결 중';
      case 'checking':
        return '확인 중';
      case 'disconnected':
        return '연결 끊김';
      default:
        return '알 수 없음';
    }
  };

  const formatUrl = (url: string) => {
    if (typeof window === 'undefined') {
      return url; // 서버사이드에서는 그대로 반환
    }
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleTimeString('ko-KR');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 상태 표시 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-shadow"
        title="백엔드 연결 상태"
      >
        <div className="flex space-x-1">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(connectionInfo.api.status)}`}
            title={`API: ${getStatusText(connectionInfo.api.status)}`}
          />
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(connectionInfo.websocket.status)}`}
            title={`WebSocket: ${getStatusText(connectionInfo.websocket.status)}`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          연결 상태
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 상세 정보 패널 */}
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80">
          <h3 className="font-semibold text-gray-800 mb-3">백엔드 연결 상태</h3>
          
          {/* API 연결 정보 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">API 서버</h4>
              <button
                onClick={refreshApiConnection}
                className="text-blue-600 hover:text-blue-800 text-sm"
                title="새로고침"
              >
                🔄
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionInfo.api.status)}`} />
                <span className="font-medium">{getStatusText(connectionInfo.api.status)}</span>
              </div>
              <div>
                <span className="text-gray-600">URL: </span>
                <span className="font-mono text-xs break-all">
                  {formatUrl(connectionInfo.api.url)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">마지막 확인: </span>
                <span>{formatTime(connectionInfo.api.lastChecked)}</span>
              </div>
            </div>
          </div>

          {/* WebSocket 연결 정보 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">WebSocket</h4>
              <button
                onClick={refreshWebSocketConnection}
                className="text-blue-600 hover:text-blue-800 text-sm"
                title="새로고침"
              >
                🔄
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionInfo.websocket.status)}`} />
                <span className="font-medium">{getStatusText(connectionInfo.websocket.status)}</span>
              </div>
              <div>
                <span className="text-gray-600">URL: </span>
                <span className="font-mono text-xs break-all">
                  {formatUrl(connectionInfo.websocket.url)}
                </span>
              </div>
              {connectionInfo.websocket.socketId && (
                <div>
                  <span className="text-gray-600">Socket ID: </span>
                  <span className="font-mono text-xs">
                    {connectionInfo.websocket.socketId.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 환경 정보 */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>ENV: {process.env.NODE_ENV}</div>
              <div>Domain: {typeof window !== 'undefined' ? window.location.origin : 'Server Side'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;