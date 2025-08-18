'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, ChefHat, Trash2, Clock, Settings, Wifi, WifiOff, Shield, Brain, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSimpleChat } from '@/hooks/useSimpleChat';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAllergiesState, cookingLevelState, connectionStatusState } from '@/store/chatStore';
import { AllergySettings } from '@/components/ui/AllergySettings';
import { CookingLevelSettings } from '@/components/ui/CookingLevelSettings';

export default function SimpleChatPage() {
  const [input, setInput] = useState('');
  const [showAllergySettings, setShowAllergySettings] = useState(false);
  const [showCookingLevelSettings, setShowCookingLevelSettings] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isReactMode, setIsReactMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, streamingMessage, sendMessage, clearChat, isStreaming } = useSimpleChat();
  const userAllergies = useRecoilValue(userAllergiesState);
  const cookingLevel = useRecoilValue(cookingLevelState);
  const connectionStatus = useRecoilValue(connectionStatusState);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input, isReactMode);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Hydration 오류 방지: 클라이언트에서만 렌더링
  if (!hydrated) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🍳</div>
          <div className="text-xl text-orange-300">AI 셰프 준비 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-80 bg-gradient-to-b from-orange-900/90 to-amber-900/90 backdrop-blur-sm border-r border-orange-500/30 flex-col p-6">
        <div className="flex items-center gap-3 mb-8">
          <ChefHat className="h-8 w-8 text-orange-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Recipe Chat
          </h1>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-3 bg-black/20 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-3">
            {connectionStatus.connected ? (
              <>
                <Wifi className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-green-300">백엔드 연결됨</div>
                  <div className="text-xs text-green-400/70">
                    ID: {connectionStatus.clientId?.slice(-8) || 'Unknown'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-sm font-medium text-red-300">백엔드 연결 끊김</div>
                  <div className="text-xs text-red-400/70">재연결 시도 중...</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ReAct Mode Toggle */}
        <div className="mb-6 p-4 bg-black/20 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-purple-300">AI 추론 모드</h3>
            <button
              onClick={() => setIsReactMode(!isReactMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                isReactMode ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isReactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {isReactMode ? (
              <>
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-purple-200">ReAct: 단계별 추론 과정 표시</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">일반: 빠른 응답</span>
              </>
            )}
          </div>
        </div>

        {/* User Settings */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-black/20 rounded-lg border border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-orange-300">요리 레벨</h3>
              <button
                onClick={() => setShowCookingLevelSettings(true)}
                className="p-1 text-orange-400 hover:text-orange-300 hover:bg-orange-700/20 rounded transition-colors"
                title="요리 레벨 설정"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
            <p className="text-orange-100">{cookingLevel}</p>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-red-300">알레르기</h3>
              <button
                onClick={() => setShowAllergySettings(true)}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-700/20 rounded transition-colors"
                title="알레르기 설정"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
            {userAllergies.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {userAllergies.map((allergy, index) => (
                  <span key={index} className="text-xs bg-red-700/40 text-red-200 px-2 py-1 rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-400/70">
                <Shield className="h-4 w-4" />
                <span>설정된 알레르기 없음</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={clearChat}
          className="w-full flex items-center justify-center gap-3 p-3 text-orange-300 hover:text-white hover:bg-orange-700/30 rounded-lg transition-all duration-200 border border-orange-500/30"
        >
          <Trash2 className="h-4 w-4" />
          <span>대화 지우기</span>
        </button>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-br from-orange-800/40 to-amber-800/40 rounded-xl p-4 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="h-5 w-5 text-orange-400" />
            <h3 className="text-sm font-medium text-orange-300">레시피 채팅 팁</h3>
          </div>
          <div className="text-xs text-orange-200 space-y-1">
            <p>• "닭가슴살 요리 추천해주세요"</p>
            <p>• "30분 이내 간단한 요리"</p>
            <p>• "다이어트 요리 알려주세요"</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && !isStreaming && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce-slow">🍳</div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  AI 셰프와 레시피 대화
                </h2>
                <p className="text-orange-200 text-lg mb-8">
                  맛있는 레시피를 찾고 있나요? 지금 바로 시작해보세요!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['김치찌개', '파스타', '샐러드', '디저트'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-2 bg-amber-900/30 text-amber-300 rounded-full text-sm border border-amber-500/30 hover:bg-amber-800/30 transition-colors cursor-pointer"
                      onClick={() => setInput(tag + ' 레시피 알려주세요')}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'human' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-5 rounded-2xl relative ${
                    message.type === 'human'
                      ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-orange-500/20'
                  }`}
                >
                  {/* Icon */}
                  <div className={`absolute -top-2 ${message.type === 'human' ? '-right-2' : '-left-2'} w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'human' ? 'bg-amber-500' : 'bg-orange-500'
                  }`}>
                    {message.type === 'human' ? '👤' : '🧑‍🍳'}
                  </div>

                  {/* Content */}
                  {message.type === 'human' ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                  ) : (
                    <div className="prose prose-invert max-w-none leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Recipes */}
                  {!message.type.includes('human') && message.recipes && message.recipes.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-orange-500/20">
                      <div className="flex items-center gap-2 text-orange-200 mb-4">
                        <ChefHat className="h-4 w-4" />
                        <span className="font-semibold">추천 레시피 ({message.recipes.length}개)</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {message.recipes.map((recipe, index) => (
                          <div 
                            key={index} 
                            className="p-4 bg-orange-950/50 rounded-xl border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300"
                          >
                            <h3 className="font-bold text-orange-100 mb-2">
                              {recipe.title || recipe.name || '맛있는 레시피'}
                            </h3>
                            <p className="text-sm text-orange-300/90 mb-3">
                              {recipe.description || '간단하고 맛있는 요리입니다.'}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-amber-400" />
                                <span className="text-amber-300">
                                  {recipe.cookingTime || '30'}분
                                </span>
                              </div>
                              <span className="text-green-300">{recipe.difficulty || '쉬움'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-500/20 text-xs opacity-70">
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {message.type === 'human' && <span className="text-emerald-400">✓</span>}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {isStreaming && streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-orange-500/20 relative max-w-3xl">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    🧑‍🍳
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {streamingMessage}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isStreaming && !streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-orange-500/20 relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    🧑‍🍳
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <span className="text-sm text-orange-300">AI 셰프가 레시피를 준비하고 있어요...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-orange-500/30 p-6 bg-gradient-to-r from-orange-900/20 to-amber-900/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="레시피를 물어보세요... (예: 닭가슴살로 요리 추천해주세요)"
                className="flex-1 px-4 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none text-white placeholder-orange-300/50 backdrop-blur-sm leading-relaxed min-h-[56px]"
                rows={1}
                disabled={isStreaming}
              />
              <button
                onClick={handleSendMessage}
                disabled={isStreaming || !input.trim()}
                className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-white font-medium shadow-lg border border-orange-500/30"
              >
                <Send className="h-5 w-5" />
                <span className="hidden md:inline">전송</span>
              </button>
            </div>

            <div className="mt-4 text-xs text-center text-orange-400">
              <span>🔄 로컬 스토리지 기반 • 인증 불필요 • 실시간 WebSocket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allergy Settings Modal */}
      <AllergySettings
        isOpen={showAllergySettings}
        onClose={() => setShowAllergySettings(false)}
      />

      {/* Cooking Level Settings Modal */}
      <CookingLevelSettings
        isOpen={showCookingLevelSettings}
        onClose={() => setShowCookingLevelSettings(false)}
      />
    </div>
  );
}