// 사용자 상태 관련 타입 정의

export interface UserStatus {
  userId: string;
  status: string;
  isActive: boolean;
  lastUpdated: Date;
  extractedKeywords?: string[];
}

export interface CreateUserStatusDto {
  status: string;
}

export interface UpdateUserStatusDto {
  status: string;
}

export interface UserStatusResponse {
  success: boolean;
  data: UserStatus | null;
  message: string;
}

export interface UserStatusValidation {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

// 프론트엔드 상태 관리를 위한 타입
export interface UserStatusState {
  current: UserStatus | null;
  isLoading: boolean;
  error: string | null;
  lastSaved: Date | null;
}

// 상태 설정 UI를 위한 헬퍼 타입
export interface StatusSuggestion {
  label: string;
  value: string;
  category: 'level' | 'preference' | 'time' | 'dietary';
}

// 미리 정의된 상태 템플릿
export const STATUS_TEMPLATES: StatusSuggestion[] = [
  // 요리 수준
  { label: '요리 초보', value: '요리 초보', category: 'level' },
  { label: '요리 중급', value: '요리 중급자', category: 'level' },
  { label: '요리 고수', value: '요리 좋아해요', category: 'level' },

  // 시간 제약
  { label: '빠른 요리', value: '30분 이하 빠른 요리 선호', category: 'time' },
  { label: '간단한 요리', value: '간단하고 쉬운 요리 좋아함', category: 'time' },
  
  // 맛 선호
  { label: '매운맛 싫어함', value: '매운 음식 못먹어요', category: 'dietary' },
  { label: '담백한 맛', value: '담백하고 깔끔한 맛 선호', category: 'preference' },
  { label: '달콤한 맛', value: '단맛 좋아합니다', category: 'preference' },

  // 식이 제한
  { label: '채식주의', value: '채식 위주로 먹어요', category: 'dietary' },
  { label: '저염식', value: '짜지 않은 음식 선호', category: 'dietary' },
];

// 카테고리별 색상 매핑
export const CATEGORY_COLORS = {
  level: 'bg-blue-100 text-blue-800',
  preference: 'bg-green-100 text-green-800', 
  time: 'bg-orange-100 text-orange-800',
  dietary: 'bg-purple-100 text-purple-800',
} as const;