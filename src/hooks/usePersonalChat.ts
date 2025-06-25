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
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageBufferRef = useRef<string>('');

  // WebSocket 연결 - URL 수정
  const connect = useCallback(() => {
    if (!token) {
      console.warn('No token provided for WebSocket connection');
      return;
    }

    try {
      console.log('🔗 Connecting to WebSocket at port 8083...');

      // 백엔드의 실제 WebSocket 포트에 연결
      const newSocket = io('ws://localhost:8083', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true,
      });

      // 연결 성공
      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected to 8083');
        setIsConnected(true);
        setConnectionError(null);

        // 개인 채팅방 참여
        newSocket.emit('join-personal-chat');
      });

      // 연결 확인
      newSocket.on('connected', (data) => {
        console.log('📡 Connection confirmed:', data);
      });

      // 채팅 히스토리 수신
      newSocket.on('chat-history', (history) => {
        console.log('📜 Chat history received:', history);
        if (Array.isArray(history)) {
          const formattedMessages = history.flatMap((item: any, index: number) => [
            {
              id: `user-${index}`,
              content: item.content || item.userMessage || item.user || '',
              isUser: true,
              timestamp: item.timestamp || new Date().toISOString(),
            },
            {
              id: `ai-${index}`,
              content: item.ai || item.aiResponse || item.assistant || '',
              isUser: false,
              timestamp: item.timestamp || new Date().toISOString(),
            },
          ]).filter(msg => msg.content.trim());
          setMessages(formattedMessages);
        }
      });

      // 스트리밍 메시지 수신
      newSocket.on('chat-stream', (data) => {
        console.log('📥 Stream data:', data);

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

        // 자동 재연결 (일부 경우)
        if (reason === 'io server disconnect') {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            newSocket.connect();
          }, 2000);
        }
      });

      // 연결 에러
      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message);
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
      socket.removeAllListeners();
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
  }, [userId, token, connect, disconnect]);

  return {
    // 상태
    isConnected,
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