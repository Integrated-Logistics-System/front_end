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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageBufferRef = useRef<string>('');
  const historyRequestedRef = useRef<boolean>(false); // 🔥 중복 요청 방지
  const historyLoadedRef = useRef<boolean>(false); // 🔥 히스토리 로딩 완료 여부

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
      
      // 🔥 상태 초기화
      historyRequestedRef.current = false;
      historyLoadedRef.current = false; // 🔥 히스토리 로딩 상태 초기화
      setIsLoadingHistory(false);

      const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083', {
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
        
        // 🔥 인증 완료 후에 join-personal-chat을 보내도록 변경
        console.log('⏳ Waiting for authentication confirmation...');
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
          
          // 🔥 인증 성공 후 join-personal-chat 전송 (한 번만)
          if (!historyRequestedRef.current && !historyLoadedRef.current) {
            console.log('📥 Now joining personal chat after authentication...');
            newSocket.emit('join-personal-chat');
            
            console.log('🔄 Starting chat history loading...');
            setIsLoadingHistory(true);
            historyRequestedRef.current = true;
            
            // 🔥 강화된 안전장치: 3초 후에도 히스토리가 안 오면 빈 상태로 설정
            setTimeout(() => {
              if (isLoadingHistory && !historyLoadedRef.current) {
                console.warn('⏰ Chat history loading timeout - setting empty messages for first time chat');
                setIsLoadingHistory(false);
                setMessages([]);
                historyRequestedRef.current = false;
                historyLoadedRef.current = true; // 🔥 타임아웃도 로딩 완료로 처리
              }
            }, 3000);
          } else {
            console.log('🚫 History already requested or loaded - skipping');
          }
        } else {
          setIsAuthenticated(false);
          setAuthenticatedUser(null);
          setConnectionError('인증되지 않은 연결');
          console.warn('⚠️ 익명 연결: 로그인이 필요합니다');
          setIsLoadingHistory(false);
        }
      });

      // 🔥 채팅 히스토리 수신
      newSocket.on('chat-history', (data) => {
        console.log('📜 Chat history received:', data);
        
        // 🔥 로딩 상태 즉시 해제 및 로딩 완료 표시
        setIsLoadingHistory(false);
        historyRequestedRef.current = false;
        historyLoadedRef.current = true; // 🔥 히스토리 로딩 완료
        
        const historyMessages = data.messages || data || [];
        
        if (!Array.isArray(historyMessages)) {
          console.warn('⚠️ Chat history messages is not an array:', typeof historyMessages, historyMessages);
          console.log('🔄 Setting empty messages for first time chat');
          setMessages([]);
          return;
        }
        
        // 🔥 빈 배열이어도 정상 처리
        if (historyMessages.length === 0) {
          console.log('📭 No previous chat history - starting fresh conversation');
          setMessages([]);
          return;
        }
        
        const formattedMessages: ChatMessage[] = historyMessages
          .map((item: any, index: number) => {
            if (!item || typeof item !== 'object') {
              console.warn('⚠️ Invalid history item:', item);
              return null;
            }
            
            return {
              id: `history-${item.timestamp || index}`,
              content: item.content || '',
              isUser: item.role === 'user',
              timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString(),
            };
          })
          .filter((msg): msg is ChatMessage => msg !== null);
        
        console.log(`✅ Loaded ${formattedMessages.length} messages from chat history`);
        
        const sortedMessages = formattedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setMessages(sortedMessages);
        
        if (data.source) {
          console.log(`📂 Memory source: ${data.source} (${data.memoryType || 'unknown'})`);
        }
      });

      // 🔥 채팅 기록 클리어 확인
      newSocket.on('chat-history-cleared', (data) => {
        console.log('🗑️ Chat history cleared:', data);
        if (data.success) {
          setMessages([]);
          // 🔥 클리어 후에는 다시 로딩 가능하도록 설정
          historyLoadedRef.current = false;
          historyRequestedRef.current = false;
          console.log('✅ Local chat history cleared and ready for new conversation');
        }
      });

      // 스트리밍 메시지 수신
      newSocket.on('chat-stream', (data) => {
        if (data.type === 'start') {
          console.log('🚀 Streaming started');
          messageBufferRef.current = '';
          setIsTyping(true);
        } else if (data.type === 'content') {
          messageBufferRef.current += data.data;
          
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && !lastMessage.isUser) {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: messageBufferRef.current,
                }
              ];
            } else {
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

      // 🔥 에러 처리 개선
      newSocket.on('chat-error', (error) => {
        console.error('❌ Chat error:', error);
        setConnectionError(error.message);
        setIsTyping(false);
        
        // 🔥 에러가 발생해도 로딩 상태는 해제하고 빈 메시지로 설정
        if (isLoadingHistory) {
          console.log('🔧 Chat error occurred - setting empty messages for first time chat');
          setIsLoadingHistory(false);
          historyRequestedRef.current = false;
          historyLoadedRef.current = true; // 🔥 에러에도 로딩 완료로 처리
          setMessages([]);
        }
      });

      // 연결 해제
      newSocket.on('disconnect', (reason) => {
        console.warn('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsAuthenticated(false);
        setAuthenticatedUser(null);
        setIsLoadingHistory(false);
        historyRequestedRef.current = false;
        historyLoadedRef.current = false; // 🔥 다시 연결 시 히스토리 로딩 가능
        
        if (reason === 'io server disconnect') {
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
        setIsLoadingHistory(false);
        historyRequestedRef.current = false;
        historyLoadedRef.current = false; // 🔥 연결 에러 시 리셋
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('❌ Socket creation error:', error);
      setConnectionError('Failed to create socket connection');
      setIsLoadingHistory(false);
      historyRequestedRef.current = false;
      historyLoadedRef.current = false; // 🔥 생성 에러 시 리셋
    }
  }, [token, isLoadingHistory]);

  // 🔥 수동으로 대화 기록 요청하는 함수 개선
  const requestChatHistory = useCallback(() => {
    if (!socket || !isConnected || !isAuthenticated) {
      console.warn('Cannot request chat history: not ready');
      return;
    }
    
    if (historyRequestedRef.current || historyLoadedRef.current) {
      console.log('📋 Chat history already requested or loaded');
      return;
    }
    
    console.log('📋 Manually requesting chat history...');
    setIsLoadingHistory(true);
    historyRequestedRef.current = true;
    
    socket.emit('join-personal-chat');
    
    setTimeout(() => {
      if (isLoadingHistory && !historyLoadedRef.current) {
        console.warn('⏰ Manual chat history loading timeout');
        setIsLoadingHistory(false);
        historyRequestedRef.current = false;
        historyLoadedRef.current = true;
        setMessages([]);
      }
    }, 3000);
  }, [socket, isConnected, isAuthenticated, isLoadingHistory]);

  // 메시지 전송
  const sendMessage = useCallback((message: string) => {
    if (!socket || !isConnected || !message.trim()) {
      console.warn('Cannot send message: socket not ready or empty message');
      return;
    }

    console.log('📤 Sending message:', message);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    socket.emit('send-personal-message', { message });
  }, [socket, isConnected]);

  // 채팅 히스토리 지우기
  const clearHistory = useCallback(() => {
    if (!socket || !isConnected) return;

    console.log('🗑️ Clearing chat history...');
    socket.emit('clear-chat-history');
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
    setIsLoadingHistory(false);
    historyRequestedRef.current = false;
    historyLoadedRef.current = false; // 🔥 연결 해제 시 리셋
  }, [socket]);

  // 🔥 인증 상태 변경 시 대화 기록 요청 (단순화)
  useEffect(() => {
    // 인증 성공 후 최초 1회만 실행
    if (isAuthenticated && isConnected && !historyRequestedRef.current && !historyLoadedRef.current) {
      console.log('🔄 Auth state changed - ready to request chat history');
      // join-personal-chat은 connected 이벤트에서 이미 처리
    }
  }, [isAuthenticated, isConnected]); // messages.length 제거

  // 컴포넌트 마운트/언마운트 시 연결 관리
  useEffect(() => {
    if (userId && token) {
      // 🔥 연결 시 상태 초기화
      historyLoadedRef.current = false;
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, token]); // connect, disconnect 제거

  return {
    // 상태
    isConnected,
    isAuthenticated,
    authenticatedUser,
    isTyping,
    messages,
    connectionError,
    isLoadingHistory,
    
    // 액션
    sendMessage,
    clearHistory,
    disconnect,
    reconnect: connect,
    requestChatHistory, // 🔥 수동 요청 함수 추가
  };
}