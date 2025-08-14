declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 기본 Next.js 환경변수
      readonly NODE_ENV: 'development' | 'production' | 'test';
      NEXT_TELEMETRY_DISABLED: string;
      
      // API 설정
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_WS_URL: string;
      API_TIMEOUT: string;
      
      // WebSocket 설정
      NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS: string;
      NEXT_PUBLIC_WS_RECONNECT_DELAY: string;
      NEXT_PUBLIC_WS_TIMEOUT: string;
      NEXT_PUBLIC_WS_PING_INTERVAL: string;
      
      // UI 설정
      NEXT_PUBLIC_STREAMING_CHUNK_DELAY: string;
      NEXT_PUBLIC_RECIPES_PER_PAGE: string;
      NEXT_PUBLIC_ANIMATION_DURATION: string;
      
      // 개발/디버그 설정
      NEXT_PUBLIC_DEBUG_MODE: string;
      
      // 보안 설정
      NEXT_PUBLIC_SESSION_TIMEOUT: string;
      
      // 이미지 도메인
      NEXT_PUBLIC_IMAGE_DOMAINS: string;
    }
  }
}

export interface AppConfig {
  api: {
    baseUrl: string;
    wsUrl: string;
    timeout: number;
  };
  websocket: {
    reconnectAttempts: number;
    reconnectDelay: number;
    timeout: number;
    pingInterval: number;
  };
  ui: {
    streamingChunkDelay: number;
    recipesPerPage: number;
    animationDuration: number;
  };
  app: {
    debugMode: boolean;
    sessionTimeout: number;
    imageDomains: string[];
  };
}

export {};