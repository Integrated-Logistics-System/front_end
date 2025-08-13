'use client';

import { useRouter } from 'next/navigation';
import { ChefHat, UtensilsCrossed, Clock, Users, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartChat = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        {/* Main Brand */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <ChefHat className="h-24 w-24 mx-auto text-orange-400" />
            <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Simple Recipe Chat
          </h1>
          <p className="text-xl text-orange-200 mb-8">
            AI와 함께하는 간단한 레시피 채팅 - 로그인 불필요!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-6 rounded-xl border border-orange-500/30">
            <Clock className="h-8 w-8 mx-auto mb-3 text-orange-400" />
            <h3 className="font-semibold mb-2">빠른 레시피</h3>
            <p className="text-sm text-orange-200">30분 이내 간편 요리</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-6 rounded-xl border border-orange-500/30">
            <UtensilsCrossed className="h-8 w-8 mx-auto mb-3 text-orange-400" />
            <h3 className="font-semibold mb-2">실시간 채팅</h3>
            <p className="text-sm text-orange-200">AI와 대화하며 요리</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-6 rounded-xl border border-orange-500/30">
            <Heart className="h-8 w-8 mx-auto mb-3 text-orange-400" />
            <h3 className="font-semibold mb-2">로컬 저장</h3>
            <p className="text-sm text-orange-200">대화 기록 자동 보관</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-6 rounded-xl border border-orange-500/30">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-orange-400" />
            <h3 className="font-semibold mb-2">간편 사용</h3>
            <p className="text-sm text-orange-200">인증 없이 바로 시작</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartChat}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-lg flex items-center gap-3 mx-auto"
        >
          <ChefHat className="h-6 w-6" />
          <span>AI 셰프와 채팅 시작하기</span>
        </button>

        {/* Quick Examples */}
        <div className="mt-12 p-6 bg-gradient-to-br from-black/20 to-black/40 rounded-xl border border-orange-500/30">
          <h3 className="text-lg font-semibold mb-4 text-orange-300">💡 이렇게 물어보세요</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-orange-900/30 p-3 rounded-lg text-orange-200">
              "닭가슴살로 간단한 요리 추천해주세요"
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg text-orange-200">
              "30분 이내로 만들 수 있는 파스타"
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg text-orange-200">
              "다이어트 요리 알려주세요"
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg text-orange-200">
              "김치찌개 레시피 상세히 알려주세요"
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-orange-300/60 text-sm">
          <p>🔄 로컬 스토리지 기반 • 인증 불필요 • 실시간 WebSocket</p>
        </div>
      </div>
    </div>
  );
}