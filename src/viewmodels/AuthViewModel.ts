import {SetterOrUpdater, useRecoilState, useRecoilValue} from 'recoil';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {AuthState, authState, User} from '@/store/authStore';
import { authService } from '@/services/authService';

// 전역 초기화 플래그
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export function useAuthViewModel() {
  const [auth, setAuth] = useRecoilState(authState);
  const router = useRouter();
  const hasInitialized = useRef(false);

  // 초기 토큰 로드 및 인증 상태 복원 (전역적으로 한 번만)
  useEffect(() => {
    if (hasInitialized.current || isInitialized) return;
    
    if (initializationPromise) {
      // 이미 초기화 중이면 기다림
      return;
    }

    hasInitialized.current = true;
    isInitialized = true;

    initializationPromise = (async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('auth_token');
      console.log('🔍 AuthViewModel 초기화 (전역, 한 번만):', { token: token ? 'exists' : 'null' });
      
      if (!token) {
        setAuth(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setAuth(prev => ({ ...prev, isLoading: true }));
        
        // 토큰으로 사용자 프로필 가져오기
        console.log('🔍 프로필 API 호출 중...');
        const response = await authService.getProfile();
        console.log('🔍 프로필 API 응답:', response);
        
        if (response.success && response.user) {
          console.log('✅ 토큰으로 인증 상태 복원:', response.user.email);
          setAuth({
            user: response.user,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // 토큰이 유효하지 않음
          console.log('❌ 토큰 만료 - 삭제', response);
          localStorage.removeItem('auth_token');
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('❌ 토큰 검증 실패:', error);
        localStorage.removeItem('auth_token');
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    })();

    initializationPromise.finally(() => {
      initializationPromise = null;
    });
  }, []); // 빈 의존성 배열 - 앱 시작 시 한 번만 실행

  const login = useCallback(async (email: string, password: string) => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));


    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        console.log('✅ 로그인 성공:', response.user);
        
        // 상태 업데이트
        setAuth({
          user: response.user || null,
          token: response.token || null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // localStorage에 토큰 저장
        if (typeof window !== 'undefined' && response.token) {
          localStorage.setItem('auth_token', response.token);
          console.log('💾 토큰 저장 완료');
        }
        
        // 리다이렉트는 컴포넌트의 useEffect에서 처리
        
        return { success: true };
      } else {
        setAuth(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || '로그인에 실패했습니다.',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || '네트워크 오류가 발생했습니다.';
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [setAuth, router]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.register(email, password, name);
      
      if (response.success) {
        setAuth({
          user: response.user || null,
          token: response.token || null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Store token in localStorage
        if (typeof window !== 'undefined' && response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // 리다이렉트는 컴포넌트의 useEffect에서 처리
        
        return { success: true };
      } else {
        setAuth(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || '회원가입에 실패했습니다.',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || '네트워크 오류가 발생했습니다.';
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [setAuth, router]);

  const logout = useCallback(() => {
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    // 모든 토큰 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // 홈페이지로 리다이렉트
    router.push('/');
  }, [setAuth, router]);

  const clearError = useCallback(() => {
    setAuth(prev => ({ ...prev, error: null }));
  }, [setAuth]);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        setAuth(prev => ({
          ...prev,
          user: response.user || null,
          isLoading: false,
          error: null,
        }));
        return { success: true };
      } else {
        setAuth(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || '프로필 업데이트에 실패했습니다.',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || '네트워크 오류가 발생했습니다.';
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [setAuth]);

  // initializeAuth 함수 제거됨 - useEffect에서 자동 처리

  return {
    // State
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    updateProfile,
    setAuth: setAuth as SetterOrUpdater<AuthState>, // 타입 명시
  };
}
