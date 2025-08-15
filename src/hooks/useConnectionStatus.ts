'use client';

import { useState, useEffect } from 'react';
import { webSocketService } from '@/services/websocket.service';
import { config } from '@/lib/config';

export interface ConnectionInfo {
  api: {
    url: string;
    status: 'connected' | 'disconnected' | 'checking';
    lastChecked: Date | null;
  };
  websocket: {
    url: string;
    status: 'connected' | 'disconnected' | 'connecting';
    socketId: string | null;
  };
}

export const useConnectionStatus = () => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    api: {
      url: config.api.baseUrl,
      status: 'checking',
      lastChecked: null,
    },
    websocket: {
      url: config.api.wsUrl,
      status: 'disconnected',
      socketId: null,
    },
  });

  // API 연결 상태 확인
  const checkApiConnection = async () => {
    try {
      setConnectionInfo(prev => ({
        ...prev,
        api: { ...prev.api, status: 'checking' }
      }));

      const response = await fetch(`${config.api.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000), // 5초 타임아웃
      });

      const isConnected = response.ok;
      
      setConnectionInfo(prev => ({
        ...prev,
        api: {
          ...prev.api,
          status: isConnected ? 'connected' : 'disconnected',
          lastChecked: new Date(),
        }
      }));
    } catch (error) {
      setConnectionInfo(prev => ({
        ...prev,
        api: {
          ...prev.api,
          status: 'disconnected',
          lastChecked: new Date(),
        }
      }));
    }
  };

  // WebSocket 연결 상태 업데이트
  const updateWebSocketStatus = () => {
    const isConnected = webSocketService.isConnected();
    const socketId = webSocketService.getSocketId();

    setConnectionInfo(prev => ({
      ...prev,
      websocket: {
        ...prev.websocket,
        status: isConnected ? 'connected' : 'disconnected',
        socketId: socketId || null,
      }
    }));
  };

  useEffect(() => {
    // 초기 API 연결 확인
    checkApiConnection();

    // API 연결 상태 주기적 확인 (30초마다)
    const apiInterval = setInterval(checkApiConnection, 30000);

    // WebSocket 연결 상태 주기적 확인 (5초마다)
    const wsInterval = setInterval(updateWebSocketStatus, 5000);

    // WebSocket 이벤트 리스너
    const originalConnect = webSocketService.connect;
    webSocketService.connect = () => {
      setConnectionInfo(prev => ({
        ...prev,
        websocket: { ...prev.websocket, status: 'connecting' }
      }));
      originalConnect.call(webSocketService);
    };

    // 초기 WebSocket 상태 확인
    updateWebSocketStatus();

    return () => {
      clearInterval(apiInterval);
      clearInterval(wsInterval);
    };
  }, []);

  return {
    connectionInfo,
    refreshApiConnection: checkApiConnection,
    refreshWebSocketConnection: updateWebSocketStatus,
  };
};