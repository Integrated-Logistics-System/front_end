import { useState, useEffect, useCallback } from 'react';
import { userStatusService } from '@/services/user-status.service';
import { UserStatus, UserStatusState } from '@/types/user-status.types';
import toast from 'react-hot-toast';

export function useUserStatus() {
  const [state, setState] = useState<UserStatusState>({
    current: null,
    isLoading: false,
    error: null,
    lastSaved: null,
  });

  /**
   * 현재 상태 로드
   */
  const loadStatus = useCallback(async (useCache = true) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 캐시 확인
      if (useCache) {
        const cached = userStatusService.getCachedStatus();
        if (cached) {
          setState(prev => ({
            ...prev,
            current: cached,
            isLoading: false,
            lastSaved: new Date(cached.lastUpdated),
          }));
          return cached;
        }
      }

      // 서버에서 로드
      const status = await userStatusService.getCurrentStatus();
      
      if (status) {
        userStatusService.setCachedStatus(status);
      }

      setState(prev => ({
        ...prev,
        current: status,
        isLoading: false,
        lastSaved: status ? new Date(status.lastUpdated) : null,
      }));

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '상태를 불러오는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  /**
   * 상태 설정/업데이트
   */
  const setStatus = useCallback(async (statusText: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sanitized = userStatusService.sanitizeStatus(statusText);
      
      // 길이 검증
      const lengthInfo = userStatusService.getStatusLengthInfo(sanitized);
      if (!lengthInfo.isValid) {
        throw new Error('상태는 1-50자 사이로 입력해주세요.');
      }

      // 서버 검증
      const validation = await userStatusService.validateStatus(sanitized);
      if (!validation.isValid) {
        throw new Error(validation.error || '유효하지 않은 상태입니다.');
      }

      const newStatus = state.current 
        ? await userStatusService.updateStatus(sanitized)
        : await userStatusService.setStatus(sanitized);

      // 캐시 업데이트
      userStatusService.setCachedStatus(newStatus);

      setState(prev => ({
        ...prev,
        current: newStatus,
        isLoading: false,
        lastSaved: new Date(),
      }));

      toast.success('나의 상태가 저장되었습니다! 🎉');
      return newStatus;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '상태를 저장하는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, [state.current]);

  /**
   * 상태 삭제
   */
  const deleteStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await userStatusService.deleteStatus();
      userStatusService.clearCachedStatus();

      setState(prev => ({
        ...prev,
        current: null,
        isLoading: false,
        lastSaved: null,
      }));

      toast.success('나의 상태가 삭제되었습니다.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '상태를 삭제하는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  /**
   * 상태 검증 (실시간)
   */
  const validateStatus = useCallback(async (statusText: string) => {
    const sanitized = userStatusService.sanitizeStatus(statusText);
    const lengthInfo = userStatusService.getStatusLengthInfo(sanitized);
    
    if (!lengthInfo.isValid) {
      return {
        isValid: false,
        error: lengthInfo.length === 0 
          ? '상태를 입력해주세요.' 
          : '50자 이하로 입력해주세요.',
        lengthInfo,
      };
    }

    try {
      const validation = await userStatusService.validateStatus(sanitized);
      return {
        ...validation,
        lengthInfo,
      };
    } catch (error) {
      return {
        isValid: false,
        error: '검증 중 오류가 발생했습니다.',
        lengthInfo,
      };
    }
  }, []);

  /**
   * LangGraph용 컨텍스트 조회
   */
  const getContextForLangGraph = useCallback(async () => {
    try {
      return await userStatusService.getContextForLangGraph();
    } catch (error) {
      console.error('컨텍스트 조회 실패:', error);
      return '';
    }
  }, []);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadStatus(true);
  }, [loadStatus]);

  return {
    // 상태
    status: state.current,
    isLoading: state.isLoading,
    error: state.error,
    lastSaved: state.lastSaved,
    hasStatus: !!state.current,

    // 액션
    loadStatus,
    setStatus,
    deleteStatus,
    validateStatus,
    getContextForLangGraph,

    // 헬퍼
    sanitizeStatus: userStatusService.sanitizeStatus,
    getStatusLengthInfo: userStatusService.getStatusLengthInfo,
  };
}