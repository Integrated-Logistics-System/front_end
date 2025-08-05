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
    query: string,
    userAllergies?: string[],
    maxResults?: number
  ): Promise<LangChainResponse> {
    const response = await apiClient.postLongRunning('/langchain/search', {
      query,
      userAllergies,
      maxResults
    });
    return response.data;
  },

  // 채팅 기반 대화
  async processChat(
    message: string
  ): Promise<any> {
    const response = await apiClient.postLongRunning('/langchain/chat', {
      message
    });
    return response.data;
  },

  // 채팅 기록 조회
  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await apiClient.get('/langchain/chat-history');
    return response.data.messages || [];
  },

  // 채팅 기록 삭제
  async clearChatHistory(): Promise<boolean> {
    const response = await apiClient.delete('/langchain/chat-history');
    return response.success;
  },

  // RAG 쿼리 처리 (긴 타임아웃)
  async processRagQuery(query: string): Promise<any> {
    const response = await apiClient.postLongRunning('/rag/query', { query });
    return response.data;
  },
};
