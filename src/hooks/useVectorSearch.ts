import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/authStore';
import { 
  vectorSearchService, 
  vectorSearchUtils,
  VectorSearchRequest, 
  VectorSearchResponse, 
  VectorSearchResult,
  PersonalizedRecommendationRequest,
  SimilarRecipesResponse 
} from '@/services/vector-search.service';
import { Recipe } from '@/services/recipe.service';

export interface VectorSearchFilters {
  // 검색 가중치 설정
  vectorWeight?: number;
  textWeight?: number;
  useHybridSearch?: boolean;
  minScore?: number;
  
  // 개인화 필터
  allergies?: string[];
  preferences?: string[];
  
  // 추가 필터
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCookTime?: number;
  favoriteIngredients?: string[];
  dietaryRestrictions?: string[];
}

export interface VectorSearchState {
  results: VectorSearchResult[];
  loading: boolean;
  error: string | null;
  searchResponse: VectorSearchResponse | null;
  hasSearched: boolean;
  currentQuery: string;
  currentFilters: VectorSearchFilters;
}

/**
 * 벡터 검색을 위한 React Hook
 * 의미적 유사도 기반 레시피 검색 및 개인화 추천
 */
export const useVectorSearch = () => {
  const auth = useRecoilValue(authState);
  
  const [state, setState] = useState<VectorSearchState>({
    results: [],
    loading: false,
    error: null,
    searchResponse: null,
    hasSearched: false,
    currentQuery: '',
    currentFilters: {}
  });

  const [recommendations, setRecommendations] = useState<VectorSearchResult[]>([]);
  const [similarRecipes, setSimilarRecipes] = useState<SimilarRecipesResponse | null>(null);
  const [popularQueries, setPopularQueries] = useState<string[]>([]);

  // 사용자 알레르기 정보를 벡터 검색 형식으로 변환
  const userAllergies = useMemo(() => {
    if (!auth.user?.allergies) return [];
    return vectorSearchUtils.formatAllergiesForVectorSearch(auth.user.allergies);
  }, [auth.user?.allergies]);

  // 기본 검색 필터 (사용자 정보 반영)
  const defaultFilters = useMemo((): VectorSearchFilters => ({
    vectorWeight: 0.7,
    textWeight: 0.3,
    useHybridSearch: true,
    minScore: 0.2,
    allergies: userAllergies,
    preferences: []
  }), [userAllergies]);

  /**
   * 벡터 검색 실행
   */
  const searchRecipes = useCallback(async (
    query: string,
    filters: VectorSearchFilters = {}
  ) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, error: '검색어를 입력해주세요' }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        currentQuery: query,
        currentFilters: filters
      }));

      const searchRequest: VectorSearchRequest = {
        query: query.trim(),
        k: 20, // 기본 20개 결과
        vectorWeight: filters.vectorWeight ?? defaultFilters.vectorWeight,
        textWeight: filters.textWeight ?? defaultFilters.textWeight,
        useHybridSearch: filters.useHybridSearch ?? defaultFilters.useHybridSearch,
        minScore: filters.minScore ?? defaultFilters.minScore,
        allergies: [...(filters.allergies || []), ...userAllergies],
        preferences: filters.preferences || []
      };

      const response = await vectorSearchService.search(searchRequest);

      setState(prev => ({
        ...prev,
        results: response.results,
        searchResponse: response,
        hasSearched: true,
        loading: false
      }));

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || '검색 중 오류가 발생했습니다',
        loading: false
      }));
      console.error('Vector search error:', err);
    }
  }, [defaultFilters, userAllergies]);

  /**
   * 간단한 벡터 검색 (빠른 검색용)
   */
  const quickSearch = useCallback(async (query: string, k: number = 10) => {
    if (!query.trim()) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await vectorSearchService.simpleSearch(query, {
        k,
        hybrid: true,
        allergies: userAllergies
      });

      setState(prev => ({
        ...prev,
        results: response.results,
        searchResponse: response,
        hasSearched: true,
        loading: false,
        currentQuery: query
      }));

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || '검색 중 오류가 발생했습니다',
        loading: false
      }));
    }
  }, [userAllergies]);

  /**
   * 개인화된 레시피 추천
   */
  const getPersonalizedRecommendations = useCallback(async (
    customPreferences?: string[],
    k: number = 15
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const request: PersonalizedRecommendationRequest = {
        preferences: customPreferences || [
          'healthy', 'quick', 'korean', 'popular'
        ],
        allergies: userAllergies,
        favoriteIngredients: [],
        difficulty: 'easy',
        maxCookTime: 60,
        k
      };

      const response = await vectorSearchService.getPersonalizedRecommendations(request);
      setRecommendations(response.results);

      setState(prev => ({ ...prev, loading: false }));

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || '추천 레시피 로드 실패',
        loading: false
      }));
      console.error('Personalized recommendations error:', err);
    }
  }, [userAllergies]);

  /**
   * 유사한 레시피 검색
   */
  const findSimilarRecipes = useCallback(async (
    recipeId: string,
    k: number = 8
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await vectorSearchService.findSimilarRecipes(recipeId, {
        k,
        allergies: userAllergies
      });

      setSimilarRecipes(response);
      setState(prev => ({ ...prev, loading: false }));

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || '유사 레시피 검색 실패',
        loading: false
      }));
      console.error('Similar recipes search error:', err);
    }
  }, [userAllergies]);

  /**
   * 인기 검색어 로드
   */
  const loadPopularQueries = useCallback(async () => {
    try {
      const response = await vectorSearchService.getPopularQueries(10);
      setPopularQueries(response.queries.map(q => q.query));
    } catch (err: any) {
      console.error('Failed to load popular queries:', err);
    }
  }, []);

  /**
   * 검색 결과 초기화
   */
  const clearResults = useCallback(() => {
    setState({
      results: [],
      loading: false,
      error: null,
      searchResponse: null,
      hasSearched: false,
      currentQuery: '',
      currentFilters: {}
    });
    setRecommendations([]);
    setSimilarRecipes(null);
  }, []);

  /**
   * 검색 필터 업데이트
   */
  const updateFilters = useCallback((newFilters: Partial<VectorSearchFilters>) => {
    setState(prev => ({
      ...prev,
      currentFilters: { ...prev.currentFilters, ...newFilters }
    }));
  }, []);

  /**
   * 현재 검색으로 재검색
   */
  const refreshSearch = useCallback(() => {
    if (state.currentQuery) {
      searchRecipes(state.currentQuery, state.currentFilters);
    }
  }, [state.currentQuery, state.currentFilters, searchRecipes]);

  // 컴포넌트 마운트 시 인기 검색어 로드
  useEffect(() => {
    loadPopularQueries();
  }, [loadPopularQueries]);

  // 검색 성능 정보 계산
  const performanceInfo = useMemo(() => {
    if (!state.searchResponse?.metadata) return null;
    return vectorSearchUtils.getPerformanceInfo(state.searchResponse.metadata);
  }, [state.searchResponse?.metadata]);

  // 검색 메타데이터 포맷팅
  const searchMetadata = useMemo(() => {
    if (!state.searchResponse) return null;

    const { searchTime, searchMethod, total, maxScore, metadata } = state.searchResponse;

    return {
      searchTime: vectorSearchUtils.formatSearchTime(searchTime),
      searchMethod: {
        type: searchMethod,
        icon: vectorSearchUtils.getSearchMethodIcon(searchMethod),
        description: vectorSearchUtils.getSearchMethodDescription(searchMethod)
      },
      total,
      maxScore: vectorSearchUtils.formatSimilarityScore(maxScore),
      performance: performanceInfo,
      weights: {
        vector: `${Math.round(metadata.vectorWeight * 100)}%`,
        text: `${Math.round(metadata.textWeight * 100)}%`
      }
    };
  }, [state.searchResponse, performanceInfo]);

  return {
    // 검색 상태
    ...state,
    recommendations,
    similarRecipes,
    popularQueries,
    
    // 검색 메타데이터
    searchMetadata,
    performanceInfo,
    
    // 검색 함수들
    searchRecipes,
    quickSearch,
    getPersonalizedRecommendations,
    findSimilarRecipes,
    loadPopularQueries,
    
    // 유틸리티
    clearResults,
    updateFilters,
    refreshSearch,
    
    // 설정
    defaultFilters,
    userAllergies
  };
};

/**
 * 벡터 검색 통계를 위한 Hook
 */
export const useVectorSearchStats = () => {
  const [stats, setStats] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, cacheResponse] = await Promise.all([
        vectorSearchService.getStats(),
        vectorSearchService.getCacheStatus()
      ]);
      
      setStats(statsResponse);
      setCacheStatus(cacheResponse);
    } catch (err) {
      console.error('Failed to load vector search stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback(async () => {
    try {
      await vectorSearchService.invalidateCache();
      // 캐시 상태 새로고침
      const cacheResponse = await vectorSearchService.getCacheStatus();
      setCacheStatus(cacheResponse);
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    cacheStatus,
    loading,
    loadStats,
    invalidateCache
  };
};