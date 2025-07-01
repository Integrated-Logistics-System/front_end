'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';
import { AllergySettingsSidebar } from '@/components/ui/AllergySettingsSidebar';
import {CookingLevelSidebar} from "@/components/settings/CookingLevelSidebar";

export default function WebSocketChatPage() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState('');
  const [isAllergySidebarOpen, setIsAllergySidebarOpen] = useState(false);
  const [isCookingLevelSidebarOpen, setIsCookingLevelSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isAuthenticated,
    authenticatedUser,
    isTyping,
    messages,
    connectionError,
    isLoadingHistory,
    sendMessage,
    clearHistory,
    reconnect,
  } = useWebSocketChat({
    userId: user?.id,
    token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim() || !isConnected) return;

    sendMessage(input);
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

  if (!user) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
          <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-orange-500/30 max-w-md w-full">
            <ChefHat className="h-12 w-12 md:h-16 md:w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              AI Recipe Assistant
            </h1>
            <p className="text-orange-200 mb-4 md:mb-6 text-sm md:text-base">맛있는 요리를 위한 AI 셰프가 기다리고 있어요!</p>
            <p className="text-amber-300 text-sm md:text-base">로그인 후 개인화된 레시피 추천을 받아보세요 🍳</p>
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
                    {isAuthenticated && authenticatedUser ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                          <ChefHat className="h-5 w-5 text-emerald-400" />
                          <div>
                            <div className="text-sm font-medium text-emerald-400">셰프 인증 완료</div>
                            <div className="text-xs text-emerald-300">{authenticatedUser.name || authenticatedUser.email}</div>
                          </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                          <Users className="h-5 w-5 text-red-400" />
                          <div>
                            <div className="text-sm font-medium text-red-400">게스트 모드</div>
                            <div className="text-xs text-red-300">로그인 필요</div>
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
                        clearHistory();
                        closeMobileSidebar();
                      }}
                      disabled={!isConnected || !isAuthenticated}
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
                      disabled={!isAuthenticated}
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
                      disabled={!isAuthenticated}
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
              {isAuthenticated && authenticatedUser ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                    <ChefHat className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-emerald-400">셰프 인증 완료</div>
                      <div className="text-xs text-emerald-300">{authenticatedUser.name || authenticatedUser.email}</div>
                    </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <Users className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="text-sm font-medium text-red-400">게스트 모드</div>
                      <div className="text-xs text-red-300">로그인 필요</div>
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
                onClick={clearHistory}
                disabled={!isConnected || !isAuthenticated}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-orange-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/30 hover:border-orange-500/50"
            >
              <Trash2 className="h-4 w-4" />
              <span>레시피 대화 지우기</span>
            </button>

            <button
                onClick={() => setIsAllergySidebarOpen(true)}
                disabled={!isAuthenticated}
                className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
            >
              <Shield className="h-4 w-4" />
              <span>알레르기 설정</span>
            </button>

            <button
                onClick={() => setIsCookingLevelSidebarOpen(true)}
                disabled={!isAuthenticated}
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
          <div className="flex-1 overflow-y-auto p-4 pt-20 md:pt-6 md:p-6">
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
                                if (isConnected && isAuthenticated) {
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
                          isAuthenticated ? (
                              <span className="text-emerald-400 flex items-center justify-center gap-2">
                                <ChefHat className="h-4 w-4" />
                                준비 완료! 레시피를 물어보세요
                              </span>
                          ) : (
                              <span className="text-amber-400 flex items-center justify-center gap-2">
                                <Users className="h-4 w-4" />
                                연결됨 - 로그인 후 개인화 서비스 이용 가능
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
                          // AI 메시지는 마크다운 렌더링
                          <div className="prose prose-invert prose-blue max-w-none prose-base leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
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
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}

              {isTyping && (
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
                          <span className="break-words">AI 셰프가 레시피를 준비하고 있어요...</span>
                        </span>
                      </div>
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
                      placeholder={isConnected && isAuthenticated ? "레시피를 물어보세요... (예: 닭가슴살로 요리 추천해주세요)" : "셰프와 대화하려면 로그인이 필요해요..."}
                      className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none text-white placeholder-orange-300/50 backdrop-blur-sm text-base leading-relaxed min-h-[56px]"
                      rows={1}
                      disabled={!isConnected || !isAuthenticated || isTyping}
                      style={{ maxHeight: '120px' }}
                  />
                  {(!isConnected || !isAuthenticated) && (
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
                    disabled={!isConnected || !isAuthenticated || isTyping || !input.trim()}
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

              <div className="mt-4 text-xs text-center px-4">
                {isConnected ? (
                    isAuthenticated ? (
                        <span className="text-emerald-400 flex items-center justify-center gap-2">
                          <ChefHat className="h-3 w-3 flex-shrink-0" />
                          <span>AI 셰프와 연결되어 레시피 대화 준비 완료!</span>
                        </span>
                    ) : (
                        <span className="text-amber-400 flex items-center justify-center gap-2">
                          <Users className="h-3 w-3 flex-shrink-0" />
                          <span className="break-words">연결됨 - 로그인 후 개인화된 레시피 서비스 이용 가능</span>
                        </span>
                    )
                ) : (
                    <span className="text-red-400 flex items-center justify-center gap-2">
                      <Wifi className="h-3 w-3 flex-shrink-0" />
                      <span>AI 셰프와 연결 시도 중...</span>
                    </span>
                )}
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