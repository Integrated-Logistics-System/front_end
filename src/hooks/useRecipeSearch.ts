import { useState, useCallback, useEffect } from 'react';
import { recipeService } from '@/services/recipe.service';

export interface Recipe {
  id: string;
  name: string;
  nameKo: string;
  nameEn: string;
  description: string;
  descriptionKo: string;
  descriptionEn: string;
  ingredients: string[];
  ingredientsKo: string[];
  ingredientsEn: string[];
  steps: string[];
  stepsKo: string[];
  stepsEn: string[];
  difficulty: string;
  tags: string[];
  tagsKo: string[];
  tagsEn: string[];
  minutes: number;
  nSteps: number;
  nIngredients: number;
  servings?: string;
  serves?: string;
  allergenInfo?: any;
  allergyRisk?: string;
  isSafeForAllergies?: boolean;
  safetyScore?: number;
  createdAt?: string;
  updatedAt?: string;
  isAiGenerated?: boolean;
  generationTimestamp?: string;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  averageRating?: number;
  ratingCount?: number;
  isBookmarked?: boolean;
  userRating?: number;
  personalNote?: string;
  personalTags?: string[];
  cookCount?: number;
  lastCookedAt?: Date;
  source?: string;
  image?: string;
}

export interface SearchFilters {
  allergies?: string[];
  preferences?: string[];
  difficulty?: string;
  maxTime?: number;
  ingredients?: string[];
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'time' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  recipes: Recipe[];
  total: number;
  hasMore: boolean;
  suggestions?: string[];
}

export const useRecipeSearch = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);

  const searchRecipes = useCallback(async (
    query: string, 
    filters: SearchFilters = {},
    page: number = 0
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await recipeService.searchRecipesNew({
        query: query.trim(),
        filters,
        page: page + 1, // 백엔드는 1부터 시작하는 페이지 번호 사용
        limit: 20
      });

      if (page === 0) {
        setRecipes(response.recipes);
        setCurrentPage(0);
      } else {
        setRecipes(prev => [...prev, ...response.recipes]);
      }

      setHasMore(response.hasMore);
      setCurrentQuery(query);
      setCurrentFilters(filters);
      setCurrentPage(page);

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다');
      console.error('Recipe search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    await searchRecipes(currentQuery, currentFilters, nextPage);
  }, [loading, hasMore, currentPage, currentQuery, currentFilters, searchRecipes]);

  const getPopularRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recipeService.getPopularRecipes();
      setPopularRecipes(response.recipes);
    } catch (err: any) {
      setError(err.message || '인기 레시피 로드 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async () => {
    try {
      const response = await recipeService.getRecommendations();
      setRecommendations(response.recipes);
    } catch (err: any) {
      console.error('추천 레시피 로드 실패:', err);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await recipeService.getSearchSuggestions(query);
      setSuggestions(response);
    } catch (err: any) {
      console.error('검색 제안 로드 실패:', err);
    }
  }, []);

  // 검색어 변경 시 제안 업데이트
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentQuery) {
        getSuggestions(currentQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentQuery, getSuggestions]);

  return {
    recipes,
    loading,
    error,
    hasMore,
    suggestions,
    popularRecipes,
    recommendations,
    searchRecipes,
    loadMore,
    getPopularRecipes,
    getRecommendations,
    getSuggestions,
    clearResults: () => {
      setRecipes([]);
      setError(null);
      setHasMore(false);
      setCurrentPage(0);
      setCurrentQuery('');
      setCurrentFilters({});
    }
  };
};