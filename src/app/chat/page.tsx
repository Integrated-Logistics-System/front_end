'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
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
  Star
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
  const [isCookingLevelSidebarOpen, setIsCookingLevelSidebarOpen] = useState(false); // 추가
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isAuthenticated,
    authenticatedUser,
    isTyping,
    messages,
    connectionError,
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center">
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
          <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            AI Recipe Assistant
          </h1>
          <p className="text-orange-200 mb-6">맛있는 요리를 위한 AI 셰프가 기다리고 있어요!</p>
          <p className="text-amber-300">로그인 후 개인화된 레시피 추천을 받아보세요 🍳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white">
      {/* Sidebar - 요리 테마 */}
      <div className="w-80 bg-gradient-to-b from-orange-900/90 to-amber-900/90 backdrop-blur-sm border-r border-orange-500/30 flex flex-col">
        {/* Header */}
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

        {/* Controls - 요리 도구 */}
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
          
          {/* 알레르기 설정 버튼 */}
          <button
            onClick={() => setIsAllergySidebarOpen(true)}
            disabled={!isAuthenticated}
            className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
          >
            <Shield className="h-4 w-4" />
            <span>알레르기 설정</span>
          </button>

          {/* 🆕 쿠킹 레벨 설정 버튼 추가 */}
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
        </div>

        {/* Recipe Tips - 요리 팁 */}
        <div className="flex-1 p-6">
          <div className="bg-gradient-to-br from-orange-800/40 to-amber-800/40 rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="h-5 w-5 text-orange-400" />
              <h3 className="text-sm font-medium text-orange-300">스마트 레시피 채팅</h3>
            </div>
            <ul className="text-xs text-orange-200 space-y-2">
              <li className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-amber-400" />
                <span>실시간 레시피 추천</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-3 w-3 text-amber-400" />
                <span>알레르기 맞춤 필터링</span>
              </li>
              <li className="flex items-center gap-2">
                <UtensilsCrossed className="h-3 w-3 text-amber-400" />
                <span>요리 단계별 안내</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-amber-400" />
                <span>대화형 레시피 검색</span>
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-black/20 rounded-lg border border-amber-500/20">
              <div className="text-xs text-amber-300 font-medium mb-1">팁! 이렇게 물어보세요:</div>
              <div className="text-xs text-amber-200">
                "닭가슴살로 간단한 30분 요리 추천해주세요"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area - 메인 레시피 채팅 영역 */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-black/10 to-black/20 backdrop-blur-sm">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="text-8xl mb-4 animate-bounce-slow">🍳</div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  AI 셰프와 요리 대화
                </h2>
                <p className="text-orange-200 text-lg mb-6">
                  맛있는 레시피를 찾고 있나요? 지금 바로 시작해보세요!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                  <div className="flex items-center gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-orange-300">빠른 레시피</div>
                      <div className="text-xs text-orange-200">30분 이내 요리</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/30 rounded-lg border border-emerald-500/30">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-emerald-300">알레르기 배려</div>
                      <div className="text-xs text-emerald-200">안전한 요리</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {['닭가슴살 요리', '파스타 레시피', '다이어트 식단', '간단 요리'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-amber-900/30 text-amber-300 rounded-full text-xs border border-amber-500/30 hover:bg-amber-800/30 transition-colors cursor-pointer"
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
                  className={`max-w-3xl p-5 rounded-2xl relative ${
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
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    // AI 메시지는 마크다운 렌더링
                    <div className="prose prose-invert prose-blue max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold mb-3 text-orange-300 border-b border-orange-700/50 pb-2 flex items-center gap-2">
                              <ChefHat className="h-5 w-5" />
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-bold mb-2 text-amber-300 flex items-center gap-2">
                              <UtensilsCrossed className="h-4 w-4" />
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-bold mb-2 text-orange-400 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-3 leading-relaxed text-gray-200">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-none mb-3 space-y-2 pl-0">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-none mb-3 space-y-2 pl-0">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-500/20 hover:bg-orange-800/20 transition-colors">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="text-gray-200 flex-1">{children}</div>
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-amber-300 bg-amber-900/30 px-1 py-0.5 rounded">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-orange-300 bg-orange-900/20 px-1 rounded">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-700 px-2 py-1 rounded text-emerald-400 text-sm font-mono border border-gray-600">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-orange-500 pl-4 italic text-orange-200 mb-3 bg-orange-900/10 py-3 rounded-r-lg">
                              <div className="flex items-center gap-2 mb-2 text-orange-400">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-xs font-medium">셰프의 팁</span>
                              </div>
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {/* 메시지 타임스탬프 */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-500/20">
                    <div className="text-xs opacity-70 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
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
                        <ChefHat className="h-3 w-3" />
                        <span>AI 셰프</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-orange-500/20 shadow-lg relative">
                  {/* AI 셰프 아이콘 */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <span className="text-sm text-orange-300 font-medium flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      AI 셰프가 레시피를 준비하고 있어요...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - 레시피 입력창 */}
        <div className="border-t border-orange-500/30 p-6 bg-gradient-to-r from-orange-900/20 to-amber-900/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected && isAuthenticated ? "레시피를 물어보세요... (예: 닭가슴살로 요리 추천해주세요)" : "셰프와 대화하려면 로그인이 필요해요..."}
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none text-white placeholder-orange-300/50 backdrop-blur-sm"
                  rows={1}
                  disabled={!isConnected || !isAuthenticated || isTyping}
                />
                {(!isConnected || !isAuthenticated) && (
                  <div className="absolute inset-0 bg-gray-800/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm text-orange-300 flex items-center gap-2">
                      {!isConnected ? (
                        <>
                          <Wifi className="h-4 w-4" />
                          셰프와 연결 중...
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          로그인 필요...
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || !isAuthenticated || isTyping || !input.trim()}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center gap-3 text-white font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 border border-orange-500/30"
              >
                {isTyping ? (
                  <>
                    <UtensilsCrossed className="h-5 w-5 animate-spin" />
                    요리 중...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    레시피 요청
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-xs text-center">
              {isConnected ? (
                isAuthenticated ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-2">
                    <ChefHat className="h-3 w-3" />
                    AI 셰프와 연결되어 레시피 대화 준비 완료!
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center justify-center gap-2">
                    <Users className="h-3 w-3" />
                    연결됨 - 로그인 후 개인화된 레시피 서비스 이용 가능
                  </span>
                )
              ) : (
                <span className="text-red-400 flex items-center justify-center gap-2">
                  <Wifi className="h-3 w-3" />
                  AI 셰프와 연결 시도 중...
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
      {/* 🆕 쿠킹 레벨 설정 사이드바 추가 */}
      <CookingLevelSidebar
          isOpen={isCookingLevelSidebarOpen}
          onClose={() => setIsCookingLevelSidebarOpen(false)}
      />

    </div>
  );
}
