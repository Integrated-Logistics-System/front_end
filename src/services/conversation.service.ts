import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// 타입 정의
export interface ConversationMessage {
  message: string;
  sessionId?: string;
}

export interface ConversationResponse {
  content: string;
  sessionId: string;
  metadata: {
    intent: 'search' | 'detail' | 'substitute' | 'help' | 'chat';
    stage: 'greeting' | 'exploring' | 'focused' | 'cooking' | 'clarifying';
    tone: 'friendly' | 'informative' | 'encouraging' | 'helpful';
    actionRequired: 'none' | 'recipe_selection' | 'ingredient_check' | 'cooking_start';
    processingTime: number;
    userId: string;
    model: string;
    personalizationUsed: false;
  };
  suggestedFollowups?: string[];
  recipeData?: RecipeReference[];
  timestamp: string;
}

export interface RecipeReference {
  id: string;
  title: string;
  titleKo: string;
  shortDescription: string;
  position: number;
  mentioned: boolean;
}

export interface ConversationHistory {
  conversations: ChatMessage[];
  userContext: {
    userPreferences: {
      allergies: string[];
      favoriteIngredients: string[];
      cookingStyle: string[];
    };
    recipeHistory: {
      requested: string[];
      generated: string[];
      bookmarked: string[];
    };
  };
  metadata: {
    totalMessages: number;
    userId: string;
    systemType: string;
  };
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: number;
  type: 'recipe_query' | 'general_chat' | 'detail_request';
  metadata?: {
    allergies?: string[];
    recipeId?: string;
    hasRecipe?: boolean;
    processingTime?: number;
    sessionId?: string;
    intent?: string;
    stage?: string;
  };
}

export interface SessionInfo {
  sessionId: string;
  currentStage: string;
  currentRecipes: RecipeReference[];
  selectedRecipe?: RecipeReference;
  contextLength: number;
  lastActivity: number;
  timestamp: string;
}

class ConversationService {
  // ================== 메인 대화 ==================
  
  /**
   * ChatGPT 스타일 대화
   */
  async sendMessage(messageData: ConversationMessage): Promise<ConversationResponse> {
    const response = await apiClient.post('/chat', messageData);
    return response;
  }

  /**
   * 스트리밍 대화 (EventSource 사용)
   */
  createStreamingChat(
    messageData: ConversationMessage,
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onComplete?: () => void
  ): EventSource {
    // 요청 데이터를 URL 파라미터로 인코딩
    const params = new URLSearchParams({
      message: messageData.message,
      ...(messageData.sessionId && { sessionId: messageData.sessionId }),
    });

    const url = `/chat/stream?${params.toString()}`;
    const eventSource = new EventSource(url, {
      withCredentials: true, // JWT 토큰 포함
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
        
        if (data.isComplete) {
          eventSource.close();
          onComplete?.();
        }
      } catch (error) {
        console.error('Failed to parse streaming data:', error);
        onError?.(event);
      }
    };

    eventSource.onerror = (event) => {
      console.error('Streaming error:', event);
      eventSource.close();
      onError?.(event);
    };

    return eventSource;
  }

  // ================== 대화 관리 ==================

  /**
   * 대화 히스토리 조회
   */
  async getConversationHistory(): Promise<ConversationHistory> {
    const response = await apiClient.get(API_ENDPOINTS.CONVERSATION.HISTORY);
    console.log('📚 conversationService: response before return:', response);
    return response;
  }

  /**
   * 세션 정보 조회
   */
  async getSessionInfo(): Promise<SessionInfo> {
    const response = await apiClient.get('/chat/session');
    return response;
  }

  /**
   * 세션 종료
   */
  async endSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete('/chat/session', {
      data: { sessionId }
    });
    return response;
  }

  /**
   * 전체 대화 히스토리 삭제 (모든 캐시 포함)
   */
  async clearAllHistory(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(API_ENDPOINTS.CONVERSATION.HISTORY);
    return response;
  }

  /**
   * 시스템 상태 확인
   */
  async getSystemStatus(): Promise<{
    status: string;
    system: string;
    version: string;
    features: Record<string, boolean>;
    statistics: Record<string, any>;
  }> {
    const response = await apiClient.get('/chat/status');
    return response;
  }

  // ================== 유틸리티 ==================

  /**
   * 세션 ID 생성
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 대화 톤 이모지 매핑
   */
  getToneEmoji(tone: ConversationResponse['metadata']['tone']): string {
    const toneEmojis = {
      friendly: '😊',
      informative: '📚',
      encouraging: '💪',
      helpful: '🤝',
    };
    return toneEmojis[tone] || '🤖';
  }

  /**
   * 의도별 아이콘 매핑
   */
  getIntentIcon(intent: ConversationResponse['metadata']['intent']): string {
    const intentIcons = {
      search: '🔍',
      detail: '📖',
      substitute: '🔄',
      help: '💡',
      chat: '💬',
    };
    return intentIcons[intent] || '💭';
  }

  /**
   * 단계별 진행 표시
   */
  getStageProgress(stage: ConversationResponse['metadata']['stage']): {
    step: number;
    total: number;
    label: string;
  } {
    const stageMap = {
      greeting: { step: 1, total: 5, label: '인사' },
      exploring: { step: 2, total: 5, label: '레시피 탐색' },
      focused: { step: 3, total: 5, label: '레시피 선택' },
      cooking: { step: 4, total: 5, label: '요리 진행' },
      clarifying: { step: 5, total: 5, label: '세부 사항' },
    };
    return stageMap[stage] || { step: 1, total: 5, label: '시작' };
  }
}

export const conversationService = new ConversationService();