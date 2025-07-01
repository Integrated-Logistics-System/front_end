'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChefHat, UtensilsCrossed, Clock, Users, Sparkles, Heart, Shield, Zap, Play } from 'lucide-react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');

    try {
      await login('demo@example.com', 'demo123');
    } catch (error: any) {
      setError(error.message || '체험용 계정 로그인에 실패했습니다.');
    } finally {
      setDemoLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 flex flex-col lg:flex-row">
        {/* Left Panel - AI Recipe Brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 p-12 items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🍳</div>
            <div className="absolute top-32 right-20 text-4xl animate-pulse">🥘</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-spin-slow">🍴</div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce">✨</div>
          </div>

          <div className="text-center text-white relative z-10">
            <div className="mb-8">
              <div className="relative mb-6">
                <ChefHat className="h-24 w-24 mx-auto mb-4 text-white drop-shadow-lg" />
                <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                AI Recipe Assistant
              </h1>
              <p className="text-xl opacity-90 text-amber-100">
                당신만의 개인 AI 셰프와 함께하는 스마트 요리 여행
              </p>
            </div>

            <div className="space-y-6 text-left max-w-md">
              <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <ChefHat className="h-6 w-6 text-amber-200" />
                <span className="text-amber-100">개인화된 레시피 추천</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6 text-amber-200" />
                <span className="text-amber-100">알레르기 안전 필터링</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Zap className="h-6 w-6 text-amber-200" />
                <span className="text-amber-100">실시간 요리 채팅</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Heart className="h-6 w-6 text-amber-200" />
                <span className="text-amber-100">23만+ 검증된 레시피</span>
              </div>
            </div>

            {/* Recipe Features Preview */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
                <Clock className="h-8 w-8 mb-3 text-amber-200" />
                <h3 className="font-semibold mb-2 text-white">빠른 레시피</h3>
                <p className="text-sm opacity-75 text-amber-100">30분 이내 간편 요리</p>
              </div>
              <div className="bg-white/20 p-6 rounded-xl border border-white/30 shadow-lg">
                <UtensilsCrossed className="h-8 w-8 mb-3 text-amber-200" />
                <h3 className="font-semibold mb-2 text-white">맞춤 요리</h3>
                <p className="text-sm opacity-75 text-amber-100">알레르기 고려 안전 레시피</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">230,000+</div>
                <div className="text-xs text-amber-200">레시피</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">15,000+</div>
                <div className="text-xs text-amber-200">알레르기 데이터</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-amber-200">AI 셰프</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-black/20 to-black/40">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Brand */}
            <div className="lg:hidden text-center mb-8">
              <div className="relative inline-block mb-4">
                <ChefHat className="h-16 w-16 mx-auto text-orange-400" />
                <div className="absolute -top-1 -right-1 text-lg animate-spin-slow">✨</div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                AI Recipe Assistant
              </h1>
              <p className="text-orange-200 mt-2">당신만의 AI 셰프</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-orange-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? '다시 오신 것을 환영해요!' : '요리 여행을 시작해보세요'}
                </h2>
                <p className="text-orange-200">
                  {isLogin
                      ? '맛있는 레시피가 기다리고 있어요 🍳'
                      : 'AI 셰프와 함께하는 개인화된 요리 경험'
                  }
                </p>
              </div>

              {error && (
                  <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {error}
                  </div>
              )}

              {/* Demo Account Button - 상단에 배치 */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl border border-amber-500/40 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-amber-400" />
                    <p className="text-base font-medium text-amber-300">🍳 체험용 셰프 계정</p>
                  </div>
                  <Play className="h-4 w-4 text-amber-400 animate-pulse" />
                </div>

                <button
                    onClick={handleDemoLogin}
                    disabled={demoLoading || loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg hover:shadow-amber-500/25 mb-3"
                >
                  {demoLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <UtensilsCrossed className="h-4 w-4 animate-spin" />
                        <span>체험 셰프로 입장 중...</span>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Play className="h-4 w-4" />
                        <span>바로 체험해보기</span>
                      </div>
                  )}
                </button>

                <div className="text-xs text-amber-200/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    <span>데모 계정으로 모든 기능 체험 가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>개인정보 입력 없이 바로 시작</span>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                <span className="text-sm text-orange-300/60 font-medium">또는</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-orange-300 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        셰프 이름
                      </label>
                      <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-4 bg-gray-700/80 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 backdrop-blur-sm"
                          placeholder="요리사님의 이름을 알려주세요"
                          required={!isLogin}
                      />
                    </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    이메일 주소
                  </label>
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 bg-gray-700/80 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 backdrop-blur-sm"
                      placeholder="chef@example.com"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-gray-700/80 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 pr-12 backdrop-blur-sm"
                        placeholder="안전한 비밀번호를 입력하세요"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-300 hover:text-orange-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {!isLogin && (
                      <p className="text-xs text-orange-300/70 mt-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        최소 6자 이상의 안전한 비밀번호
                      </p>
                  )}
                </div>

                <button
                    type="submit"
                    disabled={loading || demoLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                >
                  {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <UtensilsCrossed className="h-5 w-5 animate-spin" />
                        {isLogin ? '요리 준비 중...' : '셰프 등록 중...'}
                      </div>
                  ) : (
                      <div className="flex items-center justify-center gap-3">
                        <ChefHat className="h-5 w-5" />
                        {isLogin ? 'AI 셰프와 요리하기' : '셰프 되기'}
                      </div>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-orange-200">
                  {isLogin ? '아직 계정이 없나요? ' : '이미 계정이 있나요? '}
                  <button
                      onClick={toggleMode}
                      className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    {isLogin ? '지금 가입하기' : '로그인하기'}
                  </button>
                </p>
              </div>

              {/* Recipe Features Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-300">AI 셰프 기능</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                    <span className="text-amber-200">빠른 레시피</span>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <Shield className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-emerald-200">알레르기 안전</span>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <Heart className="h-4 w-4 mx-auto mb-1 text-red-400" />
                    <span className="text-red-200">맞춤 추천</span>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                    <span className="text-blue-200">실시간 채팅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-orange-300/60 text-xs">
              <p>🍳 맛있는 요리의 시작, AI Recipe Assistant</p>
            </div>
          </div>
        </div>
      </div>
  );
}