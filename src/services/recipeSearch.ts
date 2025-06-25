import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SearchResult {
  success: boolean;
  data: {
    recipes: any[];
    total: number;
    page: number;
    totalPages: number;
    semantic_explanation: string;
    cooking_tips: string;
  };
  meta: {
    semantic_enhanced: boolean;
    user_skill_level: string;
    query_expansion: boolean;
    allergy_filtered: boolean;
    user_allergies: string[];
    authenticated: boolean;
  };
}

class RecipeSearchService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 인증된 사용자용 검색 (알레르기 자동 필터링)
  async searchWithAuth(params: SearchParams, token: string): Promise<SearchResult> {
    const response = await fetch(`${this.baseUrl}/rag/enhanced-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: params.query,
        page: params.page || 1,
        limit: params.limit || 10,
        skill_level: params.skill_level || 'intermediate',
      }),
    });

    if (!response.ok) {
      throw new Error('검색에 실패했습니다');
    }

    return response.json();
  }

  // 비인증 사용자용 검색
  async searchPublic(params: SearchParams): Promise<SearchResult> {
    const response = await fetch(`${this.baseUrl}/rag/enhanced-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.query,
        page: params.page || 1,
        limit: params.limit || 10,
        skill_level: params.skill_level || 'intermediate',
      }),
    });

    if (!response.ok) {
      throw new Error('검색에 실패했습니다');
    }

    return response.json();
  }

  // 안전한 검색 (인증 필수, 알레르기 필터링 보장)
  async safeSearch(params: SearchParams, token: string): Promise<SearchResult> {
    const response = await fetch(`${this.baseUrl}/rag/safe-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: params.query,
        page: params.page || 1,
        limit: params.limit || 10,
        skill_level: params.skill_level || 'intermediate',
      }),
    });

    if (!response.ok) {
      throw new Error('안전한 검색에 실패했습니다');
    }

    return response.json();
  }
}

// 훅으로 서비스 사용
export function useRecipeSearch() {
  const { token, isAuthenticated } = useAuthViewModel();
  const searchService = new RecipeSearchService();

  const search = async (params: SearchParams) => {
    if (isAuthenticated && token) {
      return searchService.searchWithAuth(params, token);
    } else {
      return searchService.searchPublic(params);
    }
  };

  const safeSearch = async (params: SearchParams) => {
    if (!isAuthenticated || !token) {
      throw new Error('안전한 검색을 위해 로그인이 필요합니다');
    }
    return searchService.safeSearch(params, token);
  };

  return {
    search,
    safeSearch,
    isAuthenticated,
  };
}

const recipeSearchService = new RecipeSearchService();
export default recipeSearchService;
