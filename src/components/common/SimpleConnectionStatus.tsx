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
      <div className="font-bold mb-2">🔗 연결 정보 테스트</div>
      <div>
        <div>API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'}</div>
        <div>WS: {process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083'}</div>
        <div>ENV: {process.env.NODE_ENV || 'development'}</div>
      </div>
    </div>
  );
};

export default SimpleConnectionStatus;