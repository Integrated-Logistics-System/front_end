import React, { useState } from 'react';
import { Heart, Clock, Users, Star, ChefHat, BookOpen, Shield, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/hooks/useRecipeSearch';

interface RecipeCardProps {
  recipe: Recipe;
  viewMode: 'grid' | 'list';
  onBookmark: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  viewMode,
  onBookmark,
  onRate
}) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(recipe.isBookmarked || false);
  const [userRating, setUserRating] = useState(recipe.userRating || 0);
  const [isRatingHovered, setIsRatingHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark(recipe.id);
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    onRate(recipe.id, rating);
  };

  const handleCardClick = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      case 'hard':
        return 'text-red-400 bg-red-900/30 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '초급';
      case 'medium':
        return '중급';
      case 'hard':
        return '고급';
      default:
        return '알 수 없음';
    }
  };

  const formatCookingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-500/10"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Recipe Image */}
          <div className="md:w-48 md:h-36 w-full h-48 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-lg flex items-center justify-center border border-orange-500/30 flex-shrink-0">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.nameKo || recipe.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <ChefHat className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                <span className="text-sm text-orange-300">레시피 이미지</span>
              </div>
            )}
          </div>

          {/* Recipe Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2 truncate">
                  {recipe.nameKo || recipe.name}
                </h3>
                <p className="text-orange-200 text-sm line-clamp-2">
                  {recipe.description}
                </p>
              </div>
              
              <button
                onClick={handleBookmark}
                className={`ml-4 p-2 rounded-full transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-red-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Recipe Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-amber-300">
                <Clock className="h-4 w-4" />
                <span>{formatCookingTime(recipe.minutes)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-300">
                <Users className="h-4 w-4" />
                <span>{recipe.nIngredients}개 재료</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <BookOpen className="h-4 w-4" />
                <span>{recipe.nSteps}단계</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyText(recipe.difficulty)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs border border-orange-500/30"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs border border-gray-500/30">
                  +{recipe.tags.length - 4}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-yellow-300 font-medium">
                  {(recipe.averageRating || 0).toFixed(1)}
                </span>
              </div>

              {/* User Rating */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 mr-1">내 평점:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(star);
                    }}
                    className="transition-colors duration-200"
                  >
                    <Star
                      className={`h-3 w-3 ${
                        star <= userRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-500 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleCardClick}
      className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-500/10 group"
    >
      {/* Recipe Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-600/20 to-amber-600/20 flex items-center justify-center border-b border-orange-500/20">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.nameKo || recipe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <ChefHat className="h-12 w-12 text-orange-400 mx-auto mb-2" />
            <span className="text-sm text-orange-300">레시피 이미지</span>
          </div>
        )}
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isBookmarked
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-black/50 backdrop-blur-sm text-gray-400 hover:bg-red-600 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Difficulty Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getDifficultyColor(recipe.difficulty)}`}>
          {getDifficultyText(recipe.difficulty)}
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {recipe.nameKo || recipe.name}
        </h3>
        
        <p className="text-orange-200 text-sm line-clamp-2 mb-3">
          {recipe.description}
        </p>

        {/* Recipe Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1 text-amber-300">
            <Clock className="h-4 w-4" />
            <span>{formatCookingTime(recipe.minutes)}</span>
          </div>
          <div className="flex items-center gap-1 text-green-300">
            <Users className="h-4 w-4" />
            <span>{recipe.nIngredients}개</span>
          </div>
          <div className="flex items-center gap-1 text-blue-300">
            <BookOpen className="h-4 w-4" />
            <span>{recipe.nSteps}단계</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs border border-orange-500/30"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs border border-gray-500/30">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-yellow-300 font-medium">
              {(recipe.averageRating || 0).toFixed(1)}
            </span>
          </div>

          {/* User Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRate(star);
                }}
                className="transition-colors duration-200"
              >
                <Star
                  className={`h-3 w-3 ${
                    star <= userRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-500 hover:text-yellow-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};