'use client';

import { useState, useEffect } from 'react';

interface DebugInfo {
  environment: {
    API_URL: string | undefined;
    WS_URL: string | undefined;
    NODE_ENV: string | undefined;
  };
  apiTest: {
    status: string;
    responseTime: number | null;
    error: string | null;
    details: any;
  };
  networkInfo: {
    userAgent: string;
    platform: string;
    language: string;
    cookieEnabled: boolean;
    onLine: boolean;
  };
  authTest: {
    hasLocalStorage: boolean;
    hasToken: boolean;
    tokenPreview: string | null;
  };
}

export function EnhancedDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [testStep, setTestStep] = useState<string>('Initializing...');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      runDiagnostics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runDiagnostics = async () => {
    setTestStep('🔍 환경 변수 확인 중...');
    
    const info: DebugInfo = {
      environment: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NODE_ENV: process.env.NODE_ENV,
      },
      apiTest: {
        status: 'Testing...',
        responseTime: null,
        error: null,
        details: null
      },
      networkInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      },
      authTest: {
        hasLocalStorage: typeof localStorage !== 'undefined',
        hasToken: false,
        tokenPreview: null
      }
    };

    // localStorage 테스트
    setTestStep('🔐 인증 정보 확인 중...');
    try {
      const token = localStorage.getItem('token');
      info.authTest.hasToken = !!token;
      info.authTest.tokenPreview = token ? `${token.substring(0, 20)}...` : null;
    } catch (error) {
      info.authTest.hasLocalStorage = false;
    }

    setDebugInfo(info);

    // API 테스트
    setTestStep('🌐 API 연결 테스트 중...');
    await testAPI(info);
  };

  const testAPI = async (info: DebugInfo) => {
    const startTime = Date.now();
    
    try {
      const apiUrl = info.environment.API_URL;
      if (!apiUrl) {
        throw new Error('API_URL이 설정되지 않음');
      }

      setTestStep(`📡 ${apiUrl}/auth/health 요청 중...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch(`${apiUrl}/auth/health`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      let responseData;
      try {
        responseData = await response.text();
        if (responseData) {
          responseData = JSON.parse(responseData);
        }
      } catch (e) {
        // JSON이 아닐 수 있음
      }

      const updatedInfo = {
        ...info,
        apiTest: {
          status: response.ok ? '✅ 성공' : `❌ 실패 (${response.status})`,
          responseTime,
          error: response.ok ? null : `HTTP ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: responseData
          }
        }
      };

      setDebugInfo(updatedInfo);
      setTestStep('✅ 진단 완료');

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      let errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = '요청 타임아웃 (10초)';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'CORS 또는 네트워크 오류';
      }

      const updatedInfo = {
        ...info,
        apiTest: {
          status: '❌ 연결 실패',
          responseTime,
          error: errorMessage,
          details: {
            name: error.name,
            message: error.message,
            stack: error.stack?.substring(0, 200)
          }
        }
      };

      setDebugInfo(updatedInfo);
      setTestStep(`❌ API 테스트 실패: ${errorMessage}`);
    }
  };

  const copyToClipboard = () => {
    if (debugInfo) {
      const text = JSON.stringify(debugInfo, null, 2);
      navigator.clipboard?.writeText(text).then(() => {
        alert('디버그 정보가 클립보드에 복사되었습니다!');
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('디버그 정보가 클립보드에 복사되었습니다!');
      });
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg text-sm"
        style={{ touchAction: 'manipulation' }}
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white font-mono text-xs max-h-80 sm:max-h-96 overflow-auto safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800 border-b border-gray-600 sticky top-0">
        <span className="font-bold text-xs sm:text-sm">🔧 Enhanced Debug Panel</span>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="bg-yellow-600 text-white px-2 py-1 rounded text-xs touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            {isMinimized ? '📖' : '📕'}
          </button>
          <button
            onClick={copyToClipboard}
            className="bg-green-600 text-white px-2 py-1 rounded text-xs touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            📋
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            ❌
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 pb-20 sm:pb-4">
          {/* Current Status */}
          <div className="bg-blue-900 p-2 rounded">
            <div className="font-bold text-blue-200">📊 현재 상태</div>
            <div className="text-yellow-300">{testStep}</div>
          </div>

          {debugInfo && (
            <>
              {/* Environment */}
              <div className="bg-gray-800 p-2 rounded">
                <div className="font-bold text-green-300 mb-1">🌍 환경 변수</div>
                <div className="pl-2 space-y-1 text-xs">
                  <div>
                    <span className="text-yellow-300">API_URL:</span>{' '}
                    <span className={debugInfo.environment.API_URL ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.environment.API_URL || '❌ 설정 안됨'}
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-300">WS_URL:</span>{' '}
                    <span className={debugInfo.environment.WS_URL ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.environment.WS_URL || '❌ 설정 안됨'}
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-300">NODE_ENV:</span>{' '}
                    <span className="text-blue-400">{debugInfo.environment.NODE_ENV}</span>
                  </div>
                </div>
              </div>

              {/* API Test */}
              <div className="bg-gray-800 p-2 rounded">
                <div className="font-bold text-orange-300 mb-1">🌐 API 테스트</div>
                <div className="pl-2 space-y-1 text-xs">
                  <div>
                    <span className="text-yellow-300">상태:</span>{' '}
                    <span>{debugInfo.apiTest.status}</span>
                  </div>
                  <div>
                    <span className="text-yellow-300">응답시간:</span>{' '}
                    <span className="text-blue-400">
                      {debugInfo.apiTest.responseTime ? `${debugInfo.apiTest.responseTime}ms` : 'N/A'}
                    </span>
                  </div>
                  {debugInfo.apiTest.error && (
                    <div>
                      <span className="text-yellow-300">에러:</span>{' '}
                      <span className="text-red-400">{debugInfo.apiTest.error}</span>
                    </div>
                  )}
                  {debugInfo.apiTest.details && (
                    <div className="mt-1 p-1 bg-gray-900 rounded text-xs">
                      <pre className="whitespace-pre-wrap overflow-auto max-h-20">
                        {JSON.stringify(debugInfo.apiTest.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Network Info */}
              <div className="bg-gray-800 p-2 rounded">
                <div className="font-bold text-purple-300 mb-1">📱 네트워크 정보</div>
                <div className="pl-2 space-y-1 text-xs">
                  <div>
                    <span className="text-yellow-300">온라인:</span>{' '}
                    <span className={debugInfo.networkInfo.onLine ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.networkInfo.onLine ? '✅ 연결됨' : '❌ 오프라인'}
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-300">플랫폼:</span>{' '}
                    <span className="text-blue-400">{debugInfo.networkInfo.platform}</span>
                  </div>
                  <div>
                    <span className="text-yellow-300">언어:</span>{' '}
                    <span className="text-blue-400">{debugInfo.networkInfo.language}</span>
                  </div>
                  <div>
                    <span className="text-yellow-300">쿠키:</span>{' '}
                    <span className={debugInfo.networkInfo.cookieEnabled ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.networkInfo.cookieEnabled ? '✅ 활성화' : '❌ 비활성화'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Auth Info */}
              <div className="bg-gray-800 p-2 rounded">
                <div className="font-bold text-cyan-300 mb-1">🔐 인증 정보</div>
                <div className="pl-2 space-y-1 text-xs">
                  <div>
                    <span className="text-yellow-300">localStorage:</span>{' '}
                    <span className={debugInfo.authTest.hasLocalStorage ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.authTest.hasLocalStorage ? '✅ 사용 가능' : '❌ 사용 불가'}
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-300">토큰:</span>{' '}
                    <span className={debugInfo.authTest.hasToken ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.authTest.hasToken ? '✅ 존재' : '❌ 없음'}
                    </span>
                  </div>
                  {debugInfo.authTest.tokenPreview && (
                    <div>
                      <span className="text-yellow-300">토큰 미리보기:</span>{' '}
                      <span className="text-gray-400 text-xs">{debugInfo.authTest.tokenPreview}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}