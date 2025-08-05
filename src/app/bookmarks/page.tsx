'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, ChefHat, Search, Filter, Trash2, Grid, List } from 'lucide-react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { useBookmarks } from '@/hooks/useBookmarks';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function BookmarksPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthViewModel();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'rating'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating'>('date');

  const {
    bookmarks,
    loading,
    error,
    hasMore,
    fetchBookmarks,
    loadMore,
    removeBookmark,
    clearAllBookmarks
  } = useBookmarks();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  const filteredBookmarks = bookmarks.filter(recipe => {
    const matchesSearch = !searchQuery || 
      (recipe.nameKo && recipe.nameKo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (recipe.name && recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    switch (filterBy) {
      case 'recent':
        // 최근 일주일 내 북마크된 레시피
        return matchesSearch; // 실제로는 북마크 날짜 확인 필요
      case 'rating':
        return matchesSearch && (recipe.averageRating || 0) >= 4.0;
      default:
        return matchesSearch;
    }
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.nameKo || a.name).localeCompare(b.nameKo || b.name);
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'date':
      default:
        return 0; // 실제로는 북마크 날짜로 정렬
    }
  });

  const handleBookmarkToggle = async (recipeId: string) => {
    try {
      await removeBookmark(recipeId);
    } catch (error) {
      console.error('북마크 제거 실패:', error);
    }
  };

  const handleClearAll = async () => {
    if (confirm('모든 북마크를 삭제하시겠습니까?')) {
      try {
        await clearAllBookmarks();
      } catch (error) {
        console.error('북마크 전체 삭제 실패:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 max-w-md w-full">
          <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            내 북마크
          </h1>
          <p className="text-orange-200 mb-6">북마크한 레시피를 보려면 로그인이 필요해요!</p>
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
                onClick={() => router.push('/recipes')}
                className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-400 fill-current" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    내 북마크
                  </h1>
                  <p className="text-orange-300 text-sm">
                    {bookmarks.length}개의 레시피를 저장했어요
                  </p>
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

              {/* Clear All Button */}
              {bookmarks.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="hidden sm:inline">전체 삭제</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-orange-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="북마크한 레시피 검색..."
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-white placeholder-orange-300/50 backdrop-blur-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-800/80 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:border-orange-400"
            >
              <option value="all">전체 북마크</option>
              <option value="recent">최근 북마크</option>
              <option value="rating">고평점 (4.0+)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-800/80 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:border-orange-400"
            >
              <option value="date">최신순</option>
              <option value="name">이름순</option>
              <option value="rating">평점순</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && bookmarks.length === 0 && (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-orange-300 mt-4">북마크를 불러오고 있어요...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-400 text-lg font-medium mb-2">북마크를 불러올 수 없어요</div>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => fetchBookmarks()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 text-white"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedBookmarks.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-orange-300 mb-2">
              {searchQuery ? '검색 결과가 없어요' : '북마크한 레시피가 없어요'}
            </h3>
            <p className="text-orange-200 mb-6">
              {searchQuery 
                ? '다른 검색어로 시도해보세요' 
                : '마음에 드는 레시피를 북마크해보세요!'
              }
            </p>
            <button
              onClick={() => router.push('/recipes')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg transition-all duration-200 text-white font-medium"
            >
              레시피 둘러보기
            </button>
          </div>
        )}

        {/* Recipe Grid/List */}
        {sortedBookmarks.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-orange-300">
                {searchQuery ? `"${searchQuery}" 검색 결과` : '북마크한 레시피'}
              </h2>
              <span className="text-sm text-orange-400">
                {sortedBookmarks.length}개 레시피
              </span>
            </div>

            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-6'
            }`}>
              {sortedBookmarks.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{ ...recipe, isBookmarked: true }}
                  viewMode={viewMode}
                  onBookmark={handleBookmarkToggle}
                  onRate={(id, rating) => {
                    // 평점 업데이트 로직
                    console.log('평점 업데이트:', id, rating);
                  }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl transition-all duration-200 text-white font-medium"
                >
                  더 많은 북마크 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}