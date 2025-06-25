import { useMutation } from '@tanstack/react-query';
import { 
  ragSearchService, 
  BasicQueryRequest, 
  EnhancedSearchRequest 
} from '@/services/rag-search.service';
import toast from 'react-hot-toast';

// 기본 RAG 검색 (호환성)
export function useBasicRagQuery() {
  return useMutation({
    mutationFn: (request: BasicQueryRequest) => ragSearchService.basicQuery(request),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '기본 RAG 검색 중 오류가 발생했습니다.');
    },
  });
}

// 의미 기반 검색 + 요리법 개선
export function useEnhancedSearch() {
  return useMutation({
    mutationFn: async (request: EnhancedSearchRequest) => {
      try {
        const result = await ragSearchService.enhancedSearch(request);
        
        // 응답 구조 검증
        if (!result || typeof result !== 'object') {
          throw new Error('검색 결과가 올바르지 않습니다.');
        }
        
        // data 속성이 없으면 결과 자체를 data로 사용
        if (!result.data && (result as any).recipes) {
          return { data: result };
        }
        
        return result;
      } catch (error: any) {
        throw error;
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '향상된 검색 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });
}

// 빠른 의미 기반 검색
export function useQuickSemanticSearch() {
  return useMutation({
    mutationFn: (query: string) => ragSearchService.quickSemanticSearch(query),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '빠른 의미 검색 중 오류가 발생했습니다.');
    },
  });
}

// 초보자용 검색
export function useBeginnerSearch() {
  return useMutation({
    mutationFn: ({ query, page = 1, limit = 10 }: { 
      query: string; 
      page?: number; 
      limit?: number; 
    }) => ragSearchService.beginnerSearch(query, page, limit),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '초보자용 검색 중 오류가 발생했습니다.');
    },
  });
}

// 고급 사용자용 검색
export function useAdvancedSearch() {
  return useMutation({
    mutationFn: ({ query, page = 1, limit = 10 }: { 
      query: string; 
      page?: number; 
      limit?: number; 
    }) => ragSearchService.advancedSearch(query, page, limit),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '고급 검색 중 오류가 발생했습니다.');
    },
  });
}
