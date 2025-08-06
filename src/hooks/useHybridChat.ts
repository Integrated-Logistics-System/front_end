'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { conversationService, ConversationResponse, ChatMessage } from '@/services/conversation.service';

// 채팅 메시지 타입 (프론트엔드용) - 새로운 conversation workflow 지원
interface HybridChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    intent?: string;
    conversationType?: string; // 새로운 대화 유형: general_chat, recipe_list, recipe_detail
    tone?: string;
    confidence?: number; // 의도 분석 신뢰도
    processingTime?: number;
    suggestedFollowups?: string[];
    recipeData?: any[];
    recipeDetail?: any; // 백엔드 변환된 단일 레시피 상세 데이터
  };
  isStreaming?: boolean;
  sessionId?: string;
}

interface UseHybridChatProps {
  userId?: string;
  token?: string;
}

// Hook 상태 타입
interface HybridChatState {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  authenticatedUser: any;
  isTyping: boolean;
  messages: HybridChatMessage[];
  connectionError: string | null;
  isLoadingHistory: boolean;
  isStreaming: boolean;
  sessionId: string | null;
  currentStage: string;
  selectedRecipes: any[];
}

export function useHybridChat({ userId, token }: UseHybridChatProps) {
  // 상태 관리
  const [state, setState] = useState<HybridChatState>({
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    authenticatedUser: null,
    isTyping: false,
    messages: [],
    connectionError: null,
    isLoadingHistory: false,
    isStreaming: false,
    sessionId: null,
    currentStage: 'greeting',
    selectedRecipes: [],
  });

  // 참조
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageBufferRef = useRef<string>('');
  const historyLoadedRef = useRef<boolean>(false);
  const streamingBufferRef = useRef<string>('');

  // ================== WebSocket 연결 관리 ==================

  const connect = useCallback(() => {
    // 토큰 확인
    let authToken = token;
    if (!authToken && typeof window !== 'undefined') {
      authToken = localStorage.getItem('auth_token');
    }
    
    console.log('🔍 useHybridChat Debug:', { 
      userId, 
      tokenFromProps: token, 
      tokenFromLocalStorage: authToken,
      hasToken: !!authToken 
    });
    
    if (!authToken) {
      console.warn('No token provided for WebSocket connection');
      setState(prev => ({ ...prev, connectionError: 'No authentication token' }));
      return;
    }

    if (state.socket?.connected) {
      console.log('ℹ️ Already connected to WebSocket');
      return;
    }

    try {
      console.log('🔗 Connecting to WebSocket...');
      
      // WebSocket URL 및 옵션 결정
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083';
      
      console.log('🔗 WebSocket URL:', wsUrl);
      
      let socketOptions: any = {
        auth: { token: authToken },
        transports: ['websocket', 'polling'],
        timeout: 60000,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
      };
      
      // 프로덕션 환경 (Nginx 프록시 사용)에서는 상대 경로와 특별한 path 설정
      if (wsUrl.startsWith('/ws')) {
        socketOptions.path = '/socket.io/';
        // 현재 도메인 사용 (브라우저 기본값)
        var newSocket = io(socketOptions);
      } else {
        // 개발 환경에서는 직접 연결
        var newSocket = io(wsUrl, socketOptions);
      }

      // 연결 성공
      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setState(prev => ({
          ...prev,
          socket: newSocket,
          isConnected: true,
          connectionError: null,
        }));
      });

      // 연결 상태 수신
      newSocket.on('connection-status', (data) => {
        console.log('📡 Connection status:', data);
        
        // 임시: 연결만 되면 인증된 것으로 처리
        setState(prev => ({
          ...prev,
          isAuthenticated: true, // 임시: 항상 true
          authenticatedUser: data.user || { id: 'temp', email: 'temp@temp.com', name: 'Temp User' },
          sessionId: conversationService.generateSessionId(),
        }));
        
        // 히스토리 로드
        if (!historyLoadedRef.current) {
          loadConversationHistory();
        }
      });

      // ================== 새로운 대화형 이벤트 핸들러 ==================

      // 일반 대화 응답 - 새로운 conversation workflow 응답 구조 지원
      newSocket.on('conversation_response', (response: any) => {
        console.log('💬 New conversation response:', response);
        console.log('🔍 useHybridChat DEBUG - Recipe data mapping:', {
          'response.recipes': response.recipes,
          'response.recipeData': response.recipeData,
          'response.metadata': response.metadata,
          'conversationType': response.metadata?.conversationType,
          'recipeDataLength': response.recipes?.length || 0,
          'recipeDataContent': response.recipes?.slice(0, 2), // Show first 2 recipes for debugging
          'mappedToRecipeData': response.recipes || response.recipeData || []
        });
        
        const aiMessage: HybridChatMessage = {
          id: `ai_${Date.now()}`,
          content: response.content,
          isUser: false,
          timestamp: new Date(),
          sessionId: response.sessionId,
          metadata: {
            intent: response.metadata?.intent || response.metadata?.conversationType,
            conversationType: response.metadata?.conversationType,
            tone: response.metadata?.tone,
            confidence: response.metadata?.confidence,
            processingTime: response.metadata?.processingTime,
            suggestedFollowups: response.suggestedFollowups || [],
            recipeData: response.recipes || response.recipeData || [], // Map backend 'recipes' to frontend 'recipeData'
            recipeDetail: response.recipeDetail, // 백엔드 변환된 recipeDetail
          },
        };

        setState(prev => {
          // 중복 메시지 체크 (같은 ID나 유사한 content가 있는지 확인)
          const isDuplicate = prev.messages.some(msg => 
            msg.id === aiMessage.id || 
            (Math.abs(msg.timestamp.getTime() - aiMessage.timestamp.getTime()) < 1000 && 
             msg.content === aiMessage.content && !msg.isUser)
          );
          
          if (isDuplicate) {
            console.warn('⚠️ Duplicate AI message detected, skipping:', aiMessage.id);
            return prev;
          }

          return {
            ...prev,
            messages: [...prev.messages, aiMessage],
          sessionId: response.sessionId,
          currentStage: response.metadata?.stage || 'completed',
          selectedRecipes: response.recipes || response.recipeData || prev.selectedRecipes, // Map backend 'recipes' field
          isTyping: false,
          };
        });
      });

      // 스트리밍 청크
      newSocket.on('conversation_chunk', (chunk: any) => {
        console.log('🌊 Conversation chunk received:', chunk);
        
        switch (chunk.type) {
          case 'typing':
            setState(prev => ({ ...prev, isTyping: true, isStreaming: true }));
            break;
            
          case 'token': // 백엔드에서 'token' 타입으로 보낼 때
            streamingBufferRef.current += chunk.content;
            setState(prev => {
              let updatedMessages = [...prev.messages];
              let streamingMessageIndex = updatedMessages.findIndex(msg => msg.id === 'ai_streaming_placeholder');

              if (streamingMessageIndex === -1) {
                const newStreamingMessage: HybridChatMessage = {
                  id: 'ai_streaming_placeholder',
                  content: streamingBufferRef.current,
                  isUser: false,
                  timestamp: new Date(),
                  sessionId: chunk.sessionId || prev.sessionId,
                  isStreaming: true,
                };
                updatedMessages.push(newStreamingMessage);
              } else {
                updatedMessages[streamingMessageIndex] = {
                  ...updatedMessages[streamingMessageIndex],
                  content: streamingBufferRef.current,
                  isStreaming: true,
                };
              }

              return {
                ...prev,
                messages: updatedMessages,
                sessionId: chunk.sessionId || prev.sessionId,
                isTyping: true,
                isStreaming: true,
              };
            });
            break;

          case 'metadata': // 백엔드에서 'metadata' 타입으로 보낼 때
            setState(prev => ({
              ...prev,
              currentStage: chunk.metadata?.stage || prev.currentStage,
              sessionId: chunk.sessionId || prev.sessionId,
            }));
            break;
            
          case 'content': // 최종 완료 청크 (isComplete: true) 또는 이전 'content' 타입 처리
            if (chunk.isComplete) {
              const finalContent = streamingBufferRef.current; // 최종 내용을 미리 저장
              setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === 'ai_streaming_placeholder'
                    ? { 
                        ...msg, 
                        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 고유 ID 부여
                        isStreaming: false,
                        content: finalContent, // 미리 저장한 최종 내용 사용
                        metadata: {
                          ...msg.metadata,
                          ...chunk.metadata,
                          recipeData: chunk.metadata?.recipeData || chunk.metadata?.recipes || msg.metadata?.recipeData || [], // 레시피 데이터 매핑 (recipeData 우선)
                          recipeDetail: chunk.metadata?.recipeDetail || msg.metadata?.recipeDetail, // 백엔드 변환된 recipeDetail 매핑
                        }, // 최종 메타데이터 업데이트
                      } 
                    : msg
                ),
                isTyping: false, // 스트리밍 완료 시 타이핑 상태 해제
                isStreaming: false, // 스트리밍 완료 시 스트리밍 상태 해제
                currentStage: chunk.metadata?.stage || prev.currentStage, // 최종 단계 업데이트
                selectedRecipes: chunk.metadata?.recipes || chunk.metadata?.recipeData || prev.selectedRecipes, // 레시피 데이터 업데이트
              }));
              
              // setState 완료 후 버퍼 초기화
              setTimeout(() => {
                streamingBufferRef.current = '';
              }, 0);
            } else {
              // isComplete가 false인 content 청크는 token과 동일하게 처리 (혹시 모를 경우)
              streamingBufferRef.current += chunk.content;
              setState(prev => {
                let updatedMessages = [...prev.messages];
                let streamingMessageIndex = updatedMessages.findIndex(msg => msg.id === 'ai_streaming_placeholder');

                if (streamingMessageIndex === -1) {
                  const newStreamingMessage: HybridChatMessage = {
                    id: 'ai_streaming_placeholder',
                    content: streamingBufferRef.current,
                    isUser: false,
                    timestamp: new Date(),
                    sessionId: chunk.sessionId || prev.sessionId,
                    isStreaming: true,
                  };
                  updatedMessages.push(newStreamingMessage);
                } else {
                  updatedMessages[streamingMessageIndex] = {
                    ...updatedMessages[streamingMessageIndex],
                    content: streamingBufferRef.current,
                    isStreaming: true,
                  };
                }

                return {
                  ...prev,
                  messages: updatedMessages,
                  sessionId: chunk.sessionId || prev.sessionId,
                  isTyping: true,
                  isStreaming: true,
                };
              });
            }
            break;
            
          case 'error':
            setState(prev => ({
              ...prev,
              connectionError: chunk.content,
              isTyping: false,
              isStreaming: false,
            }));
            break;
        }
      });

      // 대화 히스토리 수신
      newSocket.on('conversation_history', (history: any) => {
        console.log('📚 Conversation history received:', history);
        
        // 이미 히스토리가 로드되었으면 무시
        if (historyLoadedRef.current) {
          console.log('⚠️ History already loaded, ignoring WebSocket history');
          return;
        }
        
        const messages: HybridChatMessage[] = (history?.conversations || []).flatMap(conv => [
          {
            id: `user_${conv.timestamp}`,
            content: conv.message,
            isUser: true,
            timestamp: new Date(conv.timestamp),
          },
          {
            id: `ai_${conv.timestamp}`,
            content: conv.response,
            isUser: false,
            timestamp: new Date(conv.timestamp),
            metadata: {
              intent: conv.metadata?.intent,
              processingTime: conv.metadata?.processingTime,
            },
          },
        ]);

        setState(prev => ({
          ...prev,
          messages,
          isLoadingHistory: false,
        }));
        
        historyLoadedRef.current = true;
        localStorage.setItem('chat_history_last_load', Date.now().toString());
      });

      // 에러 처리
      newSocket.on('conversation_error', (error: any) => {
        console.error('❌ Conversation error:', error);
        setState(prev => ({
          ...prev,
          connectionError: error.message,
          isTyping: false,
          isStreaming: false,
        }));
      });

      // 연결 해제
      newSocket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setState(prev => ({
          ...prev,
          isConnected: false,
          isAuthenticated: false,
        }));
      });

      // 에러 처리
      newSocket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setState(prev => ({
          ...prev,
          connectionError: error.message,
          isConnected: false,
        }));
      });

      setState(prev => ({ ...prev, socket: newSocket }));

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setState(prev => ({
        ...prev,
        connectionError: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, [userId, token, state.socket]);

  // ================== 메시지 전송 ==================

  const sendMessage = useCallback((content: string, useStreaming: boolean = false) => {
    if (!content.trim() || !state.socket || !state.isAuthenticated) {
      console.warn('Cannot send message: invalid state or not authenticated', { content, socket: state.socket, isAuthenticated: state.isAuthenticated });
      return;
    }

    // 사용자 메시지 추가
    const userMessage: HybridChatMessage = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      sessionId: state.sessionId || undefined,
    };

    setState(prev => {
      // 사용자 메시지 중복 체크
      const isDuplicate = prev.messages.some(msg => 
        msg.id === userMessage.id || 
        (Math.abs(msg.timestamp.getTime() - userMessage.timestamp.getTime()) < 1000 && 
         msg.content === userMessage.content && msg.isUser)
      );
      
      if (isDuplicate) {
        console.warn('⚠️ Duplicate user message detected, skipping:', userMessage.id);
        return prev;
      }

      return {
        ...prev,
        messages: [...prev.messages, userMessage],
      };
    });

    if (useStreaming) {
      console.log('🚀 Attempting to emit conversation_stream with:', { message: content.trim(), sessionId: state.sessionId });
      // 스트리밍 메시지용 AI 메시지 미리 추가 또는 업데이트
      setState(prev => {
        const existingStreamingMessageIndex = prev.messages.findIndex(msg => msg.id === 'ai_streaming_placeholder');
        let updatedMessages: HybridChatMessage[];

        if (existingStreamingMessageIndex !== -1) {
          // 기존 스트리밍 메시지 업데이트
          updatedMessages = prev.messages.map((msg, index) =>
            index === existingStreamingMessageIndex
              ? { ...msg, content: '', isStreaming: true }
              : msg
          );
        } else {
          // 새로운 스트리밍 메시지 추가
          const streamingMessage: HybridChatMessage = {
            id: 'ai_streaming_placeholder', // 고정된 ID
            content: '',
            isUser: false,
            timestamp: new Date(),
            sessionId: prev.sessionId || undefined,
            isStreaming: true,
          };
          updatedMessages = [...prev.messages, streamingMessage];
        }

        streamingBufferRef.current = ''; // 버퍼 초기화

        return {
          ...prev,
          messages: updatedMessages,
          isTyping: true,
          isStreaming: true,
        };
      });
      
      // 스트리밍 이벤트 전송
      state.socket.emit('conversation_stream', {
        message: content.trim(),
        sessionId: state.sessionId,
      });
    } else {
      setState(prev => ({ ...prev, isTyping: true }));
      console.log('🚀 Attempting to emit conversation_message with:', { message: content.trim(), sessionId: state.sessionId });
      // 일반 대화 이벤트 전송
      state.socket.emit('conversation_message', {
        message: content.trim(),
        sessionId: state.sessionId,
      });
    }
  }, [state.socket, state.isAuthenticated, state.sessionId]);

  // ================== 히스토리 관리 ==================

  const loadConversationHistory = useCallback(async () => {
    if (historyLoadedRef.current) {
      console.log('📚 History already loaded, skipping');
      return;
    }
    
    // 추가 안전장치: localStorage로 마지막 로드 시간 체크
    const lastLoadTime = localStorage.getItem('chat_history_last_load');
    const now = Date.now();
    if (lastLoadTime && (now - parseInt(lastLoadTime)) < 5000) {
      console.log('📚 History loaded recently, skipping to prevent duplication');
      historyLoadedRef.current = true;
      return;
    }
    
    setState(prev => ({ ...prev, isLoadingHistory: true }));
    
    try {
      // REST API로 히스토리 로드 (ChatGPT 방식)
      const history = await conversationService.getConversationHistory();
      console.log('📚 useHybridChat: history after service call:', history);
      
      const messages: HybridChatMessage[] = (history?.conversations || []).flatMap(conv => [
        {
          id: `user_${conv.timestamp}`,
          content: conv.message,
          isUser: true,
          timestamp: new Date(conv.timestamp),
        },
        {
          id: `ai_${conv.timestamp}`,
          content: conv.response,
          isUser: false,
          timestamp: new Date(conv.timestamp),
          metadata: {
            intent: conv.metadata?.intent,
            processingTime: conv.metadata?.processingTime,
          },
        },
      ]);

      setState(prev => ({
        ...prev,
        messages,
        isLoadingHistory: false,
      }));
      
      historyLoadedRef.current = true;
      localStorage.setItem('chat_history_last_load', Date.now().toString());
      console.log('📚 History loaded via REST API');
      
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      setState(prev => ({ ...prev, isLoadingHistory: false }));
      
      // REST 실패 시 WebSocket으로 폴백 (이미 로드되지 않은 경우에만)
      if (state.socket && state.isAuthenticated && !historyLoadedRef.current) {
        console.log('🔄 REST API failed, falling back to WebSocket history');
        state.socket.emit('conversation_get_history');
      }
    }
  }, [state.socket, state.isAuthenticated]);

  const clearHistory = useCallback(async () => {
    try {
      // 1. 백엔드 캐시 삭제 (새로운 통합 API 호출)
      await conversationService.clearAllHistory();
      
      // 2. 프론트엔드 상태 초기화
      setState(prev => ({
        ...prev,
        messages: [],
        selectedRecipes: [],
        currentStage: 'greeting',
      }));
      
      // 3. 히스토리 로드 플래그 초기화
      historyLoadedRef.current = false;
      
      console.log('💥 All conversation history cleared successfully');
      
    } catch (error) {
      console.error('Failed to clear conversation history:', error);
      
      // 에러 발생 시에도 프론트엔드 상태는 초기화
      setState(prev => ({
        ...prev,
        messages: [],
        selectedRecipes: [],
        currentStage: 'greeting',
      }));
      historyLoadedRef.current = false;
    }
  }, []);

  // ================== 연결 관리 ==================

  const disconnect = useCallback(() => {
    if (state.socket) {
      state.socket.disconnect();
      setState(prev => ({
        ...prev,
        socket: null,
        isConnected: false,
        isAuthenticated: false,
        authenticatedUser: null,
      }));
    }
  }, [state.socket]);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // ================== 생명주기 ==================

  useEffect(() => {
    console.log('🔄 useHybridChat 초기화:', { userId, hasToken: !!token });
    
    if (userId && token) {
      console.log('🚀 WebSocket 연결 시작...');
      connect();
    } else {
      console.log('⚠️ WebSocket 연결 불가: userId 또는 token 없음');
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [userId, token]);

  // 빠른 응답 메서드
  const sendQuickReply = useCallback((text: string) => {
    sendMessage(text, false);
  }, [sendMessage]);

  const sendWithStreaming = useCallback((text: string) => {
    sendMessage(text, true);
  }, [sendMessage]);

  return {
    // 상태
    isConnected: state.isConnected,
    isAuthenticated: state.isAuthenticated,
    authenticatedUser: state.authenticatedUser,
    isTyping: state.isTyping,
    messages: state.messages,
    connectionError: state.connectionError,
    isLoadingHistory: state.isLoadingHistory,
    isStreaming: state.isStreaming,
    sessionId: state.sessionId,
    currentStage: state.currentStage,
    selectedRecipes: state.selectedRecipes,
    
    // 메서드
    sendMessage,
    sendQuickReply,
    sendWithStreaming,
    clearHistory,
    loadConversationHistory,
    connect,
    disconnect,
    reconnect,
    
    // 유틸리티
    hasMessages: state.messages.length > 0,
    lastMessage: state.messages[state.messages.length - 1],
    canSendMessage: state.isConnected && state.isAuthenticated && !state.isStreaming,
  };
}