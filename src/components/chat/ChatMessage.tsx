'use client';

import { cn } from '@/lib/utils';
import { ChatMessage as IChatMessage } from '@/types/chat.types';
import { motion } from 'framer-motion';
import { User, Bot, Clock, Zap } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { RecipeDetailCard } from '@/components/chat/RecipeDetailCard';
import { parseRecipeMarkdown, isRecipeMarkdown } from '@/utils/recipeMarkdownParser';
import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: IChatMessage;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.isUser;
  const isStreaming = message.isStreaming;
  const [isClient, setIsClient] = useState(false);

  // 클라이언트에서만 동작하도록 설정 (Hydration 오류 방지)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // AI 메시지가 레시피 마크다운 형태인지 확인하고 파싱
  const parsedRecipe = !isUser && message.content && isRecipeMarkdown(message.content) 
    ? parseRecipeMarkdown(message.content) 
    : null;

  // 안전한 타임스탬프 포맷팅
  const formatTimestamp = (timestamp: string) => {
    if (!isClient) return ''; // 서버에서는 빈 문자열 반환
    try {
      return new Date(timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const MotionDiv = isClient ? motion.div : 'div';

  return (
    <MotionDiv
      {...(isClient && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      })}
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
                {parsedRecipe ? (
                  // 파싱된 레시피가 있으면 레시피 카드 표시
                  <div className="not-prose">
                    <RecipeDetailCard 
                      recipe={parsedRecipe}
                      onBookmark={() => {
                        console.log('Recipe bookmarked:', parsedRecipe.title);
                      }}
                      onShare={() => {
                        console.log('Recipe shared:', parsedRecipe.title);
                      }}
                    />
                  </div>
                ) : message.content ? (
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
          {formatTimestamp(message.timestamp)}
        </div>

        {/* 레시피 카드들 */}
                {!isUser && message.metadata && (message.metadata.recipeData?.length > 0 || message.metadata.recipeDetail) && (
          <div className="mt-4 space-y-3">
            {(message.metadata.intent === 'recipe_detail' || message.metadata.conversationType === 'recipe_detail') && message.metadata.recipeDetail ? (
              // 레시피 상세 정보 카드 표시
              <MotionDiv
                key="recipe_detail_card"
                {...(isClient && {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.2 }
                })}
              >
                <RecipeDetailCard 
                  recipe={{
                    title: message.metadata.recipeDetail.title || '레시피',
                    description: message.metadata.recipeDetail.description || '',
                    cookingTime: typeof message.metadata.recipeDetail.cookingTime === 'number' 
                      ? `${message.metadata.recipeDetail.cookingTime}분` 
                      : String(message.metadata.recipeDetail.cookingTime || '30분'),
                    difficulty: message.metadata.recipeDetail.difficulty === 'easy' ? '쉬움' :
                                message.metadata.recipeDetail.difficulty === 'hard' ? '어려움' : '보통',
                    servings: message.metadata.recipeDetail.servings || null,
                    servingsText: message.metadata.recipeDetail.servings 
                      ? `${message.metadata.recipeDetail.servings}인분`
                      : 'N/A',
                    rating: message.metadata.recipeDetail.rating,
                    ingredientCount: message.metadata.recipeDetail.ingredients?.length,
                    tags: message.metadata.recipeDetail.tags || [],
                    ingredients: message.metadata.recipeDetail.ingredients || [],
                    steps: (message.metadata.recipeDetail.steps || []).map((step: any, stepIndex: number) => ({
                      step: step.step || stepIndex + 1,
                      instruction: step.instruction || String(step),
                      time: step.time ? `${step.time}분` : undefined,
                      tip: step.tip || undefined,
                    })),
                    tips: [],
                    nutritionInfo: message.metadata.recipeDetail.nutrition ? {
                      calories: `${message.metadata.recipeDetail.nutrition.calories}kcal`,
                      protein: `${message.metadata.recipeDetail.nutrition.protein}g`,
                      carbs: `${message.metadata.recipeDetail.nutrition.carbs}g`,
                      fat: `${message.metadata.recipeDetail.nutrition.fat}g`,
                    } : undefined,
                  }}
                  onBookmark={() => {
                    console.log('Recipe bookmarked:', message.metadata?.recipeDetail?.id);
                  }}
                  onShare={() => {
                    console.log('Recipe shared:', message.metadata?.recipeDetail?.id);
                  }}
                />
              </MotionDiv>
            ) : (
              // 레시피 목록 카드들
              message.metadata.recipeData.slice(0, 6).map((recipe, index) => (
                <MotionDiv
                  key={recipe.id || index}
                  {...(isClient && {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 }
                  })}
                  className="bg-gradient-to-br from-orange-950/40 to-amber-950/30 rounded-2xl border border-orange-500/20 p-4 hover:border-orange-400/40 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div className="flex flex-col space-y-3">
                    {/* 레시피 제목 및 기본 정보 */}
                    <div>
                      <h4 className="text-lg font-semibold text-orange-100 mb-1">
                        {recipe.nameKo || recipe.name || '레시피'}
                      </h4>
                      {recipe.description && (
                        <p className="text-orange-200/80 text-sm line-clamp-2">
                          {recipe.descriptionKo || recipe.description}
                        </p>
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-2">
                      {recipe.minutes && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-700/30 rounded-lg">
                          <Clock className="h-3 w-3 text-orange-400" />
                          <span className="text-xs text-orange-200">{recipe.minutes}분</span>
                        </div>
                      )}
                      {recipe.nIngredients && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-700/30 rounded-lg">
                          <User className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-200">{recipe.nIngredients}개 재료</span>
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="px-2 py-1 bg-blue-700/30 rounded-lg">
                          <span className="text-xs text-blue-200">{recipe.difficulty}</span>
                        </div>
                      )}
                    </div>

                    {/* 태그들 */}
                    {(recipe.tagsKo || recipe.tags) && (recipe.tagsKo || recipe.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {(recipe.tagsKo || recipe.tags).slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 상세보기 버튼 */}
                    <button
                      onClick={() => {
                        console.log('Recipe detail requested:', recipe.id);
                        // TODO: 레시피 상세 정보 요청 로직
                      }}
                      className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      상세보기
                    </button>
                  </div>
                </MotionDiv>
              ))
            )}
          </div>
        )}

        {/* 제안된 후속 질문 */}
        {message.metadata?.suggestedFollowups && message.metadata.suggestedFollowups.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.metadata.suggestedFollowups.map((followup, index) => {
              const MotionButton = isClient ? motion.button : 'button';
              return (
                <MotionButton
                  key={index}
                  {...(isClient && {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: index * 0.1 }
                  })}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
                  onClick={() => {
                    // TODO: 후속 질문 클릭 핸들러
                    console.log('Followup clicked:', followup);
                  }}
                >
                  {followup}
                </MotionButton>
              );
            })}
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
    </MotionDiv>
  );
}