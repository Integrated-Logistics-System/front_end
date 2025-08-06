'use client';

import { cn } from '@/lib/utils';
import { ChatMessage as IChatMessage } from '@/types/chat.types';
import { motion } from 'framer-motion';
import { User, Bot, Clock, Zap } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeDetailCard } from '@/components/chat/RecipeDetailCard';

interface ChatMessageProps {
  message: IChatMessage;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.isUser;
  const isStreaming = message.isStreaming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-3 px-4 py-3",
        isUser ? "justify-end" : "justify-start",
        isLast && "pb-6"
      )}
    >
      {/* AI 아바타 (왼쪽) */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* 메시지 컨테이너 */}
      <div
        className={cn(
          "flex flex-col max-w-[80%] sm:max-w-[70%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* 메시지 말풍선 */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
            isUser
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white ml-4"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-4",
            isStreaming && "animate-pulse"
          )}
        >
          {/* 말풍선 꼬리 */}
          <div
            className={cn(
              "absolute top-4 w-0 h-0",
              isUser
                ? "right-[-8px] border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                : "left-[-8px] border-r-[8px] border-r-white dark:border-r-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
            )}
          />

          {/* 메시지 내용 */}
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {message.content ? (
                  <MarkdownRenderer content={message.content} />
                ) : isStreaming ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="ml-2 text-xs">AI가 응답을 생성하고 있습니다...</span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">메시지를 처리하고 있습니다...</p>
                )}
              </div>
            )}

            {/* 스트리밍 커서 */}
            {isStreaming && message.content && (
              <span className="inline-block w-1 h-4 bg-orange-500 animate-pulse ml-1" />
            )}
          </div>

          {/* 메타데이터 */}
          {message.metadata && (
            <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-700">
              <div className="flex items-center gap-3 text-xs opacity-70">
                {/* {message.metadata.intent && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span className="capitalize">{message.metadata.intent.replace('_', ' ')}</span>
                  </div>
                )} */}
                {message.metadata.confidence && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${message.metadata.confidence * 100}%` }}
                      />
                    </div>
                    <span>{Math.round(message.metadata.confidence * 100)}%</span>
                  </div>
                )}
                {message.metadata.processingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{message.metadata.processingTime}ms</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 타임스탬프 */}
        <div 
          className={cn(
            "mt-1 px-2 text-xs text-gray-500 dark:text-gray-400",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        {/* 레시피 카드들 */}
                {!isUser && message.metadata && (message.metadata.recipeData?.length > 0 || message.metadata.recipeDetail) && (
          <div className="mt-4 space-y-3">
            {message.metadata.conversationType === 'recipe_detail' && message.metadata.recipeDetail ? (
              // 레시피 상세 정보 - 백엔드에서 변환된 recipeDetail 우선 사용
              (() => {
                console.log('🔍 Backend Data Check:', {
                  hasRecipeDetail: !!message.metadata?.recipeDetail,
                  hasRecipeData: !!message.metadata?.recipeData,
                  recipeDetail: message.metadata?.recipeDetail,
                  conversationType: message.metadata.conversationType
                });

                // 백엔드에서 변환된 recipeDetail이 있으면 우선 사용
                if (message.metadata?.recipeDetail) {
                  console.log('🔍 Using Backend recipeDetail:', message.metadata.recipeDetail);
                  return (
                    <motion.div
                      key="backend_recipe_detail"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 }}
                    >
                      <RecipeDetailCard 
                        recipe={message.metadata.recipeDetail}
                        onBookmark={() => {
                          console.log('Recipe bookmarked from backend recipeDetail');
                        }}
                        onShare={() => {
                          console.log('Recipe shared from backend recipeDetail');
                        }}
                      />
                    </motion.div>
                  );
                }

                // 백엔드 recipeDetail이 없으면 프론트엔드에서 변환
                if (message.metadata?.recipeData && message.metadata.recipeData.length > 0) {
                  return message.metadata.recipeData.slice(0, 1).map((recipe, index) => {
                    console.log('🔍 Fallback: Converting recipeData:', recipe);
                    
                    const recipeDetail = {
                      title: recipe.nameKo || recipe.name || '레시피',
                      description: recipe.descriptionKo || recipe.description || '',
                      cookingTime: recipe.minutes ? `${recipe.minutes}분` : 'N/A',
                      difficulty: recipe.difficulty || '보통',
                      servings: recipe.nIngredients || null,
                      servingsText: recipe.nIngredients ? `${recipe.nIngredients}개 재료` : 'N/A',
                      rating: recipe.averageRating || undefined,
                      tags: recipe.tagsKo || recipe.tags || [],
                      ingredients: recipe.ingredientsKo || recipe.ingredients || [],
                      steps: (recipe.stepsKo || recipe.steps || []).map((step: string, stepIndex: number) => ({
                        step: stepIndex + 1,
                        instruction: step,
                        time: undefined,
                        tip: undefined,
                      })),
                      tips: recipe.tips || [],
                      nutritionInfo: recipe.nutritionInfo || undefined,
                    };

                    console.log('🔍 Frontend Converted RecipeDetail:', recipeDetail);
                    
                    return (
                      <motion.div
                        key={recipe.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <RecipeDetailCard 
                          recipe={recipeDetail}
                          onBookmark={() => {
                            console.log('Recipe bookmarked:', recipe.id);
                          }}
                          onShare={() => {
                            console.log('Recipe shared:', recipe.id);
                          }}
                        />
                      </motion.div>
                    );
                  });
                }

                // 둘 다 없으면 에러 메시지
                return (
                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                    <p className="text-red-300">레시피 데이터를 불러올 수 없습니다.</p>
                  </div>
                );
              })()
            ) : (
              // 레시피 목록 - RecipeCard 사용 
              message.metadata.recipeData.slice(0, 6).map((recipe, index) => (
                <motion.div
                  key={recipe.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard
                    recipe={{
                      id: recipe.id || `recipe_${index}`,
                      name: recipe.name || '',
                      nameKo: recipe.nameKo || recipe.name || '',
                      nameEn: recipe.nameEn || recipe.name || '',
                      description: recipe.description || '',
                      descriptionKo: recipe.description || '',
                      descriptionEn: recipe.description || '',
                      image: recipe.image || undefined,
                      minutes: recipe.minutes || 0,
                      nIngredients: recipe.nIngredients || 0,
                      nSteps: recipe.nSteps || 0,
                      difficulty: recipe.difficulty || 'medium',
                      tags: recipe.tags || [],
                      tagsKo: recipe.tagsKo || recipe.tags || [],
                      tagsEn: recipe.tagsEn || recipe.tags || [],
                      averageRating: recipe.averageRating || 0,
                      userRating: recipe.userRating || 0,
                      isBookmarked: recipe.isBookmarked || false,
                      ingredients: recipe.ingredients || [],
                      ingredientsKo: recipe.ingredientsKo || recipe.ingredients || [],
                      ingredientsEn: recipe.ingredientsEn || recipe.ingredients || [],
                      steps: recipe.steps || [],
                      stepsKo: recipe.stepsKo || recipe.steps || [],
                      stepsEn: recipe.stepsEn || recipe.steps || [],
                    }}
                    viewMode="grid"
                    onBookmark={(id) => {
                      console.log('Recipe bookmarked:', id);
                    }}
                    onRate={(id, rating) => {
                      console.log('Recipe rated:', id, rating);
                    }}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* 제안된 후속 질문 */}
        {message.metadata?.suggestedFollowups && message.metadata.suggestedFollowups.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.metadata.suggestedFollowups.map((followup, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
                onClick={() => {
                  // TODO: 후속 질문 클릭 핸들러
                  console.log('Followup clicked:', followup);
                }}
              >
                {followup}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* 사용자 아바타 (오른쪽) */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      )}
    </motion.div>
  );
}