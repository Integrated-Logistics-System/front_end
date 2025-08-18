import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, SocketError, ConversationChunk, ConversationHistory, ConversationResponse, ReactChunk } from '@/types/websocket.types';
import { config } from '@/lib/config';

class WebSocketService {
  private socket: Socket | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  connect() {
    if (this.socket && this.socket.connected) {
      return;
    }

    const WS_URL = config.api.wsUrl;
    
    // URL 파싱: 상대경로면 현재 도메인 사용, 절대경로면 그대로 사용
    let socketUrl: string;
    let socketPath: string;
    
    if (WS_URL.startsWith('/')) {
      // 상대경로: /socket.io
      socketUrl = window.location.origin;
      socketPath = WS_URL.endsWith('/') ? WS_URL : WS_URL + '/';
    } else if (WS_URL.startsWith('http')) {
      // 절대경로: http://localhost:8083
      socketUrl = WS_URL;
      socketPath = '/socket.io/';
    } else {
      // 기본값
      socketUrl = window.location.origin;
      socketPath = '/socket.io/';
    }

    console.log('🔍 WebSocket 연결 시도:', { socketUrl, socketPath });

    this.socket = io(socketUrl, {
      path: socketPath,
      transports: ['websocket'], // WebSocket만 사용
      reconnectionAttempts: config.websocket.reconnectAttempts,
      reconnectionDelay: config.websocket.reconnectDelay,
      timeout: config.websocket.timeout,
      autoConnect: true,
      forceNew: false,
      upgrade: false, // 업그레이드 비활성화
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket 연결 성공!', {
        socketId: this.socket?.id,
        url: socketUrl,
        path: socketPath
      });
      this.startPingInterval();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket 연결 끊김:', reason, {
        timestamp: new Date().toISOString(),
        socketId: this.socket?.id,
        transport: this.socket?.io?.engine?.transport?.name
      });
      this.stopPingInterval();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket 연결 실패:', error);
      this.stopPingInterval();
    });

    // Pong 응답 처리
    this.socket.on('pong', (data) => {
      // Received pong
    });

    // 재연결 시도 시 로그
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      // Reconnection attempt
    });

    this.socket.on('reconnect', (attemptNumber) => {
      // Reconnected after attempts
      this.startPingInterval();
    });

    this.socket.on('reconnect_failed', () => {
      // Reconnection failed
      this.stopPingInterval();
    });
  }

  disconnect() {
    this.stopPingInterval();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 정기적인 ping을 통한 연결 유지
  private startPingInterval() {
    this.stopPingInterval(); // 기존 인터벌 정리
    
    // ping 전송 (백엔드 pingInterval보다 약간 길게)
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        // Sending ping to maintain connection
        this.socket.emit('ping');
      }
    }, config.websocket.pingInterval);
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // --- Event Emitters ---
  sendMessage(message: string, sessionId?: string, context?: { history?: any[], allergies?: string[], cookingLevel?: string }) {
    if (!this.socket) return;
    this.socket.emit('conversation_stream', { 
      message, 
      sessionId,
      context
    });
  }

  // ReAct 메시지 전송
  sendReactMessage(message: string, sessionId?: string, context?: { history?: any[], allergies?: string[], cookingLevel?: string }) {
    if (!this.socket) return;
    this.socket.emit('conversation_react_stream', { 
      message, 
      sessionId,
      context
    });
  }

  getHistory() {
    if (!this.socket) return;
    this.socket.emit('conversation_get_history');
  }

  // --- Event Listeners ---
  onConnectionStatus(callback: (status: ConnectionStatus) => void) {
    this.socket?.on('connection-status', callback);
  }

  onConversationChunk(callback: (chunk: ConversationChunk) => void) {
    this.socket?.on('conversation_chunk', callback);
  }
  
  onConversationResponse(callback: (response: ConversationResponse) => void) {
    this.socket?.on('conversation_response', callback);
  }

  onConversationHistory(callback: (history: ConversationHistory) => void) {
    this.socket?.on('conversation_history', callback);
  }

  onError(callback: (error: SocketError) => void) {
    this.socket?.on('error', callback);
    this.socket?.on('conversation_error', callback);
  }

  // ReAct 관련 이벤트 리스너
  onReactChunk(callback: (chunk: ReactChunk) => void) {
    this.socket?.on('react_chunk', callback);
  }
  
  // --- Connection Status ---
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // 연결 상태 강제 확인 (스트리밍 중 사용)
  checkConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve(false);
        return;
      }

      if (!this.socket.connected) {
        resolve(false);
        return;
      }

      // ping으로 실제 연결 상태 확인
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000); // 5초 타임아웃

      this.socket.emit('ping');
      this.socket.once('pong', () => {
        clearTimeout(timeout);
        resolve(true);
      });
    });
  }

  // --- Cleanup ---
  removeAllListeners() {
      this.socket?.removeAllListeners();
  }
}

export const webSocketService = new WebSocketService();