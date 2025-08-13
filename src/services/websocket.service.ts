import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, SocketError, ConversationChunk, ConversationHistory, ConversationResponse } from '@/types/websocket.types';

class WebSocketService {
  private socket: Socket | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  connect() {
    if (this.socket && this.socket.connected) {
      return;
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083';

    const reconnectAttempts = parseInt(process.env.NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS || '5');
    const reconnectDelay = parseInt(process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY || '3000');

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: reconnectAttempts,
      reconnectionDelay: reconnectDelay,
      // 스트리밍 타임아웃 설정 (LangChain 스트리밍이 30초 이상 걸릴 수 있음)
      timeout: 120000, // 2분 연결 타임아웃
      // Heartbeat 설정 (백엔드와 동일하게 설정)
      pingTimeout: 60000, // 60초 - 백엔드 설정과 일치
      pingInterval: 25000, // 25초 - 백엔드 설정과 일치
      // 자동 연결 설정
      autoConnect: true,
      forceNew: false,
      // 긴 스트리밍을 위한 추가 설정
      upgrade: true,
      rememberUpgrade: false,
    });

    this.socket.on('connect', () => {
      console.log(`Connected with socket ID: ${this.socket?.id}`);
      // 연결 후 정기적인 ping 시작
      this.startPingInterval();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`Disconnected: ${reason}`);
      // 연결 끊김 시 ping 인터벌 정리
      this.stopPingInterval();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection Error:', error.message);
      this.stopPingInterval();
    });

    // Pong 응답 처리
    this.socket.on('pong', (data) => {
      console.log('Received pong:', data);
    });

    // 재연결 시도 시 로그
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      this.startPingInterval();
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed after all attempts');
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
    
    // 30초마다 ping 전송 (백엔드 pingInterval 25초보다 약간 길게)
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        console.log('Sending ping to maintain connection');
        this.socket.emit('ping');
      }
    }, 30000);
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // --- Event Emitters ---
  sendMessage(message: string, sessionId?: string, context?: { history?: any[], allergies?: string[], cookingLevel?: string }) {
    if (!this.socket) return console.error('Socket not connected');
    this.socket.emit('conversation_stream', { 
      message, 
      sessionId,
      context
    });
  }

  getHistory() {
    if (!this.socket) return console.error('Socket not connected');
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