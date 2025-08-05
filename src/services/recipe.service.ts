import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface RecipeSearchParams {
  query: string;
  page?: number;
  limit?: number;
  allergies?: string[];
  maxCookingTime?: number;
  cuisineTypes?: string[];
}

export interface SearchFilters {
  allergies?: string[];
  preferences?: string[];
  maxTime?: number;
  difficulty?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'time' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

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

export interface RecipeSearchResult {
  recipes: Recipe[];
  total: number;
  page: number;
  hasMore: boolean;
  suggestions?: string[];
}

export const recipeService = {
  // 레시피 검색 (기본 타임아웃)
  async searchRecipes(params: RecipeSearchParams): Promise<RecipeSearchResult> {
    const response = await apiClient.post(API_ENDPOINTS.RECIPE.SEARCH, params);
    return response.data;
  },

  // 새로운 레시피 검색 API (백엔드 통합)
  async searchRecipesNew(params: {
    query: string;
    filters?: SearchFilters;
    page?: number;
    limit?: number;
  }): Promise<{ recipes: Recipe[]; total: number; hasMore: boolean; suggestions?: string[] }> {
    const response = await apiClient.post('/recipes/search', {
      query: params.query,
      allergies: params.filters?.allergies || [],
      preferences: params.filters?.preferences || [],
      maxCookingTime: params.filters?.maxTime,
      difficulty: params.filters?.difficulty,
      tags: params.filters?.tags,
      sortBy: params.filters?.sortBy,
      sortOrder: params.filters?.sortOrder,
      page: params.page || 1,
      limit: params.limit || 20
    });
    
    // 백엔드 응답 형식에 맞춰 변환
    const data = response.data;
    return {
      recipes: data.recipes || [],
      total: data.total || 0,
      hasMore: data.recipes && data.recipes.length === (params.limit || 20) && data.total > ((params.page || 1) * (params.limit || 20))
    };
  },

  // 레시피 상세 조회
  async getRecipeDetail(id: string): Promise<{ success: boolean; data: Recipe }> {
    const response = await apiClient.get(`${API_ENDPOINTS.RECIPE.DETAIL}/${id}`);
    return response.data;
  },

  // 새로운 레시피 상세 조회
  async getRecipeById(id: string): Promise<Recipe> {
    const response = await apiClient.get(`/recipes/${id}`);
    // 백엔드 응답이 { success: true, data: recipe } 형태일 수 있음
    return response.data?.data || response.data;
  },

  // 인기 레시피
  async getPopularRecipes(limit: number = 10): Promise<{ recipes: Recipe[] }> {
    const response = await apiClient.get(`/recipes/popular?limit=${limit}`);
    return response.data;
  },

  // 개인화 추천 레시피
  async getRecommendations(limit: number = 10): Promise<{ recipes: Recipe[] }> {
    const response = await apiClient.get(`/recipes/recommendations?limit=${limit}`);
    return response.data;
  },

  // 검색 제안
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await apiClient.get(`/recipes/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 유사 레시피
  async getSimilarRecipes(id: string, limit: number = 10): Promise<{ recipes: Recipe[] }> {
    const response = await apiClient.get(`/recipes/${id}/similar?limit=${limit}`);
    return response.data;
  },

  // 레시피 북마크 토글
  async toggleBookmark(recipeId: string): Promise<{ isBookmarked: boolean }> {
    const response = await apiClient.post(`/recipes/${recipeId}/bookmark`);
    return response.data;
  },

  // 북마크된 레시피 조회
  async getBookmarkedRecipes(page: number = 0, limit: number = 20): Promise<{ recipes: Recipe[]; total: number }> {
    const response = await apiClient.get(`/recipes/bookmarks?page=${page}&limit=${limit}`);
    return response.data;
  },

  // 레시피 평점
  async rateRecipe(recipeId: string, rating: number): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/recipes/${recipeId}/rate`, { rating });
    return response.data;
  },

  // 개인 노트 추가
  async addPersonalNote(recipeId: string, note: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/recipes/${recipeId}/note`, { note });
    return response.data;
  },

  // 레시피 완료 표시
  async markAsCooked(recipeId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/recipes/${recipeId}/cooked`);
    return response.data;
  },

  // 레시피 통계
  async getRecipeStats(): Promise<{ totalRecipes: number; totalViews: number; totalLikes: number; averageRating: number; topRatedRecipeIds: string[]; }> {
    const response = await apiClient.get('/recipes/stats');
    return response.data;
  },

  // 재료별 레시피 검색
  async searchByIngredients(ingredients: string[]): Promise<RecipeSearchResult> {
    const response = await apiClient.post('/recipes/search-by-ingredients', {
      ingredients
    });
    return response.data;
  },

  // AI 채팅 기반 레시피 검색 (긴 타임아웃)
  async chatBasedSearch(params: RecipeSearchParams & { chatMessage?: string }): Promise<RecipeSearchResult> {
    const response = await apiClient.postLongRunning('/chat', params);
    return response.data;
  },
};