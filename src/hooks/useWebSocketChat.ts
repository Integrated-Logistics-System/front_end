'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface UseWebSocketChatProps {
  userId?: string;
  token?: string;
}

export function useWebSocketChat({ userId, token }: UseWebSocketChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태 추가
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null); // 인증된 사용자 정보
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageBufferRef = useRef<string>('');

  // WebSocket 연결
  const connect = useCallback(() => {
    console.log('🔍 useWebSocketChat Debug:', { userId, token });
    
    if (!token) {
      console.warn('No token provided for WebSocket connection');
      setConnectionError('No authentication token');
      return;
    }

    if (socket?.connected) {
      console.log('ℹ️ Already connected to WebSocket');
      return;
    }

    try {
      console.log('🔗 Connecting to WebSocket...');

// frontend/src/hooks/useWebSocketChat.ts 수정
      const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8081', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // 연결 성공
      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        
        // 개인 채팅방 참여
        newSocket.emit('join-personal-chat');
      });

      // 연결 확인
      newSocket.on('connected', (data) => {
        console.log('📡 Connection confirmed:', data);
        
        // 인증 상태 업데이트
        if (data.user && data.user.id) {
          setIsAuthenticated(true);
          setAuthenticatedUser(data.user);
          setConnectionError(null);
          console.log('✅ 인증 성공:', data.user.email);
        } else {
          setIsAuthenticated(false);
          setAuthenticatedUser(null);
          setConnectionError('인증되지 않은 연결');
          console.warn('⚠️ 익명 연결: 로그인이 필요합니다');
        }
      });

      // 채팅 히스토리 수신
      newSocket.on('chat-history', (history) => {
        console.log('📜 Chat history received:', history);
        
        // history가 배열인지 확인
        if (!Array.isArray(history)) {
          console.warn('⚠️ Chat history is not an array:', typeof history, history);
          setMessages([]);
          return;
        }
        
        const formattedMessages = history.flatMap((item: any, index: number) => {
          // item이 유효한지 확인
          if (!item || typeof item !== 'object') {
            console.warn('⚠️ Invalid history item:', item);
            return [];
          }
          
          const messages = [];
          
          // 사용자 메시지
          const userContent = item.content || item.userMessage || item.user || '';
          if (userContent.trim()) {
            messages.push({
              id: `user-${index}`,
              content: userContent,
              isUser: true,
              timestamp: item.timestamp || new Date().toISOString(),
            });
          }
          
          // AI 메시지
          const aiContent = item.ai || item.aiResponse || item.assistant || '';
          if (aiContent.trim()) {
            messages.push({
              id: `ai-${index}`,
              content: aiContent,
              isUser: false,
              timestamp: item.timestamp || new Date().toISOString(),
            });
          }
          
          return messages;
        });
        
        console.log('✅ Formatted messages:', formattedMessages.length);
        setMessages(formattedMessages);
      });

      // 스트리밍 메시지 수신
      newSocket.on('chat-stream', (data) => {
        if (data.type === 'start') {
          console.log('🚀 Streaming started');
          messageBufferRef.current = '';
          setIsTyping(true);
        } else if (data.type === 'content') {
          messageBufferRef.current += data.data;
          
          // 실시간으로 메시지 업데이트
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && !lastMessage.isUser) {
              // 마지막 AI 메시지 업데이트
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: messageBufferRef.current,
                }
              ];
            } else {
              // 새 AI 메시지 추가
              return [
                ...prev,
                {
                  id: `ai-${Date.now()}`,
                  content: messageBufferRef.current,
                  isUser: false,
                  timestamp: new Date().toISOString(),
                }
              ];
            }
          });
        } else if (data.type === 'end') {
          console.log('✅ Streaming completed');
          setIsTyping(false);
        }
      });

      // 타이핑 상태
      newSocket.on('chat-status', (data) => {
        if (data.type === 'typing') {
          setIsTyping(data.isTyping);
        }
      });

      // 메시지 완료
      newSocket.on('message-complete', (data) => {
        console.log('📨 Message completed');
        setIsTyping(false);
      });

      // 에러 처리
      newSocket.on('chat-error', (error) => {
        console.error('❌ Chat error:', error);
        setConnectionError(error.message);
        setIsTyping(false);
      });

      // 연결 해제
      newSocket.on('disconnect', (reason) => {
        console.warn('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsAuthenticated(false); // 연결 해제 시 인증 상태도 초기화
        setAuthenticatedUser(null);
        
        // 자동 재연결 (일부 경우)
        if (reason === 'io server disconnect') {
          // 서버에서 연결을 끊은 경우 수동 재연결 필요
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            newSocket.connect();
          }, 2000);
        }
      });

      // 연결 에러
      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        setConnectionError(`Connection failed: ${error.message}`);
        setIsConnected(false);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('❌ Socket creation error:', error);
      setConnectionError('Failed to create socket connection');
    }
  }, [token]);

  // 메시지 전송
  const sendMessage = useCallback((message: string) => {
    if (!socket || !isConnected || !message.trim()) {
      console.warn('Cannot send message: socket not ready or empty message');
      return;
    }

    console.log('📤 Sending message:', message);

    // 사용자 메시지 즉시 표시
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // WebSocket으로 메시지 전송
    socket.emit('send-personal-message', { message });
  }, [socket, isConnected]);

  // 채팅 히스토리 지우기
  const clearHistory = useCallback(() => {
    if (!socket || !isConnected) return;

    socket.emit('clear-chat-history');
    setMessages([]);
  }, [socket, isConnected]);

  // 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socket) {
      console.log('🔌 Disconnecting WebSocket...');
      socket.emit('leave-personal-chat');
      socket.disconnect();
      setSocket(null);
    }

    setIsConnected(false);
    setIsTyping(false);
    setConnectionError(null);
  }, [socket]);

  // 컴포넌트 마운트/언마운트 시 연결 관리
  useEffect(() => {
    if (userId && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, token]); // connect, disconnect 제거하여 무한 루프 방지

  return {
    // 상태
    isConnected,
    isAuthenticated, // 인증 상태 추가
    authenticatedUser, // 인증된 사용자 정보 추가
    isTyping,
    messages,
    connectionError,
    
    // 액션
    sendMessage,
    clearHistory,
    disconnect,
    reconnect: connect,
  };
}
