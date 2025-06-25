import {SetterOrUpdater, useRecoilState, useRecoilValue} from 'recoil';
import { useCallback } from 'react';
import {AuthState, authState, User} from '@/store/authStore';
import { authService } from '@/services/authService';

export function useAuthViewModel() {
  const [auth, setAuth] = useRecoilState(authState);

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
  }, [setAuth]);

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
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }, [setAuth]);

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

  const initializeAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    // 이미 인증되었다면 실행하지 않음
    if (auth.isAuthenticated && auth.user) {
      console.log('✅ 이미 인증된 상태 - 스킵');
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    console.log('🔍 AuthViewModel initializeAuth:', { token, isAuthenticated: auth.isAuthenticated });
    
    if (!token) {
      console.log('🚨 토큰이 없음 - 로그아웃 상태로 설정');
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    setAuth(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔍 토큰으로 프로필 조회 시도...');
      const response = await authService.getProfile(token);
      
      if (response.success) {
        console.log('✅ 프로필 조회 성공:', response.user);
        setAuth({
          user: response.user || null,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        console.log('❌ 토큰 만료 - 삭제');
        // Invalid token, remove it
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
      console.log('❌ 프로필 조회 에러:', error);
      localStorage.removeItem('auth_token');
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [setAuth, auth.isAuthenticated, auth.user]);

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
    initializeAuth,
    setAuth: setAuth as SetterOrUpdater<AuthState>, // 타입 명시
  };
}
