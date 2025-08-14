import { AppConfig } from '@/types/env.types';

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : defaultValue;
};

const getEnvArray = (key: string, defaultValue: string[] = []): string[] => {
  const value = process.env[key];
  return value ? value.split(',').map(item => item.trim()) : defaultValue;
};

export const config: AppConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083',
    timeout: getEnvNumber('API_TIMEOUT', 600000), // 10분
  },
  websocket: {
    reconnectAttempts: getEnvNumber('NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS', 5),
    reconnectDelay: getEnvNumber('NEXT_PUBLIC_WS_RECONNECT_DELAY', 3000), // 3초
    timeout: getEnvNumber('NEXT_PUBLIC_WS_TIMEOUT', 120000), // 2분
    pingInterval: getEnvNumber('NEXT_PUBLIC_WS_PING_INTERVAL', 30000), // 30초
  },
  ui: {
    streamingChunkDelay: getEnvNumber('NEXT_PUBLIC_STREAMING_CHUNK_DELAY', 50),
    recipesPerPage: getEnvNumber('NEXT_PUBLIC_RECIPES_PER_PAGE', 6),
    animationDuration: getEnvNumber('NEXT_PUBLIC_ANIMATION_DURATION', 300),
  },
  app: {
    debugMode: getEnvBoolean('NEXT_PUBLIC_DEBUG_MODE', process.env.NODE_ENV === 'development'),
    sessionTimeout: getEnvNumber('NEXT_PUBLIC_SESSION_TIMEOUT', 86400000), // 24시간
    imageDomains: getEnvArray('NEXT_PUBLIC_IMAGE_DOMAINS', ['localhost', 'via.placeholder.com']),
  },
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

export const { api, websocket, ui, app } = config;