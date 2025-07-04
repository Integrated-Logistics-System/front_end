import { atom } from 'recoil';

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'ai';
  isStreaming?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  connectionError: string | null;
  currentRoomId: string | null;
}

// Chat State
export const chatState = atom<ChatState>({
  key: 'chatState',
  default: {
    messages: [],
    isConnected: false,
    isTyping: false,
    connectionError: null,
    currentRoomId: null,
  },
});

// WebSocket Connection State
// Removed wsConnectionState as it's no longer needed
// WebSocket connection is now managed by useSocket hook
