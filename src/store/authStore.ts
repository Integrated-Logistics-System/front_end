// frontend/src/store/authStore.ts
import { atom, selector } from 'recoil';

export interface User {
  id: string;
  email: string;
  name: string;
  allergies: string[]; // 백엔드와 맞춤
  cookingLevel: string; // 백엔드와 맞춤
  preferences: string[];
  createdAt?: string;
  // 기존 복잡한 프로필 구조는 나중에 확장
  allergenProfile?: {
    allergies: string[];
    severity: { [key: string]: 'low' | 'medium' | 'high' };
  };
  cookingProfile?: {
    level: 'beginner' | 'intermediate' | 'advanced';
    preferences: string[];
    equipment: string[];
    familySize: number;
    dietGoals: string;
    cookingHistory: {
      recipe: string;
      success: boolean;
      date: Date;
      rating: number;
    }[];
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth State
export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
});

// User Token Selector (localStorage 백업 포함)
export const userTokenSelector = selector({
  key: 'userTokenSelector',
  get: ({ get }) => {
    const auth = get(authState);

    if (auth.token) {
      return auth.token;
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }

    return null;
  },
});

// User Allergies Selector
export const userAllergiesSelector = selector({
  key: 'userAllergiesSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.allergies || [];
  },
});

// Cooking Level Selector
export const cookingLevelSelector = selector({
  key: 'cookingLevelSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.cookingLevel || '초급';
  },
});

// User Preferences Selector
export const userPreferencesSelector = selector({
  key: 'userPreferencesSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.preferences || [];
  },
});

// Is Authenticated Selector
export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.isAuthenticated && !!auth.token && !!auth.user;
  },
});

// User ID Selector
export const userIdSelector = selector({
  key: 'userIdSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.id || null;
  },
});

// User Profile Selector
export const userProfileSelector = selector({
  key: 'userProfileSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user;
  },
});

// Cooking Profile Selector
export const cookingProfileSelector = selector({
  key: 'cookingProfileSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.cookingProfile || null;
  },
});