import React from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  ChefHat, 
  Shield,
  Zap,
  Brain,
  TrendingUp,
  BookmarkPlus,
  Bookmark
} from 'lucide-react';
import { VectorSearchResult } from '@/services/vector-search.service';
import { vectorSearchUtils } from '@/services/vector-search.service';

interface VectorRecipeCardProps {
  recipe: VectorSearchResult;
  viewMode: 'grid' | 'list';
  showVectorInfo?: boolean;
  onBookmark?: (recipeId: string) => void;
  onRate?: (recipeId: string, rating: number) => void;
  onClick?: (recipeId: string) => void;
}

export const VectorRecipeCard: React.FC<VectorRecipeCardProps> = ({
  recipe,
  viewMode,
  showVectorInfo = true,
  onBookmark,
  onRate,
  onClick
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(recipe.id);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(recipe.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSearchMethodInfo = () => {
    if (!showVectorInfo || !recipe.searchMethod) return null;

    const icon = vectorSearchUtils.getSearchMethodIcon(recipe.searchMethod);
    const description = vectorSearchUtils.getSearchMethodDescription(recipe.searchMethod);
    
    return { icon, description };
  };

  const formatSimilarityScore = () => {
    if (!showVectorInfo || !recipe.combinedScore) return null;
    return vectorSearchUtils.formatSimilarityScore(recipe.combinedScore);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 p-6"
      >
        <div className="flex space-x-6">
          {/* 이미지 */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <ChefHat className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>
              </div>
              
              {/* 벡터 검색 정보 */}
              {showVectorInfo && (
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {getSearchMethodInfo() && (
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1">{getSearchMethodInfo()!.icon}</span>
                      <span>{getSearchMethodInfo()!.description}</span>
                    </div>
                  )}
                  {formatSimilarityScore() && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      유사도 {formatSimilarityScore()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.minutes}분
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {recipe.nIngredients || 'N/A'}개 재료
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </div>
                {recipe.averageRating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                    {recipe.averageRating.toFixed(1)}
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBookmarkClick}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={recipe.isBookmarked ? "북마크 해제" : "북마크 추가"}
                >
                  {recipe.isBookmarked ? (
                    <Bookmark className="h-5 w-5 text-blue-600 fill-current" />
                  ) : (
                    <BookmarkPlus className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid 뷰
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 overflow-hidden"
    >
      {/* 이미지 영역 */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="h-16 w-16 text-orange-600" />
        </div>
        
        {/* 벡터 검색 배지 */}
        {showVectorInfo && getSearchMethodInfo() && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs">
              <span className="mr-1">{getSearchMethodInfo()!.icon}</span>
              <span className="font-medium">AI 검색</span>
            </div>
          </div>
        )}

        {/* 유사도 점수 */}
        {showVectorInfo && formatSimilarityScore() && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {formatSimilarityScore()}
            </div>
          </div>
        )}

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmarkClick}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          title={recipe.isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          {recipe.isBookmarked ? (
            <Bookmark className="h-5 w-5 text-blue-600 fill-current" />
          ) : (
            <BookmarkPlus className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          )}
        </button>

        {/* 알레르기 안전 표시 */}
        {recipe.isSafeForAllergies && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
              <Shield className="h-3 w-3 mr-1" />
              안전
            </div>
          </div>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{recipe.tags.length - 2}
            </span>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {recipe.minutes}분
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          </div>

          {recipe.averageRating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
              <span className="font-medium">{recipe.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* 벡터 검색 메타데이터 */}
        {showVectorInfo && (recipe.vectorSimilarity || recipe.textRelevance) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              {recipe.vectorSimilarity && (
                <div className="flex items-center">
                  <Brain className="h-3 w-3 mr-1" />
                  벡터: {(recipe.vectorSimilarity * 100).toFixed(0)}%
                </div>
              )}
              {recipe.textRelevance && (
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  텍스트: {(recipe.textRelevance * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// RecipeCard로도 export (backward compatibility)
export const RecipeCard = VectorRecipeCard;