'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  MessageSquare,
  Trash2,
  LogOut,
  Wifi,
  WifiOff,
  ChefHat,
  UtensilsCrossed,
  Clock,
  Users,
  Shield,
  Star,
  Menu,
  X,
  ArrowLeft,
  Search,
  Heart,
  Brain
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { useHybridChat } from '@/hooks/useHybridChat';
import { AllergySettingsSidebar } from '@/components/ui/AllergySettingsSidebar';
import {CookingLevelSidebar} from "@/components/settings/CookingLevelSidebar";
import { RecipeDetailCard } from '@/components/chat/RecipeDetailCard';
import { parseRecipeFromTextAdvanced, hasRecipeContentAdvanced, getRecipeContentScoreAdvanced } from '@/utils/intelligentRecipeParser';

// 개발 환경에서 테스트 유틸리티 로드
if (process.env.NODE_ENV === 'development') {
  import('@/utils/recipeTestUtils').then(() => {
    console.log('🧪 Recipe Test Utils loaded. Use window.testRecipeParser() to run tests.');
  });
}

export default function WebSocketChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthViewModel();
  const [input, setInput] = useState('');
  const [isAllergySidebarOpen, setIsAllergySidebarOpen] = useState(false);
  const [isCookingLevelSidebarOpen, setIsCookingLevelSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isAuthenticated: wsIsAuthenticated,
    authenticatedUser,
    isTyping,
    messages,
    connectionError,
    isLoadingHistory,
    isStreaming,
    sessionId,
    currentStage,
    selectedRecipes,
    sendMessage,
    sendQuickReply,
    sendWithStreaming,
    clearHistory,
    reconnect,
    canSendMessage,
  } = useHybridChat({
    userId: user?.id,
    token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 인증 확인 및 리다이렉트 처리
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 토큰이 있는지 한 번 더 확인
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        // 토큰이 없으면 홈페이지로 리다이렉트
        console.log('🔄 리다이렉트 to home: no token and not authenticated');
        router.push('/');
      } else {
        // 토큰이 있으면 잠시 기다려서 인증 상태 복원 시간을 줌
        console.log('⏳ 토큰은 있음, 인증 상태 복원 대기 중...');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim() || !canSendMessage) return;

    // Use streaming for better user experience
    sendWithStreaming(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
          <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-orange-500/30 max-w-md w-full">
            <div className="relative mb-6">
              <ChefHat className="h-16 w-16 text-orange-400 mx-auto animate-pulse" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">⚙️</div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              AI Recipe Assistant
            </h1>
            <p className="text-orange-200 mb-4 text-sm md:text-base">인증 확인 중...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트되기 전 잠깐 보일 수 있음)
  if (!isAuthenticated || !user) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
          <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-orange-500/30 max-w-md w-full">
            <ChefHat className="h-12 w-12 md:h-16 md:w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              AI Recipe Assistant
            </h1>
            <p className="text-orange-200 mb-4 md:mb-6 text-sm md:text-base">로그인 페이지로 이동 중...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="flex h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white relative">
        {/* Mobile Header - 모바일 전용 헤더 */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-900/95 to-amber-900/95 backdrop-blur-sm border-b border-orange-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-orange-400" />
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  AI Recipe Chat
                </h1>
              </div>
            </div>

            {/* 연결 상태 표시 */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                  <Wifi className="h-5 w-5 text-emerald-400" />
              ) : (
                  <WifiOff className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeMobileSidebar}>
              <div
                  className="w-80 max-w-[85vw] h-full bg-gradient-to-b from-orange-900/95 to-amber-900/95 backdrop-blur-sm border-r border-orange-500/30 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Sidebar Header */}
                <div className="p-4 border-b border-orange-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ChefHat className="h-7 w-7 text-orange-400" />
                      <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        AI Recipe Chat
                      </h1>
                    </div>
                    <button
                        onClick={closeMobileSidebar}
                        className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* 연결 상태 */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-black/20 rounded-lg border border-orange-500/20">
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                          <>
                            <Wifi className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400 font-medium">연결됨</span>
                          </>
                      ) : (
                          <>
                            <WifiOff className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-red-400 font-medium">연결 끊김</span>
                          </>
                      )}
                    </div>
                    <div className="w-px h-4 bg-orange-500/30"></div>
                    <UtensilsCrossed className="h-4 w-4 text-orange-400" />
                  </div>

                  {/* 인증 상태 */}
                  <div className="mb-4">
                    {wsIsAuthenticated && authenticatedUser ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                          <ChefHat className="h-5 w-5 text-emerald-400" />
                          <div>
                            <div className="text-sm font-medium text-emerald-400">셰프 인증 완료</div>
                            <div className="text-xs text-emerald-300">{authenticatedUser.name || authenticatedUser.email}</div>
                          </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                          <Users className="h-5 w-5 text-amber-400" />
                          <div>
                            <div className="text-sm font-medium text-amber-400">셰프 연결 중</div>
                            <div className="text-xs text-amber-300">잠시만 기다려주세요...</div>
                          </div>
                        </div>
                    )}
                  </div>

                  {connectionError && (
                      <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30 text-xs text-red-300">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="font-medium">연결 오류</span>
                        </div>
                        {connectionError}
                      </div>
                  )}
                </div>

                {/* Mobile Sidebar Controls */}
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  <div className="text-sm font-medium text-orange-300 mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>셰프 도구</span>
                  </div>


                  <button
                      onClick={() => {
                        window.location.href = '/recipes';
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 text-orange-300 hover:text-white hover:bg-blue-700/30 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 text-base mb-4"
                  >
                    <Search className="h-5 w-5" />
                    <span>레시피 검색</span>
                  </button>


                  <button
                      onClick={() => {
                        window.location.href = '/bookmarks';
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50 text-base mb-4"
                  >
                    <Heart className="h-5 w-5" />
                    <span>내 북마크</span>
                  </button>

                  <button
                      onClick={() => {
                        clearHistory();
                        closeMobileSidebar();
                      }}
                      disabled={!isConnected || !wsIsAuthenticated}
                      className="w-full flex items-center justify-center gap-3 p-4 text-orange-300 hover:text-white hover:bg-orange-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/30 hover:border-orange-500/50 text-base"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>레시피 대화 지우기</span>
                  </button>

                  <button
                      onClick={() => {
                        setIsAllergySidebarOpen(true);
                        closeMobileSidebar();
                      }}
                      disabled={!wsIsAuthenticated}
                      className="w-full flex items-center justify-center gap-3 p-4 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50 text-base"
                  >
                    <Shield className="h-5 w-5" />
                    <span>알레르기 설정</span>
                  </button>

                  <button
                      onClick={() => {
                        setIsCookingLevelSidebarOpen(true);
                        closeMobileSidebar();
                      }}
                      disabled={!wsIsAuthenticated}
                      className="w-full flex items-center justify-center gap-3 p-4 text-orange-300 hover:text-white hover:bg-amber-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/30 hover:border-amber-500/50 text-base"
                  >
                    <Star className="h-5 w-5" />
                    <span>요리 수준 설정</span>
                  </button>

                  {!isConnected && (
                      <button
                          onClick={() => {
                            reconnect();
                            closeMobileSidebar();
                          }}
                          className="w-full flex items-center justify-center gap-3 p-4 bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-200 border border-amber-500/50 hover:border-amber-400 text-base"
                      >
                        <Wifi className="h-5 w-5" />
                        <span>셰프와 다시 연결</span>
                      </button>
                  )}

                  {/* Recipe Tips for Mobile */}
                  <div className="mt-6 bg-gradient-to-br from-orange-800/40 to-amber-800/40 rounded-xl p-4 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <ChefHat className="h-5 w-5 text-orange-400" />
                      <h3 className="text-sm font-medium text-orange-300">스마트 레시피 채팅</h3>
                    </div>
                    <ul className="text-xs text-orange-200 space-y-2">
                      <li className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span>실시간 레시피 추천</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span>알레르기 맞춤 필터링</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <UtensilsCrossed className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span>요리 단계별 안내</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span>대화형 레시피 검색</span>
                      </li>
                    </ul>

                    <div className="mt-3 p-3 bg-black/20 rounded-lg border border-amber-500/20">
                      <div className="text-xs text-amber-300 font-medium mb-1">팁! 이렇게 물어보세요:</div>
                      <div className="text-xs text-amber-200 break-words">
                        "닭가슴살로 간단한 30분 요리 추천해주세요"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Sidebar Footer */}
                <div className="p-4 border-t border-orange-500/30">
                  <button
                      onClick={() => {
                        logout();
                        closeMobileSidebar();
                      }}
                      className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Desktop Sidebar - 데스크톱에서만 표시 */}
        <div className="hidden md:flex w-80 bg-gradient-to-b from-orange-900/90 to-amber-900/90 backdrop-blur-sm border-r border-orange-500/30 flex-col">
          {/* Desktop Header */}
          <div className="p-6 border-b border-orange-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ChefHat className="h-8 w-8 text-orange-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  AI Recipe Chat
                </h1>
              </div>
              <button
                  onClick={logout}
                  className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* 연결 상태 */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-black/20 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2">
                {isConnected ? (
                    <>
                      <Wifi className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">연결됨</span>
                    </>
                ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400 font-medium">연결 끊김</span>
                    </>
                )}
              </div>
              <div className="w-px h-4 bg-orange-500/30"></div>
              <UtensilsCrossed className="h-4 w-4 text-orange-400" />
            </div>

            {/* 인증 상태 */}
            <div className="mb-4">
              {wsIsAuthenticated && authenticatedUser ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                    <ChefHat className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-emerald-400">셰프 인증 완료</div>
                      <div className="text-xs text-emerald-300">{authenticatedUser.name || authenticatedUser.email}</div>
                    </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                    <Users className="h-5 w-5 text-amber-400" />
                    <div>
                      <div className="text-sm font-medium text-amber-400">셰프 연결 중</div>
                      <div className="text-xs text-amber-300">잠시만 기다려주세요...</div>
                    </div>
                  </div>
              )}
            </div>

            {connectionError && (
                <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30 text-xs text-red-300">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3 w-3" />
                    <span className="font-medium">연결 오류</span>
                  </div>
                  {connectionError}
                </div>
            )}
          </div>

          {/* Desktop Controls */}
          <div className="p-6 space-y-4">
            <div className="text-sm font-medium text-orange-300 mb-3 flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span>셰프 도구</span>
            </div>


            <button
                onClick={() => {
                  window.location.href = '/recipes';
                }}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-blue-700/30 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 mb-4"
            >
              <Search className="h-4 w-4" />
              <span>레시피 검색</span>
            </button>


            <button
                onClick={() => {
                  window.location.href = '/bookmarks';
                }}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50 mb-4"
            >
              <Heart className="h-4 w-4" />
              <span>내 북마크</span>
            </button>

            <button
                onClick={clearHistory}
                disabled={!isConnected || !wsIsAuthenticated}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-orange-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/30 hover:border-orange-500/50"
            >
              <Trash2 className="h-4 w-4" />
              <span>레시피 대화 지우기</span>
            </button>

            <button
                onClick={() => setIsAllergySidebarOpen(true)}
                disabled={!wsIsAuthenticated}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
            >
              <Shield className="h-4 w-4" />
              <span>알레르기 설정</span>
            </button>

            <button
                onClick={() => setIsCookingLevelSidebarOpen(true)}
                disabled={!wsIsAuthenticated}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-amber-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/30 hover:border-amber-500/50"
            >
              <Star className="h-4 w-4" />
              <span>요리 수준 설정</span>
            </button>

            {!isConnected && (
                <button
                    onClick={reconnect}
                    className="w-full flex items-center justify-center gap-3 p-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-200 border border-amber-500/50 hover:border-amber-400"
                >
                  <Wifi className="h-4 w-4" />
                  <span>셰프와 다시 연결</span>
                </button>
            )}

            {/* Recipe Tips */}
            <div className="mt-4 bg-gradient-to-br from-orange-800/40 to-amber-800/40 rounded-xl p-4 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="h-5 w-5 text-orange-400" />
                <h3 className="text-sm font-medium text-orange-300">스마트 레시피 채팅</h3>
              </div>
              <ul className="text-xs text-orange-200 space-y-2">
                <li className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span>실시간 레시피 추천</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span>알레르기 맞춤 필터링</span>
                </li>
                <li className="flex items-center gap-2">
                  <UtensilsCrossed className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span>요리 단계별 안내</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span>대화형 레시피 검색</span>
                </li>
              </ul>

              <div className="mt-3 p-3 bg-black/20 rounded-lg border border-amber-500/20">
                <div className="text-xs text-amber-300 font-medium mb-1">팁! 이렇게 물어보세요:</div>
                <div className="text-xs text-amber-200 break-words">
                  "닭가슴살로 간단한 30분 요리 추천해주세요"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area - 메인 레시피 채팅 영역 */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-black/10 to-black/20 backdrop-blur-sm">
          {/* Messages - 모바일 패딩 조정 */}
          <div className="flex-1 overflow-y-auto p-4 pt-20 pb-32 md:pt-6 md:p-6">
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
              {/* 대화 기록 로드 중 표시 */}
              {isLoadingHistory && (
                  <div className="text-center py-8 md:py-16">
                    <div className="relative mb-6 md:mb-8">
                      <div className="text-4xl md:text-6xl mb-4 animate-pulse">📜</div>
                      <div className="absolute -top-2 -right-2 text-lg md:text-2xl animate-spin">⚙️</div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-amber-400">
                      이전 요리 대화 불러오는 중...
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <p className="text-orange-200 text-sm px-4">
                      지난 레시피 대화를 불러오고 있어요. 잠시만 기다려주세요!
                    </p>
                  </div>
              )}

              {/* 대화 기록 로드 완료 후 메시지가 있을 때 */}
              {messages.length > 0 && (
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      <span>이전 대화 {messages.length}개를 불러왔어요! 계속 대화해보세요 🍳</span>
                    </div>
                  </div>
              )}

              {messages.length === 0 && !isLoadingHistory && (
                  <div className="text-center py-8 md:py-16 px-4">
                    <div className="relative mb-6 md:mb-8">
                      <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">🍳</div>
                      <div className="absolute -top-2 -right-2 text-xl md:text-2xl animate-spin-slow">✨</div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                      AI 셰프와 요리 대화
                    </h2>
                    <p className="text-orange-200 text-base md:text-lg mb-6">
                      맛있는 레시피를 찾고 있나요? 지금 바로 시작해보세요!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto mb-6 md:mb-8">
                      <div className="flex items-center gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                        <Clock className="h-4 md:h-5 w-4 md:w-5 text-amber-400 flex-shrink-0" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-orange-300">빠른 레시피</div>
                          <div className="text-xs text-orange-200">30분 이내 요리</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-emerald-900/30 rounded-lg border border-emerald-500/30">
                        <Users className="h-4 md:h-5 w-4 md:w-5 text-emerald-400 flex-shrink-0" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-emerald-300">알레르기 배려</div>
                          <div className="text-xs text-emerald-200">안전한 요리</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-6 md:mb-8">
                      {['닭가슴살 요리', '파스타 레시피', '다이어트 식단', '간단 요리'].map((tag) => (
                          <span
                              key={tag}
                              className="px-3 py-2 bg-amber-900/30 text-amber-300 rounded-full text-sm border border-amber-500/30 hover:bg-amber-800/30 transition-colors cursor-pointer touch-manipulation"
                              onClick={() => {
                                if (isConnected && wsIsAuthenticated) {
                                  setInput(tag + ' 추천해주세요');
                                }
                              }}
                          >
                            {tag}
                          </span>
                      ))}
                    </div>
                    <div className="text-sm">
                      {isConnected ? (
                          wsIsAuthenticated ? (
                              <span className="text-emerald-400 flex items-center justify-center gap-2">
                                <ChefHat className="h-4 w-4" />
                                준비 완료! 레시피를 물어보세요
                              </span>
                          ) : (
                              <span className="text-amber-400 flex items-center justify-center gap-2">
                                <Users className="h-4 w-4" />
                                셰프 인증 중... 잠시만 기다려주세요
                              </span>
                          )
                      ) : (
                          <span className="text-red-400 flex items-center justify-center gap-2">
                            <Wifi className="h-4 w-4" />
                            셰프와 연결 중... 잠시만 기다려주세요
                          </span>
                      )}
                    </div>
                  </div>
              )}

              {messages.map((message) => (
                  <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                        className={`max-w-full md:max-w-3xl p-4 md:p-5 rounded-2xl relative ${
                            message.isUser
                                ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-orange-500/20 shadow-lg shadow-black/20'
                        }`}
                    >
                      {/* 사용자/AI 아이콘 */}
                      <div className={`absolute -top-2 ${message.isUser ? '-right-2' : '-left-2'} w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser
                              ? 'bg-amber-500 text-white'
                              : 'bg-orange-500 text-white'
                      }`}>
                        {message.isUser ? <Users className="h-4 w-4" /> : <ChefHat className="h-4 w-4" />}
                      </div>

                      {message.isUser ? (
                          // 사용자 메시지는 일반 텍스트
                          <div className="whitespace-pre-wrap text-base break-words leading-relaxed">{message.content}</div>
                      ) : (
                          // AI 메시지 처리 - 새로운 conversation workflow 우선 처리
                          <div>
                            {(() => {
                              // 1. 새로운 백엔드에서 detailedRecipe가 왔을 때 우선 처리
                              if (message.metadata?.conversationType === 'recipe_detail' && 
                                  message.metadata?.recipeData && 
                                  message.metadata.recipeData.length > 0 && 
                                  message.metadata.recipeData[0].ingredients) {
                                
                                const detailedRecipe = message.metadata.recipeData[0];
                                // 백엔드 데이터를 RecipeDetailCard 형식으로 변환
                                const recipeForCard = {
                                  title: detailedRecipe.title,
                                  description: detailedRecipe.description,
                                  cookingTime: detailedRecipe.cookingTime || detailedRecipe.totalTime,
                                  prepTime: detailedRecipe.prepTime,
                                  difficulty: detailedRecipe.difficulty,
                                  servings: detailedRecipe.servings,
                                  rating: detailedRecipe.rating,
                                  ingredients: (detailedRecipe.ingredients || []).map((ing: any) => {
                                    if (typeof ing === 'string') {
                                      return ing;
                                    }
                                    // 객체인 경우 문자열로 변환
                                    if (ing.amount && ing.unit && ing.name) {
                                      return `${ing.amount}${ing.unit} ${ing.name}`;
                                    } else if (ing.name) {
                                      return ing.name;
                                    } else {
                                      return String(ing); // 마지막 fallback
                                    }
                                  }),
                                  steps: (detailedRecipe.instructions || []).map((inst: any) => ({
                                    step: inst.stepNumber,
                                    instruction: inst.instruction,
                                    time: inst.estimatedTime,
                                    tip: inst.tips ? inst.tips.join(' ') : undefined,
                                  })),
                                  tips: detailedRecipe.tips || [],
                                  nutritionInfo: detailedRecipe.nutritionInfo,
                                  tags: detailedRecipe.tags || []
                                };
                                
                                return (
                                  <div className="space-y-6">
                                    {/* AI 응답 요약 */}
                                    <div className="p-4 bg-gradient-to-r from-orange-900/40 to-amber-900/40 rounded-xl border border-orange-500/30">
                                      <div className="flex items-center gap-2 mb-2">
                                        <ChefHat className="h-4 w-4 text-orange-400" />
                                        <span className="text-sm font-medium text-orange-200">AI 셰프의 완전한 레시피</span>
                                        <div className="px-2 py-1 bg-emerald-600/30 text-emerald-300 rounded-full text-xs ml-auto">
                                          recipe_detail
                                        </div>
                                      </div>
                                      <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                          {message.content}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                    
                                    {/* 완전한 레시피 카드 - 백엔드 데이터 사용 */}
                                    <RecipeDetailCard 
                                      recipe={recipeForCard}
                                      onBookmark={() => {
                                        console.log('Bookmark recipe:', recipeForCard.title);
                                        // TODO: 북마크 기능 구현
                                      }}
                                      onShare={() => {
                                        console.log('Share recipe:', recipeForCard.title);
                                        // TODO: 공유 기능 구현
                                      }}
                                    />
                                  </div>
                                );
                              }
                              
                              // 2. 기존 텍스트 파싱 로직 (백엔드 데이터가 없을 때 폴백)
                              const recipeContentScore = getRecipeContentScoreAdvanced(message.content);
                              const hasDetailedRecipe = hasRecipeContentAdvanced(message.content) && recipeContentScore > 0.4;
                              
                              if (hasDetailedRecipe) {
                                const parsedRecipe = parseRecipeFromTextAdvanced(message.content);
                                if (parsedRecipe) {
                                  return (
                                    <div className="space-y-6">
                                      {/* AI 응답 요약 */}
                                      <div className="p-4 bg-gradient-to-r from-orange-900/40 to-amber-900/40 rounded-xl border border-orange-500/30">
                                        <div className="flex items-center gap-2 mb-2">
                                          <ChefHat className="h-4 w-4 text-orange-400" />
                                          <span className="text-sm font-medium text-orange-200">AI 셰프의 추천 (파싱)</span>
                                          <div className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs ml-auto">
                                            텍스트 파싱
                                          </div>
                                        </div>
                                        <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.content.split('\n').slice(0, 2).join('\n')}
                                          </ReactMarkdown>
                                        </div>
                                      </div>
                                      
                                      {/* 완전한 레시피 카드 */}
                                      <RecipeDetailCard 
                                        recipe={parsedRecipe}
                                        onBookmark={() => {
                                          console.log('Bookmark recipe:', parsedRecipe.title);
                                          // TODO: 북마크 기능 구현
                                        }}
                                        onShare={() => {
                                          console.log('Share recipe:', parsedRecipe.title);
                                          // TODO: 공유 기능 구현
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              }
                              
                              // 3. 일반 마크다운 렌더링
                              return (
                                <div className="prose prose-invert prose-blue max-w-none prose-base leading-relaxed">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              );
                            })()}
                          </div>
                      )}

                      {/* 향상된 후속 질문 - 대화 유형별 구분 */}
                      {!message.isUser && message.metadata?.suggestedFollowups && message.metadata.suggestedFollowups.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-orange-500/20">
                            <div className="text-xs text-orange-300 mb-2 flex items-center gap-2">
                              {message.metadata.conversationType === 'general_chat' && (
                                <>💬 다음 대화 제안:</>
                              )}
                              {message.metadata.conversationType === 'recipe_list' && (
                                <>🍳 레시피 관련 질문:</>
                              )}
                              {message.metadata.conversationType === 'recipe_detail' && (
                                <>👨‍🍳 조리법 궁금한 점:</>
                              )}
                              {message.metadata.conversationType === 'recipe_query' && (
                                <>🔍 레시피 검색 관련:</>
                              )}
                              {!message.metadata.conversationType && (
                                <>💡 이런 질문도 해보세요:</>
                              )}
                              {message.metadata.confidence && (
                                <span className="text-amber-400 text-xs ml-auto">
                                  신뢰도 {Math.round(message.metadata.confidence * 100)}%
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.metadata.suggestedFollowups.map((followup, index) => (
                                  <button
                                      key={index}
                                      onClick={() => sendQuickReply(followup)}
                                      disabled={!canSendMessage}
                                      className="px-3 py-1 bg-amber-900/30 text-amber-300 rounded-full text-xs border border-amber-500/30 hover:bg-amber-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {followup}
                                  </button>
                              ))}
                            </div>
                          </div>
                      )}

                      {/* 향상된 레시피 카드 - 대화 유형별 맞춤 헤더 */}
                      {(() => {
                        console.log('🔍 CHAT PAGE DEBUG - Recipe render check:', {
                          messageId: message.id,
                          isUser: message.isUser,
                          hasMetadata: !!message.metadata,
                          conversationType: message.metadata?.conversationType,
                          hasRecipeData: !!message.metadata?.recipeData,
                          recipeDataLength: message.metadata?.recipeData?.length || 0,
                          recipeDataSample: message.metadata?.recipeData?.slice(0, 1),
                          willRenderRecipeCards: !message.isUser && !!message.metadata?.recipeData && message.metadata.recipeData.length > 0
                        });
                        return null;
                      })()}
                      {!message.isUser && message.metadata?.recipeData && message.metadata.recipeData.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-orange-500/20">
                            <div className="flex items-center gap-3 text-sm text-orange-200 mb-5">
                              <div className="flex items-center gap-2">
                                <ChefHat className="h-4 w-4 text-orange-400" />
                                <span className="font-semibold">
                                  {message.metadata.conversationType === 'recipe_list' && '🍳 추천 레시피 목록'}
                                  {message.metadata.conversationType === 'recipe_detail' && '👨‍🍳 완성된 레시피'}
                                  {message.metadata.conversationType === 'recipe_query' && '🔍 레시피 검색 결과'}
                                  {!message.metadata.conversationType && '맞춤 레시피 추천'}
                                </span>
                              </div>
                              <div className="px-3 py-1 bg-orange-600/30 text-orange-300 rounded-full text-xs font-medium">
                                {message.metadata.recipeData.length}개
                              </div>
                              {message.metadata.conversationType && (
                                <div className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs">
                                  {message.metadata.conversationType}
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                              {message.metadata.recipeData.slice(0, 6).map((recipe, index) => (
                                  <div 
                                    key={recipe.id || index} 
                                    className="group relative p-5 bg-gradient-to-br from-orange-950/50 to-amber-950/40 rounded-2xl border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-orange-500/20 hover:scale-[1.02] overflow-hidden"
                                    onClick={() => {
                                      if (recipe.id) {
                                        window.open(`/recipes/${recipe.id}`, '_blank');
                                      } else {
                                        console.log('Recipe details:', recipe);
                                      }
                                    }}
                                  >
                                    {/* 배경 그라데이션 효과 */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* 레시피 헤더 */}
                                    <div className="relative z-10 mb-4">
                                      <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-orange-100 text-base leading-tight group-hover:text-white transition-colors line-clamp-2">
                                          {recipe.nameKo || recipe.name || recipe.title || '맛있는 레시피'}
                                        </h3>
                                        {recipe.averageRating && (
                                          <div className="flex items-center gap-1 bg-amber-600/30 px-2 py-1 rounded-full">
                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                            <span className="text-xs text-yellow-300 font-medium">
                                              {recipe.averageRating.toFixed(1)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* 레시피 설명 */}
                                      {(recipe.descriptionKo || recipe.description) && (
                                        <p className="text-sm text-orange-300/90 leading-relaxed line-clamp-2 mb-3">
                                          {recipe.descriptionKo || recipe.description}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {/* 레시피 메타 정보 */}
                                    <div className="relative z-10 flex items-center gap-4 mb-4">
                                      {/* 조리시간 */}
                                      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-800/40 rounded-lg">
                                        <Clock className="h-3 w-3 text-amber-400" />
                                        <span className="text-xs text-amber-300 font-medium">
                                          {recipe.minutes ? `${recipe.minutes}분` : '시간미정'}
                                        </span>
                                      </div>
                                      
                                      {/* 난이도 */}
                                      {recipe.difficulty && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-800/40 rounded-lg">
                                          <UtensilsCrossed className="h-3 w-3 text-green-400" />
                                          <span className="text-xs text-green-300 font-medium">{recipe.difficulty}</span>
                                        </div>
                                      )}
                                      
                                      {/* 인분수 */}
                                      {recipe.servings && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-800/40 rounded-lg">
                                          <Users className="h-3 w-3 text-blue-400" />
                                          <span className="text-xs text-blue-300 font-medium">{recipe.servings}인분</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* 주요 재료 */}
                                    {(recipe.ingredientsKo || recipe.ingredients || []).length > 0 && (
                                      <div className="relative z-10 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xs text-orange-200/80 font-medium">주요 재료</span>
                                          <div className="flex-1 h-px bg-orange-500/20"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {(recipe.ingredientsKo || recipe.ingredients || []).slice(0, 4).map((ingredient, idx) => (
                                            <span key={idx} className="text-xs bg-orange-700/40 text-orange-200 px-2.5 py-1 rounded-full border border-orange-600/30">
                                              {typeof ingredient === 'string' 
                                                ? ingredient 
                                                : (ingredient as any)?.name 
                                                ? `${(ingredient as any).amount || ''}${(ingredient as any).unit || ''} ${(ingredient as any).name}`.trim()
                                                : String(ingredient)
                                              }
                                            </span>
                                          ))}
                                          {(recipe.ingredientsKo || recipe.ingredients || []).length > 4 && (
                                            <span className="text-xs text-orange-300/70 px-2 py-1">
                                              +{(recipe.ingredientsKo || recipe.ingredients || []).length - 4}개 더
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* 액션 버튼 영역 */}
                                    <div className="relative z-10 flex items-center justify-between pt-3 border-t border-orange-500/20">
                                      <div className="flex items-center gap-2 text-xs text-orange-300/80">
                                        <MessageSquare className="h-3 w-3" />
                                        <span>클릭하여 자세히 보기</span>
                                      </div>
                                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-400/30">
                                          <ArrowLeft className="h-4 w-4 text-orange-300 rotate-180" />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 북마크 버튼 */}
                                    <button 
                                      className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Bookmark recipe:', recipe.id);
                                      }}
                                    >
                                      <Heart className="h-4 w-4 text-orange-300 hover:text-red-400 transition-colors" />
                                    </button>
                                  </div>
                              ))}
                            </div>
                            
                            {/* 더 많은 레시피 보기 버튼 */}
                            {message.metadata.recipeData.length > 6 && (
                              <div className="mt-5 text-center">
                                <button 
                                  className="px-6 py-3 bg-gradient-to-r from-orange-600/80 to-amber-600/80 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto border border-orange-500/30 hover:border-orange-400/50"
                                  onClick={() => {
                                    console.log('Show more recipes');
                                  }}
                                >
                                  <Search className="h-4 w-4" />
                                  <span>더 많은 레시피 보기 ({message.metadata.recipeData.length - 6}개)</span>
                                </button>
                              </div>
                            )}
                          </div>
                      )}

                      {/* 메시지 타임스탬프 */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 pt-3 border-t border-orange-500/20 gap-2 md:gap-0">
                        <div className="text-xs opacity-70 flex items-center gap-2">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                          {message.isUser && (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <span>✓</span>
                                <span>전송됨</span>
                              </span>
                          )}
                        </div>
                        {!message.isUser && (
                            <div className="text-xs text-orange-400 flex items-center gap-1">
                              <ChefHat className="h-3 w-3 flex-shrink-0" />
                              <span>AI 셰프</span>
                              {message.metadata?.conversationType && (
                                  <span className="ml-1 text-amber-400">
                                    • {message.metadata.conversationType === 'general_chat' ? '일반대화' : 
                                        message.metadata.conversationType === 'recipe_list' ? '레시피추천' :
                                        message.metadata.conversationType === 'recipe_detail' ? '상세조리법' : 
                                        message.metadata.conversationType === 'recipe_query' ? '레시피검색' :
                                        message.metadata.conversationType}
                                  </span>
                              )}
                              {message.metadata?.confidence && (
                                  <span className="ml-1 text-emerald-400">
                                    • {Math.round(message.metadata.confidence * 100)}%
                                  </span>
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}

              {(isTyping || isStreaming) && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-5 rounded-2xl border border-orange-500/20 shadow-lg relative max-w-full md:max-w-md">
                      {/* AI 셰프 아이콘 */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <ChefHat className="h-4 w-4 text-white" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="text-sm text-orange-300 font-medium flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 flex-shrink-0" />
                          <span className="break-words">
                            {isStreaming 
                              ? "AI 셰프가 실시간으로 답변을 작성하고 있어요..." 
                              : "AI 셰프가 레시피를 준비하고 있어요..."
                            }
                          </span>
                        </span>
                      </div>
                      
                      {/* 대화 단계 표시 - 새로운 워크플로우 단계 반영 */}
                      {currentStage && (
                          <div className="mt-2 pt-2 border-t border-orange-500/20">
                            <div className="text-xs text-amber-300 flex items-center gap-2">
                              <span>🧠</span>
                              <span>
                                {currentStage === 'enhanced_intent_analysis' && '의도 분석 중...'}
                                {currentStage === 'conversation_general_chat' && '일반 대화 처리 중...'}
                                {currentStage === 'conversation_recipe_list' && '레시피 목록 생성 중...'}
                                {currentStage === 'conversation_recipe_detail' && '상세 조리법 준비 중...'}
                                {currentStage === 'completed' && '응답 완료'}
                                {!['enhanced_intent_analysis', 'conversation_general_chat', 'conversation_recipe_list', 'conversation_recipe_detail', 'completed'].includes(currentStage) && 
                                  `${currentStage} 처리 중...`}
                              </span>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - 레시피 입력창 (모바일 최적화) */}
          <div className="border-t border-orange-500/30 p-4 md:p-6 bg-gradient-to-r from-orange-900/20 to-amber-900/20 backdrop-blur-sm safe-area-bottom">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <div className="absolute left-4 top-4 text-orange-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isConnected && wsIsAuthenticated ? "레시피를 물어보세요... (예: 닭가슴살로 요리 추천해주세요)" : "셰프와 대화하려면 로그인이 필요해요..."}
                      className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none text-white placeholder-orange-300/50 backdrop-blur-sm text-base leading-relaxed min-h-[56px]"
                      rows={1}
                      disabled={!isConnected || !wsIsAuthenticated || isTyping}
                      style={{ maxHeight: '120px' }}
                  />
                  {(!isConnected || !wsIsAuthenticated) && (
                      <div className="absolute inset-0 bg-gray-800/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-sm text-orange-300 flex items-center gap-2 px-4">
                          {!isConnected ? (
                              <>
                                <Wifi className="h-4 w-4 flex-shrink-0" />
                                <span>셰프와 연결 중...</span>
                              </>
                          ) : (
                              <>
                                <Users className="h-4 w-4 flex-shrink-0" />
                                <span>로그인 필요...</span>
                              </>
                          )}
                        </span>
                      </div>
                  )}
                </div>

                <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !wsIsAuthenticated || isTyping || !input.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-white font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 border border-orange-500/30 text-base touch-manipulation"
                >
                  {isTyping ? (
                      <>
                        <UtensilsCrossed className="h-5 w-5 animate-spin flex-shrink-0" />
                        <span>요리 중...</span>
                      </>
                  ) : (
                      <>
                        <Send className="h-5 w-5 flex-shrink-0" />
                        <span>레시피 요청</span>
                      </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-xs text-center px-4 space-y-2">
                {isConnected ? (
                    wsIsAuthenticated ? (
                        <div className="space-y-1">
                          <span className="text-emerald-400 flex items-center justify-center gap-2">
                            <ChefHat className="h-3 w-3 flex-shrink-0" />
                            <span>AI 셰프와 연결되어 레시피 대화 준비 완료!</span>
                          </span>
                          {sessionId && (
                              <div className="text-orange-300 flex items-center justify-center gap-2">
                                <MessageSquare className="h-3 w-3 flex-shrink-0" />
                                <span>대화 세션: {sessionId.slice(-8)}</span>
                              </div>
                          )}
                          {currentStage && (
                              <div className="text-amber-300 flex items-center justify-center gap-2">
                                <span>🎯</span>
                                <span>대화 단계: {currentStage}</span>
                              </div>
                          )}
                        </div>
                    ) : (
                        <span className="text-amber-400 flex items-center justify-center gap-2">
                          <Users className="h-3 w-3 flex-shrink-0" />
                          <span className="break-words">셰프 인증 중... 잠시만 기다려주세요</span>
                        </span>
                    )
                ) : (
                    <span className="text-red-400 flex items-center justify-center gap-2">
                      <Wifi className="h-3 w-3 flex-shrink-0" />
                      <span>AI 셰프와 연결 시도 중...</span>
                    </span>
                )}
                
                {/* 하이브리드 시스템 정보 */}
                <div className="text-orange-400 flex items-center justify-center gap-2">
                  <span>🔄</span>
                  <span>하이브리드 시스템: REST 히스토리 + WebSocket 실시간</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 알레르기 설정 사이드바 */}
        <AllergySettingsSidebar
            isOpen={isAllergySidebarOpen}
            onClose={() => setIsAllergySidebarOpen(false)}
        />

        {/* 쿠킹 레벨 설정 사이드바 */}
        <CookingLevelSidebar
            isOpen={isCookingLevelSidebarOpen}
            onClose={() => setIsCookingLevelSidebarOpen(false)}
        />
      </div>
  );
}