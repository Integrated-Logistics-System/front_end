import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback } from 'react';
import { chatState, ChatMessage } from '@/store/chatStore';
import { userTokenSelector, userIdSelector, isAuthenticatedSelector } from '@/store/authStore';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';

export function useChatViewModel() {
  const [chatStateValue, setChatState] = useRecoilState(chatState);
  const token = useRecoilValue(userTokenSelector);
  const userId = useRecoilValue(userIdSelector);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  // 디버그: 토큰 상태 확인
  console.log('🔍 ChatViewModel Debug:', { token, userId, isAuthenticated });

  // Use the WebSocket chat hook
  const {
    messages: hookMessages,
    isConnected,
    isTyping: hookIsTyping,
    connectionError,
    sendMessage: hookSendMessage,
    clearHistory: hookClearMessages,
    reconnect: hookReconnect,
  } = useWebSocketChat({
    userId: userId || undefined,
    token: token || undefined,
  });

  // Sync hook messages with Recoil state
  const syncedMessages = hookMessages.length > 0 ? hookMessages : chatStateValue.messages;

  // Wrapper functions to maintain API compatibility
  const sendMessage = useCallback((message: string) => {
    hookSendMessage(message);
    // 메시지 전송 후 항상 isTyping 상태 업데이트
    setChatState(prev => ({
      ...prev,
      isTyping: true,
    }));
  }, [hookSendMessage, setChatState]);

  const clearMessages = useCallback(() => {
    hookClearMessages();
    setChatState(prev => ({
      ...prev,
      messages: [],
      isTyping: false,
    }));
  }, [hookClearMessages, setChatState]);

  const clearError = useCallback(() => {
    // The new implementation doesn't need explicit error clearing
    // as errors are managed by the useSocket hook
  }, []);

  const joinChat = useCallback((chatId: string) => {
    setChatState(prev => ({
      ...prev,
      currentRoomId: chatId,
    }));
    // TODO: Implement room joining in the new architecture if needed
  }, [setChatState]);

  const leaveChat = useCallback((chatId: string) => {
    setChatState(prev => ({
      ...prev,
      currentRoomId: null,
    }));
    // TODO: Implement room leaving in the new architecture if needed
  }, [setChatState]);

  return {
    // State
    messages: syncedMessages,
    isConnected,
    isTyping: hookIsTyping || chatStateValue.isTyping,
    connectionError,
    currentRoomId: chatStateValue.currentRoomId,
    
    // Actions
    sendMessage,
    clearMessages,
    clearError,
    reconnect: hookReconnect,
    connect: hookReconnect, // 연결과 재연결은 동일
    joinChat,
    leaveChat,
  };
}
