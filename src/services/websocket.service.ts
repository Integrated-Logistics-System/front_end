import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, SocketError, ConversationChunk, ConversationHistory, ConversationResponse } from '@/types/websocket.types';
import { config } from '@/lib/config';

class WebSocketService {
  private socket: Socket | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  connect() {
    if (this.socket && this.socket.connected) {
      return;
    }

    const WS_URL = config.api.wsUrl;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: config.websocket.reconnectAttempts,
      reconnectionDelay: config.websocket.reconnectDelay,
      timeout: config.websocket.timeout,
      autoConnect: true,
      forceNew: false,
      upgrade: true,
    });

    this.socket.on('connect', () => {
      // Connected with socket ID
      // 연결 후 정기적인 ping 시작
      this.startPingInterval();
    });

    this.socket.on('disconnect', (reason) => {
      // Disconnected
      // 연결 끊김 시 ping 인터벌 정리
      this.stopPingInterval();
    });

    this.socket.on('connect_error', (error) => {
      // Connection Error
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