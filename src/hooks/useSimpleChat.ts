import { useEffect, useCallback, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { webSocketService } from '@/services/websocket.service';
import { 
  chatMessagesState, 
  streamingMessageState, 
  connectionStatusState,
  userAllergiesState,
  cookingLevelState
} from '@/store/chatStore';
import { ChatMessage, ConversationChunk, ConversationResponse, ReactChunk, ReactStep } from '@/types/websocket.types';

export const useSimpleChat = () => {
  const [messages, setMessages] = useRecoilState(chatMessagesState);
  const [streamingMessage, setStreamingMessage] = useRecoilState(streamingMessageState);
  const setConnectionStatus = useSetRecoilState(connectionStatusState);
  const userAllergies = useRecoilValue(userAllergiesState);
  const cookingLevel = useRecoilValue(cookingLevelState);
  
  // ReAct 관련 상태
  const [currentReactMessage, setCurrentReactMessage] = useState<ChatMessage & {reactSteps?: ReactStep[]; isReactComplete?: boolean} | null>(null);
  const reactMessageRef = useRef<ChatMessage & {reactSteps?: ReactStep[]; isReactComplete?: boolean} | null>(null);

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
      } else if (chunk.type === 'intent_analysis') {
        console.log('🎯 의도 분석 완료:', chunk.intent, '신뢰도:', chunk.confidence);
        setStreamingMessage(`의도 파악: ${chunk.intent} (${chunk.confidence ? Math.round(chunk.confidence * 100) : 0}%)`);
      } else if (chunk.type === 'thought') {
        console.log('🤔 AI 사고 과정:', chunk.content);
        setStreamingMessage(prev => prev + `\n💭 ${chunk.content}`);
      } else if (chunk.type === 'action') {
        console.log('⚡ AI 도구 사용:', chunk.toolName);
        setStreamingMessage(prev => prev + `\n🔧 ${chunk.content}`);
      } else if (chunk.type === 'observation') {
        console.log('👀 도구 실행 결과:', chunk.content?.substring(0, 100));
        // observation은 너무 길 수 있으므로 표시하지 않음
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
      } else if (chunk.type === 'final_answer' || (chunk.type === 'content' && chunk.isComplete) || chunk.type === 'complete') {
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

    // ReAct 청크 리스너
    webSocketService.onReactChunk((chunk: ReactChunk) => {
      console.log('🧠 ReAct 청크 수신:', chunk.type);
      
      switch (chunk.type) {
        case 'react_start':
          // 새로운 ReAct 메시지 시작
          const newReactMessage = {
            id: `react-${Date.now()}`,
            type: 'ai' as const,
            text: '',
            timestamp: new Date().toISOString(),
            reactSteps: [],
            isReactComplete: false,
            isStreaming: true,
          };
          
          reactMessageRef.current = newReactMessage;
          setCurrentReactMessage(newReactMessage);
          setStreamingMessage('🧠 AI가 단계별로 분석 중...');
          break;

        case 'thought':
        case 'action':
        case 'observation':
          // ReAct 단계 추가
          if (reactMessageRef.current) {
            const step: ReactStep = {
              type: chunk.type,
              content: chunk.content,
              timestamp: chunk.timestamp,
              stepNumber: (reactMessageRef.current.reactSteps?.length || 0) + 1,
            };

            const updatedMessage = {
              ...reactMessageRef.current,
              reactSteps: [...(reactMessageRef.current.reactSteps || []), step],
            };
            
            reactMessageRef.current = updatedMessage;
            setCurrentReactMessage({ ...updatedMessage });
          }
          break;

        case 'final_answer':
          // ReAct 최종 답변
          if (reactMessageRef.current) {
            const finalMessage = {
              ...reactMessageRef.current,
              text: chunk.content,
              isReactComplete: true,
              isStreaming: false,
              metadata: chunk.metadata,
            };

            // 메시지 목록에 추가
            setMessages(prev => [...prev, finalMessage]);
            
            // ReAct 상태 초기화
            setCurrentReactMessage(null);
            setStreamingMessage('');
            reactMessageRef.current = null;
          }
          break;

        case 'error':
          console.error('ReAct 오류:', chunk.content);
          setStreamingMessage('');
          setCurrentReactMessage(null);
          reactMessageRef.current = null;
          break;
      }
    });

    // 에러 리스너
    webSocketService.onError((error) => {
      // WebSocket error
      setStreamingMessage('');
      setCurrentReactMessage(null);
      reactMessageRef.current = null;
    });

    return () => {
      webSocketService.removeAllListeners();
      webSocketService.disconnect();
    };
  }, [setConnectionStatus, setMessages, setStreamingMessage]);

  // 메시지 전송 (일반/ReAct 모드 통합)
  const sendMessage = useCallback(async (text: string, isReactMode: boolean = false) => {
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
      mode: isReactMode ? 'ReAct' : 'Normal',
      connected: webSocketService.isConnected(),
      contextSize: recentMessages.length,
      timestamp: new Date().toISOString()
    });
    
    // 모드에 따른 WebSocket 메시지 전송
    if (isReactMode) {
      webSocketService.sendReactMessage(text.trim(), undefined, context);
    } else {
      webSocketService.sendMessage(text.trim(), undefined, context);
    }
  }, [setMessages, messages, userAllergies, cookingLevel]);

  // 채팅 히스토리 클리어
  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
    setCurrentReactMessage(null);
    reactMessageRef.current = null;
  }, [setMessages, setStreamingMessage]);

  // 현재 표시할 모든 메시지 (일반 메시지 + 현재 스트리밍 중인 ReAct 메시지)
  const allMessages = currentReactMessage ? [...messages, currentReactMessage] : messages;

  return {
    messages: allMessages,
    streamingMessage,
    sendMessage,
    clearChat,
    isStreaming: streamingMessage.length > 0 || currentReactMessage !== null,
  };
};