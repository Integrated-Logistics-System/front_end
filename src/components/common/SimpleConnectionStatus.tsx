'use client';

const SimpleConnectionStatus = () => {
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg text-sm shadow-xl"
      style={{ 
        position: 'fixed', 
        bottom: '16px', 
        right: '16px', 
        zIndex: 9999,
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px'
      }}
    >
      <div className="font-bold mb-2">🔗 백엔드 연결 URL</div>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-red-200">API:</span>
          <div className="font-mono text-yellow-300 break-all">
            {(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api').startsWith('/') 
              ? `${typeof window !== 'undefined' ? window.location.origin : ''}${process.env.NEXT_PUBLIC_API_URL || '/api'}`
              : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api')}
          </div>
        </div>
        <div>
          <span className="text-red-200">WS:</span>
          <div className="font-mono text-blue-300 break-all">
            {(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083').startsWith('/') 
              ? `${typeof window !== 'undefined' ? window.location.origin : ''}${process.env.NEXT_PUBLIC_WS_URL || '/socket.io'}`
              : (process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083')}
          </div>
        </div>
        <div>
          <span className="text-red-200">ENV:</span>
          <span className="text-green-300 ml-1">{process.env.NODE_ENV || 'development'}</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleConnectionStatus;