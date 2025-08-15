'use client';

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

const SimpleConnectionStatus = () => {
  const [connectionInfo, setConnectionInfo] = useState({
    apiUrl: '',
    wsUrl: '',
    env: '',
    domain: '',
  });

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      setConnectionInfo({
        apiUrl: config.api.baseUrl.startsWith('/') ? `${window.location.origin}${config.api.baseUrl}` : config.api.baseUrl,
        wsUrl: config.api.wsUrl.startsWith('/') ? `${window.location.origin}${config.api.wsUrl}` : config.api.wsUrl,
        env: process.env.NODE_ENV || 'unknown',
        domain: window.location.origin,
      });
    }
  }, []);

  // 클라이언트에서만 렌더링
  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs shadow-xl">
      <div className="font-semibold mb-2 text-blue-300">🔗 백엔드 연결 정보</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">API:</span>
          <div className="font-mono text-green-400 break-all">{connectionInfo.apiUrl}</div>
        </div>
        <div>
          <span className="text-gray-300">WebSocket:</span>
          <div className="font-mono text-blue-400 break-all">{connectionInfo.wsUrl}</div>
        </div>
        <div>
          <span className="text-gray-300">ENV:</span>
          <span className="text-yellow-400 ml-1">{connectionInfo.env}</span>
        </div>
        <div>
          <span className="text-gray-300">Domain:</span>
          <div className="text-purple-400 break-all">{connectionInfo.domain}</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleConnectionStatus;