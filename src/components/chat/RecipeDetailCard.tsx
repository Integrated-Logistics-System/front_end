'use client';

import { 
  ChefHat, 
  Clock, 
  Users, 
  UtensilsCrossed, 
  Star,
  Flame,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Heart,
  Share2,
  BookOpen,
  Timer
} from 'lucide-react';
import { RecipeDetail } from '@/utils/recipeParser';

interface RecipeDetailCardProps {
  recipe: RecipeDetail;
  onBookmark?: () => void;
  onShare?: () => void;
}

// 영어 값을 한글로 변환하는 함수들
const getDifficultyInKorean = (difficulty: string | undefined | null): string => {
  if (!difficulty) return '보통'; // Guard clause
  const difficultyMap: Record<string, string> = {
    'easy': '쉬움',
    'medium': '보통',
    'hard': '어려움',
    'beginner': '초급',
    'intermediate': '중급',
    'advanced': '고급'
  };
  return difficultyMap[difficulty.toLowerCase()] || difficulty;
};

const getCuisineInKorean = (cuisine: string): string => {
  const cuisineMap: Record<string, string> = {
    'korean': '한식',
    'italian': '이탈리아',
    'chinese': '중식',
    'japanese': '일식',
    'american': '양식',
    'mediterranean': '지중해식',
    'french': '프랑스',
    'thai': '태국',
    'indian': '인도',
    'mexican': '멕시코'
  };
  return cuisineMap[cuisine.toLowerCase()] || cuisine;
};

const getMealTypeInKorean = (mealType: string): string => {
  const mealTypeMap: Record<string, string> = {
    'breakfast': '아침',
    'lunch': '점심', 
    'dinner': '저녁',
    'snack': '간식',
    'dessert': '디저트',
    'appetizer': '전채',
    'main': '메인',
    'side': '사이드'
  };
  return mealTypeMap[mealType.toLowerCase()] || mealType;
};

export function RecipeDetailCard({ recipe, onBookmark, onShare }: RecipeDetailCardProps) {
  console.log('🔍 RecipeDetailCard received recipe:', recipe);
  console.log('🔍 Steps data:', recipe.steps);
  console.log('🔍 Steps length:', recipe.steps?.length);
  console.log('🔍 First step:', recipe.steps?.[0]);
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-950/60 to-amber-950/50 rounded-3xl border border-orange-500/30 overflow-hidden shadow-2xl shadow-orange-500/10">
      {/* 헤더 섹션 */}
      <div className="relative p-6 bg-gradient-to-r from-orange-900/80 to-amber-900/80 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-orange-100 mb-2 leading-tight">
              {recipe.title}
            </h2>
            {recipe.description && (
              <p className="text-orange-200/90 text-sm leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2 ml-4">
            {onBookmark && (
              <button
                onClick={onBookmark}
                className="p-2 bg-orange-700/40 hover:bg-orange-600/50 rounded-full transition-all duration-200 hover:scale-105"
                title="북마크에 저장"
              >
                <Heart className="h-4 w-4 text-orange-200 hover:text-red-400" />
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 bg-orange-700/40 hover:bg-orange-600/50 rounded-full transition-all duration-200 hover:scale-105"
                title="레시피 공유"
              >
                <Share2 className="h-4 w-4 text-orange-200" />
              </button>
            )}
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-800/50 rounded-xl">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-200 font-medium">{recipe.cookingTime}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-green-800/50 rounded-xl">
            <UtensilsCrossed className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200 font-medium">{getDifficultyInKorean(recipe.difficulty)}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-800/50 rounded-xl">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-200 font-medium">{recipe.servingsText || 'N/A'}</span>
          </div>
          
          {recipe.ingredientCount && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-800/50 rounded-xl">
              <ChefHat className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-200 font-medium">{recipe.ingredientCount}개 재료</span>
            </div>
          )}
          
          {recipe.rating && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-800/50 rounded-xl">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-yellow-200 font-medium">{recipe.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* 태그들 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-600/30 text-orange-200 rounded-full text-xs font-medium border border-orange-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* 재료 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-600/30 rounded-full flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-orange-100">필요한 재료</h3>
            <div className="flex-1 h-px bg-orange-500/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-orange-900/30 rounded-xl border border-orange-600/20 hover:bg-orange-900/40 transition-colors"
              >
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-orange-200 text-sm">
                  {typeof ingredient === 'string' 
                    ? ingredient 
                    : (ingredient as any)?.name 
                    ? `${(ingredient as any).amount || ''}${(ingredient as any).unit || ''} ${(ingredient as any).name}`.trim()
                    : String(ingredient)
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 조리 단계 */}
        {recipe.steps && recipe.steps.length > 0 ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-600/30 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-100">조리 방법</h3>
              <div className="flex-1 h-px bg-orange-500/20"></div>
            </div>
            
            <div className="space-y-4">
              {recipe.steps.map((step, index) => {
                console.log(`🔍 Rendering step ${index}:`, step);
                return (
              <div
                key={index}
                className="relative pl-6 pb-6 border-l-2 border-orange-500/30 last:border-l-0 last:pb-0"
              >
                {/* 단계 번호 */}
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                
                <div className="ml-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-orange-100 text-sm leading-relaxed flex-1">
                      {step.instruction}
                    </p>
                    {step.time && (
                      <div className="flex items-center gap-1 ml-4 px-2 py-1 bg-amber-700/30 rounded-lg">
                        <Timer className="h-3 w-3 text-amber-400" />
                        <span className="text-xs text-amber-300">{step.time}</span>
                      </div>
                    )}
                  </div>
                  
                  {step.tip && (
                    <div className="flex items-start gap-2 mt-2 p-3 bg-blue-900/20 rounded-lg border border-blue-600/20">
                      <Lightbulb className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-200 text-xs leading-relaxed">{step.tip}</p>
                    </div>
                  )}
                </div>
              </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-orange-900/20 rounded-xl border border-orange-500/30">
            <div className="flex items-center gap-3 text-orange-300">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">조리 방법이 아직 준비되지 않았습니다. 재료를 참고해서 요리해보세요!</p>
            </div>
          </div>
        )}

        {/* 요리 팁 */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-100">셰프의 팁</h3>
              <div className="flex-1 h-px bg-orange-500/20"></div>
            </div>
            
            <div className="space-y-3">
              {recipe.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-600/20"
                >
                  <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 영양 정보 */}
        {recipe.nutritionInfo && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-600/30 rounded-full flex items-center justify-center">
                <Flame className="h-4 w-4 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-100">영양 정보</h3>
              <div className="flex-1 h-px bg-orange-500/20"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recipe.nutritionInfo.calories && (
                <div className="text-center p-3 bg-red-900/20 rounded-xl border border-red-600/20">
                  <div className="text-lg font-bold text-red-300">{recipe.nutritionInfo.calories}</div>
                  <div className="text-xs text-red-400">칼로리</div>
                </div>
              )}
              {recipe.nutritionInfo.protein && (
                <div className="text-center p-3 bg-blue-900/20 rounded-xl border border-blue-600/20">
                  <div className="text-lg font-bold text-blue-300">{recipe.nutritionInfo.protein}</div>
                  <div className="text-xs text-blue-400">단백질</div>
                </div>
              )}
              {recipe.nutritionInfo.carbs && (
                <div className="text-center p-3 bg-yellow-900/20 rounded-xl border border-yellow-600/20">
                  <div className="text-lg font-bold text-yellow-300">{recipe.nutritionInfo.carbs}</div>
                  <div className="text-xs text-yellow-400">탄수화물</div>
                </div>
              )}
              {recipe.nutritionInfo.fat && (
                <div className="text-center p-3 bg-purple-900/20 rounded-xl border border-purple-600/20">
                  <div className="text-lg font-bold text-purple-300">{recipe.nutritionInfo.fat}</div>
                  <div className="text-xs text-purple-400">지방</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}