import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface LangChainResponse {
  response: string;
  userId?: string;
  timestamp: Date;
  sources?: string[];
  relevantRecipes?: any[];
  confidence?: number;
}

export const langchainService = {
  // LangChain 기반 스마트 검색 (긴 타임아웃)
  async searchWithLangchain(
    message: string, 
    userId?: string
  ): Promise<LangChainResponse> {
    const response = await apiClient.postLongRunning(API_ENDPOINTS.LANGCHAIN.SEARCH, {
      message,
      userId
    });
    return response.data;
  },

  // 채팅 기록 조회
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.LANGCHAIN.CHAT_HISTORY}/${userId}`);
    return response.data;
  },

  // 채팅 기록 삭제
  async clearChatHistory(userId: string): Promise<boolean> {
    const response = await apiClient.delete(`${API_ENDPOINTS.LANGCHAIN.CHAT_HISTORY}/${userId}`);
    return response.success;
  },

  // RAG 쿼리 처리 (긴 타임아웃)
  async processRagQuery(query: string): Promise<any> {
    const response = await apiClient.postLongRunning('/rag/query', { query });
    return response.data;
  },
};
