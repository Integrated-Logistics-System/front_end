'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Clock, Users, Star, Heart, ChefHat, ArrowLeft, Brain, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { SearchFilters } from '@/components/recipe/SearchFilters';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SearchFilters {
  difficulty?: string;
  maxTime?: number;
  ingredients?: string[];
  allergies?: string[];
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'time' | 'difficulty';
}

export default function RecipesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthViewModel();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    recipes,
    loading,
    error,
    hasMore,
    searchRecipes,
    loadMore,
    suggestions,
    popularRecipes,
    recommendations
  } = useRecipeSearch();

  useEffect(() => {
    // 페이지 로드 시 인기 레시피 불러오기
    if (searchQuery.trim() === '') {
      loadPopularRecipes();
    }
  }, []);

  const loadPopularRecipes = async () => {
    try {
      await searchRecipes('', { sortBy: 'rating' });
    } catch (err) {
      console.error('인기 레시피 로드 실패:', err);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      loadPopularRecipes();
      return;
    }

    try {
      const searchFilters = {
        ...filters,
        allergies: user?.allergies || [],
        preferences: user?.preferences || [],
      };
      await searchRecipes(query, searchFilters);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 max-w-md w-full">
          <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            레시피 검색
          </h1>
          <p className="text-orange-200 mb-6">23만+ 레시피를 검색하려면 로그인이 필요해요!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-900/95 to-amber-900/95 backdrop-blur-sm border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/chat')}
                className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <ChefHat className="h-8 w-8 text-orange-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    레시피 검색
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-orange-300">기본 검색</span>
                    <Link 
                      href="/recipes/vector"
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-400/30 rounded-full text-xs text-blue-300 hover:bg-blue-600/30 hover:text-blue-200 transition-all duration-200"
                    >
                      <Brain className="h-3 w-3" />
                      AI 벡터 검색
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-black/20 rounded-lg p-1 border border-orange-500/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-orange-600 text-white' 
                      : 'text-orange-300 hover:text-white hover:bg-orange-700/50'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-orange-600 text-white' 
                      : 'text-orange-300 hover:text-white hover:bg-orange-700/50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-200"
              >
                <Filter className="h-5 w-5" />
                <span className="hidden sm:inline">필터</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-6 w-6 text-orange-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                placeholder="레시피를 검색해보세요... (예: 닭가슴살 요리, 파스타, 다이어트 식단)"
                className="w-full pl-12 pr-16 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-white placeholder-orange-300/50 backdrop-blur-sm text-lg"
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-all duration-200 text-white"
              >
                검색
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-orange-500/30 rounded-xl shadow-2xl z-10">
                <div className="p-2">
                  <div className="text-sm text-orange-300 px-3 py-2 border-b border-orange-500/20">
                    추천 검색어
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-orange-700/30 rounded-lg transition-all duration-200 text-orange-200 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['빠른 요리', '다이어트', '한식', '양식', '중식', '간편식', '건강식'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSuggestionClick(tag)}
                className="px-4 py-2 bg-amber-900/30 text-amber-300 rounded-full text-sm border border-amber-500/30 hover:bg-amber-800/30 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        <SearchFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-orange-300">
                {searchQuery ? `"${searchQuery}" 검색 결과` : '인기 레시피'}
              </h2>
              {recipes.length > 0 && (
                <span className="text-sm text-orange-400">
                  {recipes.length}개 레시피 발견
                </span>
              )}
            </div>
            
            {/* Sort Options */}
            <select
              value={filters.sortBy || 'relevance'}
              onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="px-4 py-2 bg-gray-800/80 border border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-400"
            >
              <option value="relevance">관련도순</option>
              <option value="rating">평점순</option>
              <option value="time">시간순</option>
              <option value="difficulty">난이도순</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && recipes.length === 0 && (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-orange-300 mt-4">레시피를 검색하고 있어요...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-400 text-lg font-medium mb-2">검색 중 오류가 발생했어요</div>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => handleSearch()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 text-white"
              >
                다시 검색
              </button>
            </div>
          </div>
        )}

        {/* Recipe Grid/List */}
        {recipes.length > 0 && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-6'
          }`}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                viewMode={viewMode}
                onBookmark={(id) => {
                  // 북마크 토글 로직
                  console.log('북마크 토글:', id);
                }}
                onRate={(id, rating) => {
                  // 평점 업데이트 로직
                  console.log('평점 업데이트:', id, rating);
                }}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl transition-all duration-200 text-white font-medium"
            >
              더 많은 레시피 보기
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-orange-300 mb-2">
              검색 결과가 없어요
            </h3>
            <p className="text-orange-200 mb-6">
              다른 검색어를 시도해보거나 필터를 조정해보세요
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({});
                loadPopularRecipes();
              }}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-200 text-white"
            >
              인기 레시피 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}