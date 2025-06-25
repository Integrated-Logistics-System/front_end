import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface RecipeSearchParams {
  query: string;
  page?: number;
  limit?: number;
  allergens?: string[];
  maxCookingTime?: number;
  cuisineTypes?: string[];
}

export interface Recipe {
  _id?: string;
  id: number;
  name: string;
  name_ko?: string;
  minutes: number;
  description: string;
  ingredients: string[];
  ingredients_ko?: string[];
  tags: string[];
  nutrition?: string;
  steps?: string | string[];
  steps_array?: string[];        // 정리된 영어 조리법 배열
  steps_korean?: string[];       // 번역된 한국어 조리법 배열
  cooking_tips?: string[];       // AI 생성 요리 팁
  contributor_id?: number;
  submitted?: string;
  n_steps?: number;
  n_ingredients?: number;
  improved_steps?: string[];
  user_tips?: string[];
  time_saving_tips?: string[];
}

export interface RecipeSearchResult {
  recipes: Recipe[];
  total: number;
  page: number;
  totalPages: number;
}

export const recipeService = {
  // 레시피 검색 (기본 타임아웃)
  async searchRecipes(params: RecipeSearchParams): Promise<RecipeSearchResult> {
    const response = await apiClient.post(API_ENDPOINTS.RECIPE.SEARCH, params);
    return response.data;
  },

  // 레시피 상세 조회
  async getRecipeDetail(id: string): Promise<{ success: boolean; data: Recipe }> {
    const response = await apiClient.get(`${API_ENDPOINTS.RECIPE.DETAIL}/${id}`);
    return response.data;
  },

  // 인기 레시피
  async getPopularRecipes(limit: number = 10): Promise<Recipe[]> {
    const response = await apiClient.get(`/recipe/popular?limit=${limit}`);
    return response.data;
  },

  // 재료별 레시피 검색
  async searchByIngredients(ingredients: string[]): Promise<RecipeSearchResult> {
    const response = await apiClient.post('/recipe/search-by-ingredients', {
      ingredients
    });
    return response.data;
  },

  // AI 채팅 기반 레시피 검색 (긴 타임아웃)
  async chatBasedSearch(params: RecipeSearchParams & { chatMessage?: string }): Promise<RecipeSearchResult> {
    const response = await apiClient.postLongRunning(API_ENDPOINTS.RECIPE.CHAT, params);
    return response.data;
  },
};
