// AI 채팅 관련 타입 정의

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    intent?: 'recipe_list' | 'recipe_detail' | 'alternative_recipe' | 'general_chat' | 'unknown';
    conversationType?: 'recipe_list' | 'recipe_detail' | 'alternative_recipe' | 'general_chat';
    tone?: string;
    confidence?: number;
    processingTime?: number;
    suggestedFollowups?: string[];
    recipeData?: any[];
    recipeDetail?: any;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isStreaming: boolean;
  currentSessionId?: string;
  error?: string;
}

export interface WebSocketMessage {
  type: 'start' | 'token' | 'metadata' | 'completed' | 'error';
  content: string;
  metadata?: {
    step?: string;
    intent?: string;
    confidence?: number;
    processingTime?: number;
    isLast?: boolean;
    position?: number;
    total?: number;
    anonymous?: boolean;
  };
  timestamp: number;
  version?: string;
  streaming?: boolean;
  anonymous?: boolean;
  completed?: boolean;
  error?: boolean;
}

export interface StreamingChunk {
  type: 'token' | 'metadata';
  content: string;
  metadata?: any;
}

// 채팅 설정
export interface ChatConfig {
  enableStreaming: boolean;
  enableTypingIndicator: boolean;
  maxMessageLength: number;
  reconnectAttempts: number;
  messageCacheSize: number;
}

// 사용자 상태
export interface UserChatState {
  isAuthenticated: boolean;
  userId?: string;
  userStatus?: string; // "나의 상태" 개인화
}

// 제안된 빠른 응답
export interface QuickReply {
  id: string;
  text: string;
  category: 'recipe' | 'cooking' | 'general';
  icon?: string;
}

// 기본 빠른 응답들
export const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'recipe_search',
    text: '레시피 추천해줘',
    category: 'recipe',
    icon: '🍳'
  },
  {
    id: 'cooking_help',
    text: '요리 팁 알려줘',
    category: 'cooking',
    icon: '💡'
  },
  {
    id: 'quick_recipe',
    text: '30분 요리',
    category: 'recipe',
    icon: '⏰'
  },
  {
    id: 'ingredient_tips',
    text: '재료 손질법',
    category: 'cooking',
    icon: '🥕'
  },
  {
    id: 'general_help',
    text: '도움말',
    category: 'general',
    icon: '❓'
  }
];

// 채팅 에러 타입
export interface ChatError {
  code: string;
  message: string;
  timestamp: Date;
  retry?: boolean;
}

// WebSocket 연결 상태
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

// 채팅 이벤트 타입
export interface ChatEvents {
  onMessageSent: (message: ChatMessage) => void;
  onMessageReceived: (message: ChatMessage) => void;
  onConnectionStatusChanged: (status: ConnectionStatus) => void;
  onError: (error: ChatError) => void;
  onStreamingStart: () => void;
  onStreamingEnd: () => void;
}