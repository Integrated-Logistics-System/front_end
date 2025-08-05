export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

// API 설정
export const API_CONFIG = {
  TIMEOUT: 600000, // 10분 (600초)
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2초
} as const;

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  CHAT: '/chat',
  PROFILE: '/profile',
  AUTH: {
    LOGIN: '/',
    REGISTER: '/auth/register',
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/users/profile',
  },
  USER: {
    ALLERGIES: '/users/allergies',
    PROFILE: '/users/profile',
    COOKING_PREFERENCES: '/users/cooking-preferences',
  },
  RECIPE: {
    SEARCH: '/recipes/search',
    DETAIL: '/recipes',
  },
  // 새로운 간단한 Chat API (LangChain + RAG + Agent)
  CHAT: {
    SEND: '/chat',
    SEARCH: '/chat/search',
    STATUS: '/chat/status',
    SUGGESTIONS: '/chat/suggestions',
    KEYWORDS: '/chat/keywords',
  },
  // 기존 대화 히스토리는 유지
  CONVERSATION: {
    HISTORY: '/conversation/history',
  },
  // 아카이브된 복잡한 엔드포인트들 (더 이상 사용하지 않음)
  // LANGCHAIN: { ... },
  ALLERGEN: {
    CHECK: '/allergen/check',
    TYPES: '/allergen/types',
    INGREDIENT: '/allergen/ingredient',
    SEARCH: '/allergen/search',
  },
} as const;

export const ALLERGEN_TYPES = [
  '글루텐함유곡물',
  '갑각류',
  '계란',
  '어류',
  '땅콩',
  '대두',
  '우유',
  '견과류',
  '셀러리',
  '겨자',
  '참깨',
  '아황산류',
  '루핀',
  '연체동물',
  '복숭아',
  '토마토',
  '돼지고기',
  '쇠고기',
  '닭고기',
] as const;

export const QUERY_KEYS = {
  RECIPES: 'recipes',
  RECIPE_SEARCH: 'recipe-search',
  ALLERGEN_TYPES: 'allergen-types',
  ALLERGEN_CHECK: 'allergen-check',
  CHAT_HISTORY: 'chat-history',
  USER_PROFILE: 'user-profile',
} as const;

export const DEFAULT_SEARCH_PARAMS = {
  page: 1,
  limit: 10,
} as const;

export const THEME_COLORS = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
} as const;
