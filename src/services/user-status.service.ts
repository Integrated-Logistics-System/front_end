import { apiClient } from '@/lib/api';
import { 
  UserStatus, 
  CreateUserStatusDto, 
  UpdateUserStatusDto, 
  UserStatusResponse,
  UserStatusValidation 
} from '@/types/user-status.types';

class UserStatusService {
  private baseUrl = '/user-status';

  /**
   * 현재 사용자 상태 조회
   */
  async getCurrentStatus(): Promise<UserStatus | null> {
    try {
      const response = await apiClient.get<UserStatusResponse>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('사용자 상태 조회 실패:', error);
      return null;
    }
  }

  /**
   * 사용자 상태 설정/업데이트
   */
  async setStatus(status: string): Promise<UserStatus> {
    try {
      const dto: CreateUserStatusDto = { status: status.trim() };
      const response = await apiClient.post<{
        success: boolean;
        data: UserStatus;
        message: string;
      }>(this.baseUrl, dto);

      if (!response.success) {
        throw new Error(response.message || '상태 설정에 실패했습니다.');
      }

      return response.data;
    } catch (error: any) {
      console.error('사용자 상태 설정 실패:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        '상태를 설정하는데 실패했습니다.'
      );
    }
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateStatus(status: string): Promise<UserStatus> {
    try {
      const dto: UpdateUserStatusDto = { status: status.trim() };
      const response = await apiClient.put<{
        success: boolean;
        data: UserStatus;
        message: string;
      }>(this.baseUrl, dto);

      if (!response.success) {
        throw new Error(response.message || '상태 업데이트에 실패했습니다.');
      }

      return response.data;
    } catch (error: any) {
      console.error('사용자 상태 업데이트 실패:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        '상태를 업데이트하는데 실패했습니다.'
      );
    }
  }

  /**
   * 사용자 상태 삭제
   */
  async deleteStatus(): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(this.baseUrl);

      if (!response.success) {
        throw new Error(response.message || '상태 삭제에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('사용자 상태 삭제 실패:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        '상태를 삭제하는데 실패했습니다.'
      );
    }
  }

  /**
   * 상태 유효성 검증
   */
  async validateStatus(status: string): Promise<UserStatusValidation> {
    try {
      const response = await apiClient.post<UserStatusValidation>(
        `${this.baseUrl}/validate`,
        { status }
      );

      return response;
    } catch (error) {
      console.error('상태 검증 실패:', error);
      return {
        isValid: false,
        error: '검증 중 오류가 발생했습니다.',
      };
    }
  }

  /**
   * LangGraph용 컨텍스트 조회
   */
  async getContextForLangGraph(): Promise<string> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        context: string;
      }>(`${this.baseUrl}/context`);

      return response.context || '';
    } catch (error) {
      console.error('컨텍스트 조회 실패:', error);
      return '';
    }
  }

  /**
   * 로컬 스토리지에서 캐시된 상태 조회
   */
  getCachedStatus(): UserStatus | null {
    try {
      const cached = localStorage.getItem('user_status');
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // 캐시 유효성 검사 (24시간)
      const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
      if (cacheAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('user_status');
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('캐시 조회 실패:', error);
      localStorage.removeItem('user_status');
      return null;
    }
  }

  /**
   * 로컬 스토리지에 상태 캐시
   */
  setCachedStatus(status: UserStatus): void {
    try {
      const cacheData = {
        data: status,
        cachedAt: new Date().toISOString(),
      };
      localStorage.setItem('user_status', JSON.stringify(cacheData));
    } catch (error) {
      console.error('캐시 저장 실패:', error);
    }
  }

  /**
   * 캐시 삭제
   */
  clearCachedStatus(): void {
    try {
      localStorage.removeItem('user_status');
    } catch (error) {
      console.error('캐시 삭제 실패:', error);
    }
  }

  /**
   * 상태 문자열 정리 (프론트엔드 헬퍼)
   */
  sanitizeStatus(status: string): string {
    return status
      .trim()
      .replace(/\s+/g, ' ') // 연속 공백을 하나로
      .substring(0, 50); // 50자 제한
  }

  /**
   * 상태 길이 검사 (프론트엔드 헬퍼)
   */
  getStatusLengthInfo(status: string): {
    length: number;
    remaining: number;
    isValid: boolean;
  } {
    const trimmed = status.trim();
    return {
      length: trimmed.length,
      remaining: Math.max(0, 50 - trimmed.length),
      isValid: trimmed.length > 0 && trimmed.length <= 50,
    };
  }
}

export const userStatusService = new UserStatusService();