import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface AllergenCheckResult {
  safe: boolean;
  warnings: AllergenWarning[];
  safetyScore: number;
}

export interface AllergenWarning {
  allergen: string;
  ingredient: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface AllergenData {
  ingredient_name: string;
  [key: string]: string | number;
}

export const allergenService = {
  // 알레르기 타입 목록 조회
  async getAllergenTypes(): Promise<string[]> {
    const response = await apiClient.get(API_ENDPOINTS.ALLERGEN.TYPES);
    return response.data;
  },

  // 레시피 알레르기 체크
  async checkRecipeAllergens(
    ingredients: string[], 
    allergies: string[]
  ): Promise<AllergenCheckResult> {
    const response = await apiClient.post(API_ENDPOINTS.ALLERGEN.CHECK, {
      ingredients,
      allergies
    });
    return response.data;
  },

  // 재료별 알레르기 정보 조회
  async getIngredientInfo(name: string): Promise<AllergenData | null> {
    const response = await apiClient.get(`${API_ENDPOINTS.ALLERGEN.INGREDIENT}/${name}`);
    return response.data;
  },

  // 재료 검색
  async searchIngredients(query: string, limit: number = 10): Promise<AllergenData[]> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ALLERGEN.SEARCH}?q=${query}&limit=${limit}`
    );
    return response.data;
  },

  // 알레르기 타입별 재료 조회
  async getIngredientsByAllergen(allergenType: string): Promise<string[]> {
    const response = await apiClient.get(`/allergen/by-allergen/${allergenType}`);
    return response.data;
  },

  // 알레르기 통계
  async getAllergenStatistics(): Promise<any> {
    const response = await apiClient.get('/allergen/statistics');
    return response.data;
  },
};
