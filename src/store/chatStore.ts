import { atom } from 'recoil';
import { ChatMessage } from '@/types/websocket.types';

// 채팅 메시지 상태
export const chatMessagesState = atom<ChatMessage[]>({
  key: 'chatMessages',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      // 초기화 시 로컬 스토리지에서 불러오기
      if (typeof window !== 'undefined') {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
          try {
            setSelf(JSON.parse(savedMessages));
          } catch (e) {
            // Failed to parse saved chat messages
          }
        }
      }

      // 상태 변경 시 로컬 스토리지에 저장
      onSet((newValue, _, isReset) => {
        if (typeof window !== 'undefined') {
          if (isReset) {
            localStorage.removeItem('chatMessages');
          } else {
            localStorage.setItem('chatMessages', JSON.stringify(newValue));
          }
        }
      });
    },
  ],
});

// 현재 스트리밍 메시지 상태
export const streamingMessageState = atom<string>({
  key: 'streamingMessage',
  default: '',
});

// 연결 상태
export const connectionStatusState = atom<{
  connected: boolean;
  clientId?: string;
}>({
  key: 'connectionStatus',
  default: {
    connected: false,
  },
});

// 사용자 알레르기 정보 (로컬 스토리지)
export const userAllergiesState = atom<string[]>({
  key: 'userAllergies',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== 'undefined') {
        const savedAllergies = localStorage.getItem('userAllergies');
        if (savedAllergies) {
          try {
            setSelf(JSON.parse(savedAllergies));
          } catch (e) {
            // Failed to parse saved allergies
          }
        }
      }

      onSet((newValue, _, isReset) => {
        if (typeof window !== 'undefined') {
          if (isReset) {
            localStorage.removeItem('userAllergies');
          } else {
            localStorage.setItem('userAllergies', JSON.stringify(newValue));
          }
        }
      });
    },
  ],
});

// 사용자 요리 레벨 (로컬 스토리지)
export const cookingLevelState = atom<string>({
  key: 'cookingLevel',
  default: '초급',
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== 'undefined') {
        const savedLevel = localStorage.getItem('cookingLevel');
        if (savedLevel) {
          setSelf(savedLevel);
        }
      }

      onSet((newValue, _, isReset) => {
        if (typeof window !== 'undefined') {
          if (isReset) {
            localStorage.removeItem('cookingLevel');
          } else {
            localStorage.setItem('cookingLevel', newValue);
          }
        }
      });
    },
  ],
});

