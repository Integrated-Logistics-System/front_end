// frontend/src/components/providers/AuthInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initializeAuth } = useAuthViewModel();

    useEffect(() => {
        // 앱 시작 시 자동으로 인증 상태 확인 및 데이터 로드
        console.log('🚀 AuthInitializer - 앱 시작, 인증 상태 확인...');
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
}