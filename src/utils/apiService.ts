import { AIResponse, ChatMessage, Market } from '@/types';
import { MarketModel } from '@/src/models/MarketModel';

// 실제 API 요청 구현
export const apiService = {
  // 채팅 메시지 전송 및 응답 받기
  async postChat(
    message: string,
    context: {
      selectedMarket: MarketModel | null;
      userSelectedPoint: { lat: number; lng: number } | null;
      previousMessages: ChatMessage[];
    }
  ): Promise<AIResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {
            selectedMarket: context.selectedMarket?.toJSON(),
            userSelectedPoint: context.userSelectedPoint,
            previousMessages: context.previousMessages,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '채팅 요청에 실패했습니다.');
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (error) {
      console.error('API 오류:', error);
      throw error;
    }
  },

  // 마켓 데이터 가져오기
  async fetchMarkets(): Promise<Market[]> {
    try {
      const response = await fetch('/api/markets');
      
      if (!response.ok) {
        throw new Error('마켓 데이터를 가져오는데 실패했습니다.');
      }
      
      const markets: Market[] = await response.json();
      return markets;
    } catch (error) {
      console.error('마켓 데이터 로딩 오류:', error);
      throw error;
    }
  },
};
