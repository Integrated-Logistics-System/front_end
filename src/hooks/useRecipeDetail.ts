import { useState, useCallback } from 'react';
import { recipeService } from '@/services/recipe.service';
import { Recipe } from '@/hooks/useRecipeSearch';

export const useRecipeDetail = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // 레시피 상세 정보 가져오기
      const recipeData = await recipeService.getRecipeById(id);
      setRecipe(recipeData);

      // 유사 레시피 가져오기
      try {
        const similarData = await recipeService.getSimilarRecipes(id);
        setSimilarRecipes(similarData.recipes || []);
      } catch (err) {
        console.error('유사 레시피 로드 실패:', err);
        // 유사 레시피 실패는 전체 로딩을 방해하지 않음
      }

    } catch (err: any) {
      setError(err.message || '레시피를 불러오는 중 오류가 발생했습니다');
      console.error('Recipe detail fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback(async (recipeId: string) => {
    try {
      const result = await recipeService.toggleBookmark(recipeId);
      
      if (recipe && recipe.id === recipeId) {
        setRecipe(prev => ({
          ...prev!,
          isBookmarked: result.isBookmarked
        }));
      }
      
      return result;
    } catch (err: any) {
      console.error('북마크 토글 실패:', err);
      throw err;
    }
  }, [recipe]);

  const addRating = useCallback(async (recipeId: string, rating: number) => {
    try {
      await recipeService.rateRecipe(recipeId, rating);
      
      if (recipe && recipe.id === recipeId) {
        setRecipe(prev => ({
          ...prev!,
          userRating: rating
        }));
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('평점 추가 실패:', err);
      throw err;
    }
  }, [recipe]);

  const updatePersonalNote = useCallback(async (recipeId: string, note: string) => {
    try {
      await recipeService.addPersonalNote(recipeId, note);
      
      if (recipe && recipe.id === recipeId) {
        setRecipe(prev => ({
          ...prev!,
          personalNote: note
        }));
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('개인 노트 업데이트 실패:', err);
      throw err;
    }
  }, [recipe]);

  const markAsCooked = useCallback(async (recipeId: string) => {
    try {
      await recipeService.markAsCooked(recipeId);
      
      if (recipe && recipe.id === recipeId) {
        setRecipe(prev => ({
          ...prev!,
          cookCount: (prev!.cookCount || 0) + 1
        }));
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('요리 완료 표시 실패:', err);
      throw err;
    }
  }, [recipe]);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
    setSimilarRecipes([]);
    setError(null);
  }, []);

  return {
    recipe,
    similarRecipes,
    loading,
    error,
    fetchRecipe,
    toggleBookmark,
    addRating,
    updatePersonalNote,
    markAsCooked,
    clearRecipe
  };
};