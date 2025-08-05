import { apiClient } from '@/lib/api';
import { Recipe } from '@/hooks/useRecipeSearch';

// 벡터 검색 요청 타입
export interface VectorSearchRequest {
  query: string;
  k?: number;
  vectorWeight?: number;
  textWeight?: number;
  useHybridSearch?: boolean;
  minScore?: number;
  allergies?: string[];
  preferences?: string[];
}

// 벡터 검색 결과 타입
export interface VectorSearchResult extends Recipe {
  _score: number;
  vectorSimilarity?: number;
  textRelevance?: number;
  combinedScore?: number;
  searchMethod?: 'vector' | 'text' | 'hybrid';
}

// 벡터 검색 응답 타입
export interface VectorSearchResponse {
  results: VectorSearchResult[];
  total: number;
  maxScore: number;
  searchTime: number;
  searchMethod: 'vector' | 'text' | 'hybrid';
  metadata: {
    vectorWeight: number;
    textWeight: number;
    queryEmbeddingTime?: number;
    elasticsearchTime: number;
    k: number;
    fromCache?: boolean;
    cacheHit?: boolean;
  };
}

// 개인화 추천 요청 타입
export interface PersonalizedRecommendationRequest {
  preferences: string[];
  allergies: string[];
  favoriteIngredients?: string[];
  dietaryRestrictions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCookTime?: number;
  k?: number;
}

// 유사 레시피 응답 타입
export interface SimilarRecipesResponse {
  baseRecipe: Recipe;
  similarRecipes: VectorSearchResponse;
}

// 캐시 상태 타입
export interface CacheStatus {
  cache: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    totalKeys: number;
    hitRate: number;
    memoryUsage: number;
  };
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    cacheService: boolean;
    totalKeys: number;
    memoryUsage: string;
    lastCheck: string;
  };
  stats: {
    totalKeys: number;
    memoryUsage: number;
    hitRate: number;
    lastUpdated: string;
  };
  lastUpdated: string;
}

// 인기 검색어 타입
export interface PopularQuery {
  query: string;
  hitCount: number;
  lastAccessed: string;
}

// 서비스 통계 타입
export interface VectorSearchStats {
  elasticsearch: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    connection: boolean;
    docCount: number;
  };
  embedding: {
    status: 'healthy' | 'unhealthy';
    model: string;
    dimensions: number;
  };
  totalRecipes: number;
  indexedRecipes: number;
  lastUpdate: string;
}

/**
 * 벡터 검색 서비스
 * 의미적 유사도 기반 레시피 검색 및 개인화 추천
 */
export const vectorSearchService = {
  /**
   * 고급 벡터 검색 (POST)
   * 모든 검색 옵션을 세밀하게 조절 가능
   */
  async search(request: VectorSearchRequest): Promise<VectorSearchResponse> {
    const response = await apiClient.post('/vector-search/search', request);
    return response.data;
  },

  /**
   * 간단한 벡터 검색 (GET)
   * 빠른 검색을 위한 쿼리 파라미터 방식
   */
  async simpleSearch(
    query: string, 
    options: {
      k?: number;
      hybrid?: boolean;
      allergies?: string[];
    } = {}
  ): Promise<VectorSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      ...(options.k && { k: options.k.toString() }),
      ...(options.hybrid !== undefined && { hybrid: options.hybrid.toString() }),
      ...(options.allergies && { allergies: options.allergies.join(',') })
    });

    const response = await apiClient.get(`/vector-search/search?${params}`);
    return response.data;
  },

  /**
   * 유사한 레시피 검색
   * 특정 레시피와 유사한 다른 레시피들을 찾기
   */
  async findSimilarRecipes(
    recipeId: string, 
    options: {
      k?: number;
      allergies?: string[];
    } = {}
  ): Promise<SimilarRecipesResponse> {
    const params = new URLSearchParams({
      ...(options.k && { k: options.k.toString() }),
      ...(options.allergies && { allergies: options.allergies.join(',') })
    });

    const response = await apiClient.get(`/vector-search/similar/${recipeId}?${params}`);
    return response.data;
  },

  /**
   * 개인화된 레시피 추천
   * 사용자 프로필 기반 맞춤형 레시피 추천
   */
  async getPersonalizedRecommendations(
    request: PersonalizedRecommendationRequest
  ): Promise<VectorSearchResponse> {
    const response = await apiClient.post('/vector-search/recommendations', request);
    return response.data;
  },

  /**
   * 벡터 검색 서비스 통계
   * 서비스 상태 및 성능 정보
   */
  async getStats(): Promise<VectorSearchStats> {
    const response = await apiClient.get('/vector-search/stats');
    return response.data;
  },

  /**
   * 캐시 상태 조회
   * 캐시 성능 및 상태 정보
   */
  async getCacheStatus(): Promise<CacheStatus> {
    const response = await apiClient.get('/vector-search/cache/status');
    return response.data;
  },

  /**
   * 캐시 무효화
   * 모든 벡터 검색 캐시를 삭제
   */
  async invalidateCache(): Promise<{ message: string; timestamp: string }> {
    const response = await apiClient.post('/vector-search/cache/invalidate');
    return response.data;
  },

  /**
   * 인기 검색어 조회
   * 자주 검색되는 쿼리 목록
   */
  async getPopularQueries(limit: number = 10): Promise<{
    queries: PopularQuery[];
    totalQueries: number;
    lastUpdated: string;
  }> {
    const response = await apiClient.get(`/vector-search/popular-queries?limit=${limit}`);
    return response.data;
  },

  /**
   * 캐시 워밍업
   * 인기 검색어들을 미리 캐싱하여 성능 향상
   */
  async warmupCache(queries: string[]): Promise<{
    message: string;
    queriesCount: number;
    timestamp: string;
  }> {
    const response = await apiClient.post('/vector-search/cache/warmup', { queries });
    return response.data;
  }
};

/**
 * 벡터 검색 유틸리티 함수들
 */
export const vectorSearchUtils = {
  /**
   * 검색 결과 품질 점수를 백분율로 변환
   */
  formatSimilarityScore(score: number): string {
    // Elasticsearch 점수는 보통 0~2 범위이므로 조정
    const percentage = Math.min(Math.max((score - 1) * 100, 0), 100);
    return `${percentage.toFixed(1)}%`;
  },

  /**
   * 검색 메서드에 따른 아이콘 반환
   */
  getSearchMethodIcon(method: 'vector' | 'text' | 'hybrid'): string {
    switch (method) {
      case 'vector': return '🧠';
      case 'text': return '🔍';
      case 'hybrid': return '⚡';
      default: return '🔍';
    }
  },

  /**
   * 검색 메서드 설명 반환
   */
  getSearchMethodDescription(method: 'vector' | 'text' | 'hybrid'): string {
    switch (method) {
      case 'vector': return '의미적 유사도 기반 AI 검색';
      case 'text': return '키워드 기반 텍스트 검색';
      case 'hybrid': return '의미 검색 + 텍스트 검색 결합';
      default: return '검색';
    }
  },

  /**
   * 사용자 알레르기 정보를 벡터 검색 형식으로 변환
   */
  formatAllergiesForVectorSearch(allergies: string[]): string[] {
    const allergyMapping: Record<string, string> = {
      '견과류': 'nuts',
      '유제품': 'dairy',
      '달걀': 'eggs',
      '갑각류': 'shellfish',
      '콩': 'soy',
      '밀': 'wheat',
      '생선': 'fish'
    };

    return allergies.map(allergy => allergyMapping[allergy] || allergy.toLowerCase());
  },

  /**
   * 검색 시간을 사용자 친화적 형식으로 변환
   */
  formatSearchTime(milliseconds: number): string {
    if (milliseconds < 100) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 1000) {
      return `${Math.round(milliseconds)}ms`;
    } else {
      return `${(milliseconds / 1000).toFixed(1)}초`;
    }
  },

  /**
   * 캐시 적중 여부에 따른 성능 정보 반환
   */
  getPerformanceInfo(metadata: VectorSearchResponse['metadata']): {
    isCached: boolean;
    performanceLevel: 'excellent' | 'good' | 'average' | 'slow';
    description: string;
  } {
    const isCached = metadata.fromCache || metadata.cacheHit || false;
    const totalTime = metadata.elasticsearchTime + (metadata.queryEmbeddingTime || 0);

    let performanceLevel: 'excellent' | 'good' | 'average' | 'slow';
    let description: string;

    if (isCached) {
      performanceLevel = 'excellent';
      description = '캐시된 결과 (초고속)';
    } else if (totalTime < 100) {
      performanceLevel = 'excellent';
      description = '매우 빠름';
    } else if (totalTime < 300) {
      performanceLevel = 'good';
      description = '빠름';
    } else if (totalTime < 600) {
      performanceLevel = 'average';
      description = '보통';
    } else {
      performanceLevel = 'slow';
      description = '느림';
    }

    return { isCached, performanceLevel, description };
  }
};