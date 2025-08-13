export interface ConnectionStatus {
  connected: boolean;
  clientId?: string;
  timestamp: number;
}

export interface ChatMessage {
  id?: string;
  type: 'human' | 'ai';
  text: string;
  streaming?: boolean;
  metadata?: Record<string, any>;
  recipes?: any[];
  recipeDetail?: any;
  timestamp: string;
}

export interface ConversationChunk {
  type: 'typing' | 'token' | 'content' | 'error';
  content?: string;
  isComplete?: boolean;
  sessionId?: string;
  metadata?: {
    intent?: string;
    conversationType?: string;
    tone?: string;
    confidence?: number;
    processingTime?: number;
    recipes?: any[];
    recipeData?: any[];
    recipeDetail?: any;
  };
  timestamp?: number;
}

export interface ConversationResponse {
  content: string;
  sessionId: string;
  metadata: {
    intent: string;
    conversationType: string;
    tone: string;
    confidence: number;
    processingTime: number;
    userId: string;
    model: string;
    personalizationUsed: boolean;
  };
  recipes: any[];
  recipeData: any[];
  recipeDetail: any;
  timestamp: string;
}

export interface ConversationHistory {
    conversations: any[];
    userContext: any;
    metadata: any;
    timestamp: string;
}

export interface SocketError {
  message: string;
  error?: string;
  timestamp?: number;
}