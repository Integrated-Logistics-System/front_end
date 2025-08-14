import { api } from './config';

export const API_BASE_URL = api.baseUrl;

// API 설정
export const API_CONFIG = {
  TIMEOUT: api.timeout,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2초
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
