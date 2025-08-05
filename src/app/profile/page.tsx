'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  
  useEffect(() => {
    // 프로필 페이지를 채팅 페이지로 리다이렉트
    router.replace('/chat');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg">채팅 페이지로 이동 중...</div>
      </div>
    </div>
  );
}