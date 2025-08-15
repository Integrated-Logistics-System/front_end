import { useEffect, useCallback } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { webSocketService } from '@/services/websocket.service';
import { 
  chatMessagesState, 
  streamingMessageState, 
  connectionStatusState,
  userAllergiesState,
  cookingLevelState
} from '@/store/chatStore';
import { ChatMessage, ConversationChunk, ConversationResponse } from '@/types/websocket.types';

export const useSimpleChat = () => {
  const [messages, setMessages] = useRecoilState(chatMessagesState);
  const [streamingMessage, setStreamingMessage] = useRecoilState(streamingMessageState);
  const setConnectionStatus = useSetRecoilState(connectionStatusState);
  const userAllergies = useRecoilValue(userAllergiesState);
  const cookingLevel = useRecoilValue(cookingLevelState);

  // WebSocket 연결 초기화
  useEffect(() => {
    webSocketService.connect();

    // 연결 상태 리스너
    webSocketService.onConnectionStatus((status) => {
      setConnectionStatus({
        connected: status.connected,
        clientId: status.clientId,
      });
    });

    // 스트리밍 청크 리스너
    webSocketService.onConversationChunk((chunk: ConversationChunk) => {
      console.log('📥 청크 수신:', {
        type: chunk.type,
        content: chunk.content?.substring(0, 50) + '...',
        connected: webSocketService.isConnected(),
        timestamp: new Date().toISOString()
      });
      
      if (chunk.type === 'typing') {
        console.log('⌨️ AI 타이핑 시작');
        setStreamingMessage('AI가 입력 중...');
      } else if (chunk.type === 'token' && chunk.content) {
        console.log('🔤 토큰 추가:', chunk.content);
        setStreamingMessage(prev => {
          const newMessage = prev + chunk.content;
          console.log('📝 스트리밍 메시지 업데이트:', newMessage.length + '글자');
          return newMessage;
        });
        
        // 토큰 수신 중 연결 상태 주기적 확인
        if (!webSocketService.isConnected()) {
          console.warn('⚠️ 토큰 수신 중 연결 끊김 감지');
        }
      } else if ((chunk.type === 'content' && chunk.isComplete) || chunk.type === 'complete') {
        // 스트리밍 완료 - AI 메시지 추가
        // Streaming completed successfully
        
        // 완료 시점에 받은 전체 내용 사용 (chunk.content가 있으면 우선 사용)
        const finalContent = chunk.content || streamingMessage;
        // Final content and metadata processed
        
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          text: finalContent || '레시피를 찾았습니다!', // 완료 시점의 전체 내용 사용
          timestamp: new Date().toISOString(),
          recipes: chunk.metadata?.recipes || chunk.metadata?.recipeData || [],
          recipeDetail: chunk.metadata?.recipeDetail,
          metadata: chunk.metadata,
        };
        
        // Created AI message
        
        // 메시지 추가와 스트리밍 메시지 초기화를 분리
        setMessages(prev => [...prev, aiMessage]);
        setStreamingMessage('');
      } else if (chunk.type === 'error') {
        // Chat error occurred
        setStreamingMessage('');
      }
    });

    // 일반 응답 리스너 (혹시 사용되는 경우)
    webSocketService.onConversationResponse((response: ConversationResponse) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        text: response.content,
        timestamp: response.timestamp,
        recipes: response.recipes || [],
        recipeDetail: response.recipeDetail,
        metadata: response.metadata,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    });

    // 에러 리스너
    webSocketService.onError((error) => {
      // WebSocket error
      setStreamingMessage('');
    });

    return () => {
      webSocketService.removeAllListeners();
      webSocketService.disconnect();
    };
  }, [setConnectionStatus, setMessages, setStreamingMessage]);

  // 메시지 전송
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // 연결 상태 확인
    if (!webSocketService.isConnected()) {
      // WebSocket not connected, attempting to reconnect
      webSocketService.connect();
      
      // 잠시 대기 후 연결 상태 재확인
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!webSocketService.isConnected()) {
        // Failed to establish WebSocket connection
        return;
      }
    }

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'human',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // 이전 대화 기록 준비 (최근 10개 메시지)
    const recentMessages = messages.slice(-10).map(msg => ({
      type: msg.type,
      text: msg.text,
      timestamp: msg.timestamp
    }));

    // 컨텍스트 정보 준비
    const context = {
      history: recentMessages,
      allergies: userAllergies,
      cookingLevel: cookingLevel
    };

    console.log('📤 메시지 전송:', {
      message: text.trim(),
      connected: webSocketService.isConnected(),
      contextSize: recentMessages.length,
      timestamp: new Date().toISOString()
    });
    
    // WebSocket으로 메시지 전송 (컨텍스트 포함)
    webSocketService.sendMessage(text.trim(), undefined, context);
  }, [setMessages, messages, userAllergies, cookingLevel]);

  // 채팅 히스토리 클리어
  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
  }, [setMessages, setStreamingMessage]);

  return {
    messages,
    streamingMessage,
    sendMessage,
    clearChat,
    isStreaming: streamingMessage.length > 0,
  };
};