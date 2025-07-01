'use client';

import { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

export function MobileDebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    // 기존 console 메서드들을 가로채기
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const addLog = (level: LogEntry['level'], message: string, data?: any) => {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        data
      };

      setLogs(prev => [...prev.slice(-19), logEntry]); // 최근 20개만 유지
    };

    // console 메서드 오버라이드
    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args.join(' '), args.length > 1 ? args : undefined);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args.join(' '), args.length > 1 ? args : undefined);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args.join(' '), args.length > 1 ? args : undefined);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog('info', args.join(' '), args.length > 1 ? args : undefined);
    };

    // 환경 변수 정보 자동 로그
    addLog('info', '🔧 Environment Variables', {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      WS_URL: process.env.NEXT_PUBLIC_WS_URL,
      NODE_ENV: process.env.NODE_ENV
    });

    // 초기 연결 테스트
    testConnections();

    return () => {
      // 원래 console 복원
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  const testConnections = async () => {
    console.log('🧪 Starting connection tests...');
    
    // API 테스트
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log(`🔗 Testing API: ${apiUrl}`);
      
      const response = await fetch(`${apiUrl}/auth/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ API Connection: SUCCESS');
      } else {
        console.error(`❌ API Connection: FAILED (${response.status})`);
      }
    } catch (error) {
      console.error('❌ API Connection: ERROR', error);
    }

    // WebSocket 테스트
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
      console.log(`🔗 Testing WebSocket: ${wsUrl}`);
      // WebSocket 테스트는 실제 socket.io 라이브러리가 필요하므로 URL만 확인
      console.log('📡 WebSocket URL configured');
    } catch (error) {
      console.error('❌ WebSocket test error:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-3 rounded-full shadow-lg"
        style={{ touchAction: 'manipulation' }}
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-green-400 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-600">
        <span className="font-bold">📱 Mobile Debug Console</span>
        <div className="flex gap-2">
          <button
            onClick={toggleMinimize}
            className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
          >
            {isMinimized ? '📖' : '📕'}
          </button>
          <button
            onClick={clearLogs}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            🧹
          </button>
          <button
            onClick={toggleVisibility}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            ❌
          </button>
        </div>
      </div>

      {/* Logs */}
      {!isMinimized && (
        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`text-xs p-1 rounded ${
                  log.level === 'error' ? 'bg-red-900 text-red-200' :
                  log.level === 'warn' ? 'bg-yellow-900 text-yellow-200' :
                  log.level === 'info' ? 'bg-blue-900 text-blue-200' :
                  'bg-gray-800 text-green-300'
                }`}
              >
                <span className="text-gray-400">[{log.timestamp}]</span>{' '}
                <span className="font-bold">
                  {log.level === 'error' ? '❌' :
                   log.level === 'warn' ? '⚠️' :
                   log.level === 'info' ? 'ℹ️' : '📝'}
                </span>{' '}
                <span>{log.message}</span>
                {log.data && (
                  <div className="mt-1 pl-4 text-gray-300">
                    {JSON.stringify(log.data, null, 2)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
