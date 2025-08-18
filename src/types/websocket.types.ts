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
  type: 'typing' | 'token' | 'content' | 'error' | 'complete' | 'intent_analysis' | 'thought' | 'action' | 'observation' | 'final_answer';
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
    reasoning?: string;
    recipeKeywords?: string[];
    specificRecipe?: string;
  };
  timestamp?: number;
  // 의도 분석 관련 필드들
  intent?: string;
  confidence?: number;
  reasoning?: string;
  // ReAct 관련 필드들
  toolName?: string;
  toolInput?: string;
  iteration?: number;
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

// ReAct 관련 타입들
export interface ReactChunk {
  type: 'react_start' | 'thought' | 'action' | 'observation' | 'final_answer' | 'error';
  content: string;
  metadata?: {
    processingTime?: number;
    stepsCount?: number;
    toolsUsed?: string[];
  };
  timestamp: number;
}

export interface ReactMessage extends ChatMessage {
  reactSteps?: ReactStep[];
  isReactComplete?: boolean;
}

export interface ReactStep {
  type: 'thought' | 'action' | 'observation';
  content: string;
  timestamp: number;
  stepNumber?: number;
}