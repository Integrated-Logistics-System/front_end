'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  ChefHat, 
  ArrowLeft,
  Zap,
  Brain,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { RecipeCard } from '@/components/recipe/VectorRecipeCard';
import { VectorSearchFilters } from '@/components/recipe/VectorSearchFilters';
import { VectorSearchStats } from '@/components/recipe/VectorSearchStats';
import { useVectorSearch } from '@/hooks/useVectorSearch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function VectorRecipesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthViewModel();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'vector' | 'hybrid' | 'recommendations'>('hybrid');

  const {
    results,
    loading,
    error,
    hasSearched,
    searchResponse,
    recommendations,
    popularQueries,
    searchMetadata,
    performanceInfo,
    currentFilters,
    defaultFilters,
    searchRecipes,
    quickSearch,
    getPersonalizedRecommendations,
    updateFilters,
    clearResults
  } = useVectorSearch();

  // 페이지 로드시 개인화 추천 로드
  useEffect(() => {
    if (isAuthenticated && !hasSearched) {
      getPersonalizedRecommendations();
    }
  }, [isAuthenticated, hasSearched, getPersonalizedRecommendations]);

  // 검색 실행
  const handleSearch = useCallback(async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setShowSuggestions(false);
    
    if (searchMode === 'recommendations') {
      await getPersonalizedRecommendations([query]);
    } else {
      await searchRecipes(query, {
        ...currentFilters,
        useHybridSearch: searchMode === 'hybrid'
      });
    }
  }, [searchQuery, searchMode, currentFilters, searchRecipes, getPersonalizedRecommendations]);

  // 빠른 검색 (인기 검색어 클릭)
  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
    quickSearch(query);
    setShowSuggestions(false);
  }, [quickSearch]);

  // 검색 모드 변경
  const handleSearchModeChange = useCallback((mode: 'vector' | 'hybrid' | 'recommendations') => {
    setSearchMode(mode);
    if (searchQuery.trim()) {
      // 현재 검색어로 재검색
      if (mode === 'recommendations') {
        getPersonalizedRecommendations([searchQuery]);
      } else {
        searchRecipes(searchQuery, {
          ...currentFilters,
          useHybridSearch: mode === 'hybrid'
        });
      }
    }
  }, [searchQuery, currentFilters, searchRecipes, getPersonalizedRecommendations]);

  // 필터 적용
  const handleFiltersApply = useCallback((newFilters: any) => {
    updateFilters(newFilters);
    setIsFilterOpen(false);
    
    if (searchQuery.trim()) {
      searchRecipes(searchQuery, newFilters);
    }
  }, [searchQuery, searchRecipes, updateFilters]);

  // 표시할 레시피 목록 결정
  const displayRecipes = hasSearched ? results : recommendations;
  const showRecommendations = !hasSearched && recommendations.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/recipes')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center">
                  <Brain className="h-6 w-6 text-blue-600 mr-2" />
                  <h1 className="text-xl font-bold text-gray-900">AI 벡터 검색</h1>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded ml-2">
                    Beta
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-600">의미적 검색</span>
                  <Link 
                    href="/recipes"
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-all duration-200"
                  >
                    <Search className="h-3 w-3" />
                    기본 검색
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsStatsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="검색 통계"
              >
                <Info className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? 
                  <List className="h-5 w-5 text-gray-600" /> : 
                  <Grid className="h-5 w-5 text-gray-600" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 영역 */}
        <div className="mb-8">
          {/* 검색 모드 선택 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleSearchModeChange('hybrid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                searchMode === 'hybrid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <Zap className="h-4 w-4 mr-1" />
              하이브리드 검색
            </button>
            <button
              onClick={() => handleSearchModeChange('vector')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                searchMode === 'vector'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <Brain className="h-4 w-4 mr-1" />
              벡터 검색
            </button>
            <button
              onClick={() => handleSearchModeChange('recommendations')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                searchMode === 'recommendations'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              개인화 추천
            </button>
          </div>

          {/* 검색바 */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  searchMode === 'recommendations' 
                    ? "관심있는 요리나 재료를 입력하세요..."
                    : "어떤 요리를 찾고 계신가요? (예: 김치찌개, 건강한 닭고기 요리)"
                }
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSearch()}
                disabled={!searchQuery.trim() || loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '검색중...' : '검색'}
              </button>
            </div>

            {/* 검색 제안 */}
            {showSuggestions && popularQueries.length > 0 && searchQuery.trim() === '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">인기 검색어</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularQueries.slice(0, 8).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(query)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 검색 설정 및 필터 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                고급 필터
              </button>
              
              {/* 사용자 알레르기 표시 */}
              {user?.allergies && user.allergies.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  알레르기 필터 적용됨 ({user.allergies.length}개)
                </div>
              )}
            </div>

            {/* 검색 메타데이터 */}
            {searchMetadata && (
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  {searchMetadata.searchMethod.icon}
                  <span className="ml-1">{searchMetadata.searchMethod.description}</span>
                </span>
                <span>{searchMetadata.total}개 결과</span>
                <span>{searchMetadata.searchTime}</span>
                {performanceInfo && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    performanceInfo.performanceLevel === 'excellent' ? 'bg-green-100 text-green-700' :
                    performanceInfo.performanceLevel === 'good' ? 'bg-blue-100 text-blue-700' :
                    performanceInfo.performanceLevel === 'average' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {performanceInfo.description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* 검색 결과 헤더 */}
        {!loading && displayRecipes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {showRecommendations ? (
                <>
                  <TrendingUp className="inline h-6 w-6 mr-2 text-green-600" />
                  맞춤 추천 레시피
                </>
              ) : (
                <>
                  <Search className="inline h-6 w-6 mr-2 text-blue-600" />
                  "{searchQuery}" 검색 결과
                </>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {displayRecipes.length}개의 레시피를 찾았습니다
            </p>
          </div>
        )}

        {/* 레시피 목록 */}
        {!loading && displayRecipes.length > 0 && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {displayRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                viewMode={viewMode}
                showVectorInfo={true}
              />
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {!loading && hasSearched && displayRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              다른 키워드로 검색해보시거나 필터를 조정해보세요
            </p>
            <button
              onClick={clearResults}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              검색 초기화
            </button>
          </div>
        )}

        {/* 추천 레시피가 없을 때 */}
        {!loading && !hasSearched && recommendations.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI 벡터 검색에 오신 것을 환영합니다
            </h3>
            <p className="text-gray-600 mb-6">
              의미적 유사도를 기반으로 더 정확한 레시피를 찾아드립니다
            </p>
            {isAuthenticated ? (
              <button
                onClick={() => getPersonalizedRecommendations()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                맞춤 추천 받기
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                로그인하시면 개인화된 추천을 받으실 수 있습니다
              </p>
            )}
          </div>
        )}
      </div>

      {/* 필터 모달 */}
      {isFilterOpen && (
        <VectorSearchFilters
          filters={currentFilters}
          defaultFilters={defaultFilters}
          onApply={handleFiltersApply}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {/* 통계 모달 */}
      {isStatsOpen && (
        <VectorSearchStats
          onClose={() => setIsStatsOpen(false)}
        />
      )}
    </div>
  );
}