'use client';

import { useState, useEffect } from 'react';

export function SimpleDebugPanel() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 환경 변수 정보 수집 (한 번만)
    const info = {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      WS_URL: process.env.NEXT_PUBLIC_WS_URL,
      NODE_ENV: process.env.NODE_ENV,
    };
    setEnvInfo(info);

    // API 테스트 (한 번만)
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      } as any);
      
      if (response.ok) {
        setApiStatus('✅ API Connected');
      } else {
        setApiStatus(`❌ API Failed (${response.status})`);
      }
    } catch (error: any) {
      setApiStatus(`❌ API Error: ${error.message}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg text-sm"
      >
        ℹ️
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white p-4 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">🔧 Debug Info</span>
        <button
          onClick={() => setIsVisible(false)}
          className="bg-red-500 px-2 py-1 rounded text-xs"
        >
          ❌
        </button>
      </div>
      
      <div className="space-y-1">
        <div><strong>Environment:</strong></div>
        {envInfo && (
          <div className="pl-2 text-green-400">
            <div>API: {envInfo.API_URL}</div>
            <div>WS: {envInfo.WS_URL}</div>
            <div>ENV: {envInfo.NODE_ENV}</div>
          </div>
        )}
        
        <div className="mt-2">
          <strong>API Status:</strong> <span className="text-yellow-400">{apiStatus}</span>
        </div>
      </div>
    </div>
  );
}