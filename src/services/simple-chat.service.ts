/**
 * 🤖 Simple Chat Service
 * 새로운 간단한 LangChain + RAG + Agent 백엔드와 연동
 */

import { apiClient } from '@/lib/api';

export interface SimpleChatRequest {
  message: string;
  userId?: string;
  sessionId?: string;
}

export interface SimpleChatResponse {
  success: boolean;
  message: string;
  recipes?: any[];
  suggestions?: string[];
  metadata: {
    processingTime: number;
    toolsUsed: string[];
    confidence: number;
    timestamp: string;
  };
}

export interface SearchResponse {
  success: boolean;
  context: string;
  recipes: any[];
  metadata: {
    searchTime: number;
    relevanceScore: number;
    totalTime: number;
    timestamp: string;
  };
}

export interface StatusResponse {
  success: boolean;
  system: {
    agent: {
      isReady: boolean;
      toolCount: number;
      modelName: string;
    };
    timestamp: string;
    uptime: number;
    memoryUsage: any;
  };
  features: {
    langchain: boolean;
    rag: boolean;
    elasticsearch: boolean;
    agent: boolean;
  };
}

export interface SuggestionsResponse {
  success: boolean;
  originalQuery: string;
  extractedKeywords: string[];
  suggestions: string[];
  relatedRecipes?: Array<{
    title: string;
    cookingTime: string;
  }>;
}

export interface KeywordsResponse {
  success: boolean;
  originalQuery: string;
  extractedKeywords: string[];
  keywordCount: number;
}

export class SimpleChatService {
  /**
   * 💬 메인 채팅 메시지 전송
   */
  async sendMessage(request: SimpleChatRequest): Promise<SimpleChatResponse> {
    try {
      const response = await apiClient.postLongRunning('/api/chat', request);
      return response;
    } catch (error) {
      console.error('Chat message failed:', error);
      throw new Error('채팅 메시지 전송에 실패했습니다.');
    }
  }

  /**
   * 🔍 직접 레시피 검색 (개발/테스트용)
   */
  async searchRecipes(query: string, maxResults?: number): Promise<SearchResponse> {
    try {
      const response = await apiClient.postLongRunning('/api/chat/search', {
        query,
        maxResults: maxResults || 5
      });
      return response;
    } catch (error) {
      console.error('Recipe search failed:', error);
      throw new Error('레시피 검색에 실패했습니다.');
    }
  }

  /**
   * 📊 시스템 상태 확인
   */
  async getStatus(): Promise<StatusResponse> {
    try {
      const response = await apiClient.get('/api/chat/status');
      return response;
    } catch (error) {
      console.error('Status check failed:', error);
      throw new Error('시스템 상태 확인에 실패했습니다.');
    }
  }

  /**
   * 💡 검색 제안 생성
   */
  async getSuggestions(query: string): Promise<SuggestionsResponse> {
    try {
      const response = await apiClient.post('/api/chat/suggestions', { query });
      return response;
    } catch (error) {
      console.error('Suggestions failed:', error);
      throw new Error('검색 제안 생성에 실패했습니다.');
    }
  }

  /**
   * 🎯 키워드 추출
   */
  async extractKeywords(query: string): Promise<KeywordsResponse> {
    try {
      const response = await apiClient.post('/api/chat/keywords', { query });
      return response;
    } catch (error) {
      console.error('Keyword extraction failed:', error);
      throw new Error('키워드 추출에 실패했습니다.');
    }
  }

  /**
   * 🧪 시스템 테스트 (개발용)
   */
  async testSystem(): Promise<{ status: string; details: any }> {
    try {
      const status = await this.getStatus();
      const testChat = await this.sendMessage({
        message: "시스템 테스트",
        sessionId: `test_${Date.now()}`
      });

      return {
        status: 'healthy',
        details: {
          systemStatus: status,
          chatTest: testChat,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const simpleChatService = new SimpleChatService();

// 기본 내보내기
export default simpleChatService;