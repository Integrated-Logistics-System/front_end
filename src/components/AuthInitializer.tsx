'use client';

import { useEffect, useRef } from 'react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export function AuthInitializer() {
  const { initializeAuth } = useAuthViewModel();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었다면 실행하지 않음
    if (hasInitialized.current) {
      console.log('🗑️ AuthInitializer: 이미 초기화됨 - 스킵');
      return;
    }
    
    console.log('🔄 AuthInitializer: 시작');
    hasInitialized.current = true;
    
    // 약간의 딜레이를 둔어 토큰 저장이 완료될 때까지 기다림
    const timeoutId = setTimeout(() => {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 AuthInitializer 토큰 체크:', token);
      
      initializeAuth();
    }, 100); // 100ms 딜레이
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  return null;
}
