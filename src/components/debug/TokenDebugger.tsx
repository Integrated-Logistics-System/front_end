'use client';

import { useState } from 'react';

export function TokenDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  
  const getCurrentToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 'No token found';
    }
    return 'Window not available';
  };
  
  const setTestToken = () => {
    if (tokenInput.trim() && typeof window !== 'undefined') {
      localStorage.setItem('token', tokenInput.trim());
      alert('토큰이 설정되었습니다!');
      setTokenInput('');
    }
  };
  
  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      alert('토큰이 삭제되었습니다!');
    }
  };
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-50 bg-purple-500 text-white p-3 rounded-full shadow-lg text-sm"
        style={{ touchAction: 'manipulation' }}
      >
        🔑
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-purple-900 text-white p-3 sm:p-4 font-mono text-xs max-h-80 overflow-auto safe-area-bottom">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <span className="font-bold text-xs sm:text-sm">🔑 Token Manager</span>
        <button
          onClick={() => setIsVisible(false)}
          className="bg-red-600 px-2 py-1 rounded text-xs touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          ❌
        </button>
      </div>
      
      <div className="space-y-2 sm:space-y-3 pb-16 sm:pb-4">
        <div>
          <div className="font-bold text-yellow-300 mb-1 text-xs">현재 토큰:</div>
          <div className="bg-gray-800 p-2 rounded text-xs break-all max-h-20 overflow-y-auto">
            {getCurrentToken()}
          </div>
        </div>
        
        <div>
          <div className="font-bold text-green-300 mb-1 text-xs">토큰 설정:</div>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="토큰을 입력하세요"
            className="w-full p-2 rounded bg-gray-800 text-white text-xs border border-gray-600 focus:border-purple-400"
            style={{ fontSize: '16px' }} // iOS 줄 방지
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={setTestToken}
              className="bg-green-600 px-3 py-2 rounded text-xs flex-1 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              설정
            </button>
            <button
              onClick={clearToken}
              className="bg-red-600 px-3 py-2 rounded text-xs flex-1 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              삭제
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded">
          💡 컴퓨터에서 토큰을 복사해서 핸드폰에 붙여넣으세요
        </div>
      </div>
    </div>
  );
}