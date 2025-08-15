'use client';

import { useEffect, useState } from 'react';

const SimpleConnectionStatus = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || '/socket.io';
  const env = process.env.NODE_ENV || 'development';

  const getFullUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path}`;
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg text-sm shadow-xl"
      style={{ 
        position: 'fixed', 
        bottom: '16px', 
        right: '16px', 
        zIndex: 9999,
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px'
      }}
    >
      <div className="font-bold mb-2">🔗 백엔드 연결 URL</div>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-red-200">API:</span>
          <div className="font-mono text-yellow-300 break-all">
            {getFullUrl(apiUrl)}
          </div>
        </div>
        <div>
          <span className="text-red-200">WS:</span>
          <div className="font-mono text-blue-300 break-all">
            {getFullUrl(wsUrl)}
          </div>
        </div>
        <div>
          <span className="text-red-200">ENV:</span>
          <span className="text-green-300 ml-1">{env}</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleConnectionStatus;