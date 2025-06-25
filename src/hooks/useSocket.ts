import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  auth?: {
    token?: string;
  };
  transports?: string[];
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export function useSocket(url: string, options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }
    
    setIsConnecting(true);
    setError(null);

    try {
      // Clean up existing socket
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Create new socket instance
      const socket = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        ...options,
      });

      // 수동으로 연결 시작 (autoConnect가 false인 경우를 대비)
      if (!socket.connected) {
        socket.connect();
      }

      // Connection events
      socket.on('connect', () => {
        console.log('🟢 [WebSocket] 연결 성공:', {
          url,
          socketId: socket.id,
          transport: socket.io.engine.transport.name
        });
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      socket.on('disconnect', (reason) => {
        console.log('🔴 [WebSocket] 연결 해제:', {
          url,
          reason,
          socketId: socket.id
        });
        setIsConnected(false);
        setIsConnecting(false);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ [WebSocket] 연결 오류:', {
          url,
          error: err.message,
          details: err
        });
        setIsConnected(false);
        setIsConnecting(false);
        setError(err.message || '연결에 실패했습니다');
      });

      socket.on('connected', (data) => {
        // Server confirmed connection
      });

      socket.on('connection-error', (data) => {
        setError(data.message);
      });

      socketRef.current = socket;
      
    } catch (err) {
      setIsConnecting(false);
      setError('소켓 생성에 실패했습니다');
    }
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      console.log('📤 [WebSocket] 메시지 전송:', {
        event,
        data,
        socketId: socketRef.current.id,
        timestamp: new Date().toISOString()
      });
      socketRef.current.emit(event, data);
      return true;
    } else {
      console.warn('⚠️ [WebSocket] 전송 실패 - 연결되지 않음:', {
        event,
        data,
        connected: socketRef.current?.connected
      });
      return false;
    }
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      const wrappedCallback = (...args: any[]) => {
        console.log('📥 [WebSocket] 메시지 수신:', {
          event,
          data: args,
          socketId: socketRef.current?.id,
          timestamp: new Date().toISOString()
        });
        callback(...args);
      };
      
      socketRef.current.on(event, wrappedCallback);
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, wrappedCallback);
        }
      };
    }
    return () => {};
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.removeAllListeners(event);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}
