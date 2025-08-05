import { apiClient } from '@/lib/api';

export interface EnhancedSearchRequest {
  query: string;
  page?: number;
  limit?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface BasicQueryRequest {
  query: string;
}

export interface EnhancedRecipe {
  id: string;
  name: string;
  name_ko?: string;
  description: string;
  description_ko?: string;
  ingredients: string[];
  ingredients_ko?: string[];
  steps: string;
  minutes: number;
  tags: string[];
  _score?: number;
  highlights?: any;
  improved_steps?: string[];
  difficulty_level?: 'easy' | 'medium' | 'hard';
  user_tips?: string[];
  time_saving_tips?: string[];
  semantic_score?: number;
}

export interface EnhancedSearchResult {
  recipes: EnhancedRecipe[];
  total: number;
  page: number;
  totalPages: number;
  semantic_explanation?: string;
  cooking_tips?: string;
}

export interface RagQueryResult {
  query: string;
  response: string;
  sources: Array<{ name: string; id: string }>;
  timestamp: Date;
  enhanced_data?: EnhancedSearchResult;
}

export interface SearchProgress {
  stage: 'initializing' | 'searching' | 'enhancing' | 'generating_tips' | 'completed' | 'error';
  message: string;
  progress: number; // 0-100
  elapsed: number; // 경과 시간 (초)
}

// 검색 상태 관리를 위한 클래스
export class RAGSearchSession {
  private startTime: number = 0;
  private currentStage: SearchProgress['stage'] = 'initializing';
  private progressCallback?: (progress: SearchProgress) => void;
  private abortController?: AbortController;

  constructor(onProgress?: (progress: SearchProgress) => void) {
    this.progressCallback = onProgress;
  }

  private updateProgress(stage: SearchProgress['stage'], message: string, progress: number) {
    this.currentStage = stage;
    const elapsed = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
    
    if (this.progressCallback) {
      this.progressCallback({
        stage,
        message,
        progress,
        elapsed
      });
    }
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async enhancedSearchWithProgress(request: EnhancedSearchRequest): Promise<{
    success: boolean;
    data: EnhancedSearchResult;
    meta: any;
  }> {
    this.startTime = Date.now();
    this.abortController = new AbortController();

    try {
      // 1단계: 초기화
      this.updateProgress('initializing', '검색을 준비하고 있습니다...', 0);
      await this.sleep(500);

      // 2단계: 의미 분석 및 검색
      this.updateProgress('searching', '의미를 분석하고 관련 레시피를 찾고 있습니다...', 20);
      
      // API 호출 (타임아웃 10분 설정)
      const response = await Promise.race([
        apiClient.postLongRunning('/rag/enhanced-search', request, {
          signal: this.abortController.signal,
        }),
        this.simulateProgress()
      ]);

      if (this.abortController.signal.aborted) {
        throw new Error('검색이 취소되었습니다.');
      }

      // 3단계: 요리법 개선
      this.updateProgress('enhancing', '사용자 수준에 맞는 요리법을 개선하고 있습니다...', 70);
      await this.sleep(1000);

      // 4단계: 팁 생성
      this.updateProgress('generating_tips', '실용적인 요리 팁을 생성하고 있습니다...', 90);
      await this.sleep(800);

      // 완료
      this.updateProgress('completed', '검색이 완료되었습니다!', 100);
      
      return response as any;

    } catch (error: any) {
      this.updateProgress('error', `검색 중 오류가 발생했습니다: ${error.message}`, 0);
      throw error;
    }
  }

  // 진행상황 시뮬레이션 (실제 API 응답 대기 중)
  private async simulateProgress(): Promise<never> {
    const stages = [
      { progress: 30, message: '검색어를 의미적으로 확장하고 있습니다...', duration: 2000 },
      { progress: 45, message: '레시피 데이터베이스에서 검색 중...', duration: 3000 },
      { progress: 55, message: '의미적 유사도를 계산하고 있습니다...', duration: 2500 },
      { progress: 65, message: '결과를 재순위로 정렬하고 있습니다...', duration: 1500 },
    ];

    for (const stage of stages) {
      if (this.abortController?.signal.aborted) break;
      
      this.updateProgress('searching', stage.message, stage.progress);
      await this.sleep(stage.duration);
    }

    // 무한 대기 (실제 API 응답을 기다림)
    return new Promise(() => {});
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.updateProgress('error', '검색이 사용자에 의해 취소되었습니다.', 0);
    }
  }

  getElapsedTime(): number {
    return this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
  }
}

export const ragSearchService = {
  // 기본 RAG 검색 (호환성)
  async basicQuery(request: BasicQueryRequest): Promise<{
    success: boolean;
    data: RagQueryResult;
  }> {
    const response = await apiClient.postLongRunning('/rag/query', request);
    return response.data;
  },

  // 의미 기반 검색 + 요리법 개선 (진행상황 없음)
  async enhancedSearch(request: EnhancedSearchRequest): Promise<{
    success: boolean;
    data: EnhancedSearchResult;
    meta: {
      semantic_enhanced: boolean;
      user_skill_level: string;
      query_expansion: boolean;
    };
  }> {
    const response = await apiClient.postLongRunning('/rag/enhanced-search', request);
    return response.data;
  },

  // 진행상황과 함께 검색
  createSearchSession(onProgress?: (progress: SearchProgress) => void): RAGSearchSession {
    return new RAGSearchSession(onProgress);
  },

  // 빠른 의미 기반 검색 (기본 설정)
  async quickSemanticSearch(query: string, onProgress?: (progress: SearchProgress) => void): Promise<EnhancedSearchResult> {
    const session = this.createSearchSession(onProgress);
    const response = await session.enhancedSearchWithProgress({
      query,
      page: 1,
      limit: 5,
      skill_level: 'intermediate'
    });
    return response.data;
  },

  // 초보자용 상세 검색
  async beginnerSearch(
    query: string, 
    page = 1, 
    limit = 10,
    onProgress?: (progress: SearchProgress) => void
  ): Promise<EnhancedSearchResult> {
    const session = this.createSearchSession(onProgress);
    const response = await session.enhancedSearchWithProgress({
      query,
      page,
      limit,
      skill_level: 'beginner'
    });
    return response.data;
  },

  // 고급 사용자용 검색
  async advancedSearch(
    query: string, 
    page = 1, 
    limit = 10,
    onProgress?: (progress: SearchProgress) => void
  ): Promise<EnhancedSearchResult> {
    const session = this.createSearchSession(onProgress);
    const response = await session.enhancedSearchWithProgress({
      query,
      page,
      limit,
      skill_level: 'advanced'
    });
    return response.data;
  },

  // 타임아웃과 함께 안전한 검색
  async safeEnhancedSearch(
    request: EnhancedSearchRequest,
    timeoutMs: number = 600000, // 기본 10분
    onProgress?: (progress: SearchProgress) => void
  ): Promise<EnhancedSearchResult> {
    const session = this.createSearchSession(onProgress);
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        session.abort();
        reject(new Error(`검색 시간이 ${timeoutMs / 1000}초를 초과했습니다. 다시 시도해주세요.`));
      }, timeoutMs);
    });

    const searchPromise = session.enhancedSearchWithProgress(request);
    
    try {
      const response = await Promise.race([searchPromise, timeoutPromise]);
      return response.data;
    } catch (error) {
      session.abort();
      throw error;
    }
  }
};