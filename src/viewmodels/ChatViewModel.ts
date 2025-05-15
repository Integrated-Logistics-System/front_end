import { create } from 'zustand';
import { ChatMessage, RecommendationPoint, AIResponse } from '@/types';
import { ChatMessageModel, ChatConversationModel, RecommendationModel } from '@/src/models/ChatModel';
import { MarketModel } from '@/src/models/MarketModel';
import { useMapViewModel } from './MapViewModel';

// API 요청 함수 타입
interface ApiService {
  postChat: (
    message: string, 
    context: { 
      selectedMarket: MarketModel | null, 
      userSelectedPoint: { lat: number; lng: number } | null,
      previousMessages: ChatMessage[] 
    }
  ) => Promise<AIResponse>;
}

// 채팅 관련 상태와 로직을 관리하는 ViewModel
interface ChatState {
  // 모델
  conversation: ChatConversationModel;
  
  // UI 상태
  inputText: string;
  isLoading: boolean;
  error: string | null;
  
  // API 서비스
  apiService: ApiService | null;
  
  // 액션 메서드들
  setApiService: (service: ApiService) => void;
  setInputText: (text: string) => void;
  sendMessage: () => Promise<void>;
  clearError: () => void;
  clearChat: () => void;
  getMessages: () => ChatMessageModel[];
  getRecommendations: () => RecommendationModel[];
}

// Zustand 스토어 생성
export const useChatViewModel = create<ChatState>((set: any, get: any) => ({
  // 초기 상태
  conversation: new ChatConversationModel(),
  inputText: '',
  isLoading: false,
  error: null,
  apiService: null,
  
  // 액션 메서드 구현
  setApiService: (service: ApiService) => {
    set({ apiService: service });
  },
  
  setInputText: (text: string) => {
    set({ inputText: text });
  },
  
  sendMessage: async () => {
    const { conversation, inputText, apiService } = get();
    
    // 입력이 비어있거나 API 서비스가 없는 경우
    if (!inputText.trim() || !apiService) {
      return;
    }
    
    try {
      set({ isLoading: true });
      
      // 사용자 메시지 생성
      const userMessage: ChatMessage = {
        role: 'user',
        text: inputText
      };
      
      // 대화에 추가
      conversation.addMessage(userMessage);
      
      // 입력창 비우기
      set({ inputText: '' });
      
      // 맵 뷰모델에서 선택된 마켓과 위치 정보 가져오기
      const selectedMarket = useMapViewModel.getState().getSelectedMarket();
      const userSelectedPoint = useMapViewModel.getState().userSelectedPoint;
      
      // API 호출 컨텍스트 생성
      const context = {
        selectedMarket,
        userSelectedPoint,
        previousMessages: conversation.getAllMessages().map((msg: ChatMessageModel) => msg.toJSON())
      };
      
      // API 호출
      const response = await apiService.postChat(userMessage.text, context);
      
      // AI 응답 추가
      const aiMessage: ChatMessage = {
        role: 'assistant',
        text: response.text
      };
      conversation.addMessage(aiMessage);
      
      // 추천 지점이 있다면 추가
      if (response.recommendations && response.recommendations.length > 0) {
        conversation.addRecommendations(response.recommendations);
        useMapViewModel.getState().addRecommendations(response.recommendations);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다' 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  clearChat: () => {
    set({ conversation: new ChatConversationModel() });
  },
  
  getMessages: () => {
    return get().conversation.getAllMessages();
  },
  
  getRecommendations: () => {
    return get().conversation.getAllRecommendations();
  }
}));
