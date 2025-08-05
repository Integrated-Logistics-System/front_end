import { useState, useCallback, useEffect } from 'react';
import { recipeService } from '@/services/recipe.service';
import { Recipe } from '@/hooks/useRecipeSearch';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchBookmarks = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await recipeService.getBookmarkedRecipes(page);
      
      if (page === 0) {
        setBookmarks(response.recipes);
        setCurrentPage(0);
      } else {
        setBookmarks(prev => [...prev, ...response.recipes]);
      }
      
      setHasMore(response.recipes.length === 20); // 20개씩 로드한다고 가정
      setCurrentPage(page);

    } catch (err: any) {
      setError(err.message || '북마크를 불러오는 중 오류가 발생했습니다');
      console.error('Bookmarks fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    await fetchBookmarks(nextPage);
  }, [loading, hasMore, currentPage, fetchBookmarks]);

  const removeBookmark = useCallback(async (recipeId: string) => {
    try {
      await recipeService.toggleBookmark(recipeId);
      
      // 로컬 상태에서 제거
      setBookmarks(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      return { success: true };
    } catch (err: any) {
      console.error('북마크 제거 실패:', err);
      throw err;
    }
  }, []);

  const addBookmark = useCallback(async (recipe: Recipe) => {
    try {
      await recipeService.toggleBookmark(recipe.id);
      
      // 로컬 상태에 추가
      setBookmarks(prev => [{ ...recipe, isBookmarked: true }, ...prev]);
      
      return { success: true };
    } catch (err: any) {
      console.error('북마크 추가 실패:', err);
      throw err;
    }
  }, []);

  const toggleBookmark = useCallback(async (recipeId: string) => {
    try {
      const result = await recipeService.toggleBookmark(recipeId);
      
      if (result.isBookmarked) {
        // 북마크 추가됨 - 레시피 정보를 가져와서 추가
        try {
          const recipe = await recipeService.getRecipeById(recipeId);
          setBookmarks(prev => [{ ...recipe, isBookmarked: true }, ...prev]);
        } catch (err) {
          console.error('북마크 추가 후 레시피 정보 로드 실패:', err);
        }
      } else {
        // 북마크 제거됨
        setBookmarks(prev => prev.filter(recipe => recipe.id !== recipeId));
      }
      
      return result;
    } catch (err: any) {
      console.error('북마크 토글 실패:', err);
      throw err;
    }
  }, []);

  const clearAllBookmarks = useCallback(async () => {
    try {
      // 모든 북마크를 개별적으로 제거 (백엔드에 bulk delete API가 없다고 가정)
      const promises = bookmarks.map(bookmark => 
        recipeService.toggleBookmark(bookmark.id)
      );
      
      await Promise.all(promises);
      
      setBookmarks([]);
      setCurrentPage(0);
      setHasMore(false);
      
      return { success: true };
    } catch (err: any) {
      console.error('전체 북마크 삭제 실패:', err);
      throw err;
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((recipeId: string) => {
    return bookmarks.some(bookmark => bookmark.id === recipeId);
  }, [bookmarks]);

  const getBookmarkCount = useCallback(() => {
    return bookmarks.length;
  }, [bookmarks]);

  return {
    bookmarks,
    loading,
    error,
    hasMore,
    fetchBookmarks,
    loadMore,
    removeBookmark,
    addBookmark,
    toggleBookmark,
    clearAllBookmarks,
    isBookmarked,
    getBookmarkCount,
    clearBookmarks: () => {
      setBookmarks([]);
      setError(null);
      setCurrentPage(0);
      setHasMore(false);
    }
  };
};