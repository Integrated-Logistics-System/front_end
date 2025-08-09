
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, SocketError, ConversationChunk, ConversationHistory, ConversationResponse } from '@/types/websocket.types';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket && this.socket.connected) {
      return;
    }

    const VITE_API_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

    this.socket = io(VITE_API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.socket.on('connect', () => {
      console.log(`Connected with socket ID: ${this.socket?.id}`);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`Disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection Error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // --- Event Emitters ---
  sendMessage(message: string, sessionId?: string) {
    if (!this.socket) return console.error('Socket not connected');
    this.socket.emit('conversation_stream', { message, sessionId });
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
  
  // --- Cleanup ---
  removeAllListeners() {
      this.socket?.removeAllListeners();
  }
}

export const webSocketService = new WebSocketService();
