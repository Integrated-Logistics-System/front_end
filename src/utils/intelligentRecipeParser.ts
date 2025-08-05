import { RecipeDetail } from '@/utils/recipeParser';
import { RECIPE_DATABASE, RECIPE_KEYWORD_MAP, RECIPE_CATEGORIES } from '@/data/recipeDatabase';

/**
 * 지능형 레시피 매칭 및 파싱 시스템
 */
export class IntelligentRecipeParser {
  
  /**
   * 텍스트에서 가장 관련성 높은 레시피를 찾아 반환
   */
  static findBestMatchingRecipe(text: string): RecipeDetail | null {
    const normalizedText = text.toLowerCase();
    
    // 1단계: 직접 키워드 매칭으로 후보 찾기
    const candidates = this.findCandidateRecipes(normalizedText);
    
    if (candidates.length === 0) {
      return null;
    }
    
    // 2단계: 관련성 점수 계산
    const scoredCandidates = candidates.map(recipeId => ({
      recipeId,
      score: this.calculateRelevanceScore(normalizedText, recipeId)
    }));
    
    // 3단계: 가장 높은 점수의 레시피 선택
    const bestMatch = scoredCandidates.sort((a, b) => b.score - a.score)[0];
    
    // 최소 점수 임계값 확인
    if (bestMatch.score < 0.3) {
      return null;
    }
    
    return RECIPE_DATABASE[bestMatch.recipeId];
  }
  
  /**
   * 키워드 기반으로 후보 레시피들 찾기
   */
  private static findCandidateRecipes(text: string): string[] {
    const candidates = new Set<string>();
    
    // 각 레시피의 키워드들과 매칭
    Object.entries(RECIPE_KEYWORD_MAP).forEach(([recipeId, keywords]) => {
      const hasMatchingKeyword = keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
      
      if (hasMatchingKeyword) {
        candidates.add(recipeId);
      }
    });
    
    return Array.from(candidates);
  }
  
  /**
   * 텍스트와 레시피 간의 관련성 점수 계산
   */
  private static calculateRelevanceScore(text: string, recipeId: string): number {
    const keywords = RECIPE_KEYWORD_MAP[recipeId] || [];
    const recipe = RECIPE_DATABASE[recipeId];
    
    let score = 0;
    let totalPossibleScore = 0;
    
    // 1. 키워드 매칭 점수 (60%)
    keywords.forEach(keyword => {
      totalPossibleScore += 0.6;
      if (text.includes(keyword.toLowerCase())) {
        score += 0.6;
        
        // 정확한 매칭에 보너스 점수
        const exactMatches = text.split(keyword.toLowerCase()).length - 1;
        score += exactMatches * 0.1;
      }
    });
    
    // 2. 레시피 제목 매칭 점수 (20%)
    totalPossibleScore += 0.2;
    const titleWords = recipe.title.toLowerCase().split(' ');
    const titleMatches = titleWords.filter(word => text.includes(word)).length;
    score += (titleMatches / titleWords.length) * 0.2;
    
    // 3. 태그 매칭 점수 (15%)
    if (recipe.tags) {
      totalPossibleScore += 0.15;
      const tagMatches = recipe.tags.filter(tag => 
        text.includes(tag.toLowerCase())
      ).length;
      score += (tagMatches / recipe.tags.length) * 0.15;
    }
    
    // 4. 컨텍스트 보너스 점수 (5%)
    totalPossibleScore += 0.05;
    if (this.hasRecipeContext(text)) {
      score += 0.05;
    }
    
    // 정규화된 점수 반환 (0~1)
    return totalPossibleScore > 0 ? score / totalPossibleScore : 0;
  }
  
  /**
   * 텍스트에 레시피 관련 컨텍스트가 있는지 확인
   */
  private static hasRecipeContext(text: string): boolean {
    const recipeContextWords = [
      '레시피', '만들기', '요리', '조리', '만드는법', '어떻게', 
      '재료', '단계', '방법', '과정', '알려줘', '가르쳐', '설명'
    ];
    
    return recipeContextWords.some(word => text.includes(word));
  }
  
  /**
   * 레시피 상세 정보가 포함된 텍스트인지 고도화된 감지
   */
  static isDetailedRecipeContent(text: string): boolean {
    const recipeIndicators = {
      // 필수 키워드 (하나라도 있어야 함)
      required: ['레시피', '요리', '만들기', '조리법', '만드는법'],
      
      // 구조적 키워드 (여러 개 있으면 높은 점수)
      structural: [
        '재료', '준비물', '단계', '과정', '방법', '조리시간', 
        '난이도', '인분', '완성', '서빙', '팁', '주의사항'
      ],
      
      // 액션 키워드 (요리 동작)
      actions: [
        '썰기', '볶기', '끓이기', '굽기', '튀기기', '찌기', '삶기',
        '섞기', '젓기', '뒤집기', '넣기', '빼기', '식히기'
      ]
    };
    
    // 필수 키워드 체크
    const hasRequired = recipeIndicators.required.some(word => 
      text.includes(word)
    );
    
    if (!hasRequired) return false;
    
    // 구조적 키워드 점수
    const structuralScore = recipeIndicators.structural.filter(word => 
      text.includes(word)
    ).length;
    
    // 액션 키워드 점수
    const actionScore = recipeIndicators.actions.filter(word => 
      text.includes(word)
    ).length;
    
    // 전체 텍스트 길이 고려
    const lengthScore = text.length > 100 ? 1 : 0;
    
    // 종합 점수 계산
    const totalScore = structuralScore + (actionScore * 0.5) + lengthScore;
    
    return totalScore >= 3; // 임계값
  }
  
  /**
   * 레시피 추천 우선순위 계산
   */
  static getRecipeRecommendations(userContext: {
    timeAvailable?: number; // 분 단위
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    dietary?: string[];
  }): string[] {
    const scores: { [key: string]: number } = {};
    
    Object.keys(RECIPE_DATABASE).forEach(recipeId => {
      const recipe = RECIPE_DATABASE[recipeId];
      let score = 1; // 기본 점수
      
      // 시간 기반 필터링
      if (userContext.timeAvailable) {
        const cookingMinutes = this.extractTimeInMinutes(recipe.cookingTime);
        if (cookingMinutes <= userContext.timeAvailable) {
          score += 2;
        } else if (cookingMinutes <= userContext.timeAvailable + 15) {
          score += 1;
        } else {
          score -= 1;
        }
      }
      
      // 난이도 기반 필터링
      if (userContext.difficulty) {
        const difficultyMap = { '쉬움': 'easy', '보통': 'medium', '어려움': 'hard' };
        const recipeDifficulty = difficultyMap[recipe.difficulty as keyof typeof difficultyMap];
        if (recipeDifficulty === userContext.difficulty) {
          score += 2;
        }
      }
      
      // 평점 보너스
      if (recipe.rating) {
        score += recipe.rating / 5; // 0~1 보너스
      }
      
      scores[recipeId] = score;
    });
    
    // 점수순으로 정렬하여 반환
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([recipeId]) => recipeId);
  }
  
  /**
   * 시간 문자열에서 분 단위 숫자 추출
   */
  private static extractTimeInMinutes(timeString: string): number {
    const hourMatch = timeString.match(/(\d+)시간/);
    const minuteMatch = timeString.match(/(\d+)분/);
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    
    return (hours * 60) + minutes;
  }
  
  /**
   * 텍스트에서 사용자 의도 분석
   */
  static analyzeUserIntent(text: string): {
    type: 'recipe_request' | 'recipe_detail' | 'general_cooking' | 'other';
    keywords: string[];
    timeConstraint?: number;
    difficultyPreference?: string;
  } {
    const normalizedText = text.toLowerCase();
    
    // 의도 분류
    let type: 'recipe_request' | 'recipe_detail' | 'general_cooking' | 'other' = 'other';
    
    if (normalizedText.includes('자세히') || normalizedText.includes('상세히') || normalizedText.includes('알려줘')) {
      type = 'recipe_detail';
    } else if (normalizedText.includes('추천') || normalizedText.includes('만들') || normalizedText.includes('요리')) {
      type = 'recipe_request';
    } else if (normalizedText.includes('팁') || normalizedText.includes('방법') || normalizedText.includes('어떻게')) {
      type = 'general_cooking';
    }
    
    // 키워드 추출
    const allKeywords = Object.values(RECIPE_KEYWORD_MAP).flat();
    const keywords = allKeywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
    
    // 시간 제약 추출
    const timeMatch = normalizedText.match(/(\d+)분/);
    const timeConstraint = timeMatch ? parseInt(timeMatch[1]) : undefined;
    
    // 난이도 선호도 추출
    let difficultyPreference: string | undefined;
    if (normalizedText.includes('간단') || normalizedText.includes('쉬운')) {
      difficultyPreference = 'easy';
    } else if (normalizedText.includes('어려운') || normalizedText.includes('복잡')) {
      difficultyPreference = 'hard';
    }
    
    return {
      type,
      keywords,
      timeConstraint,
      difficultyPreference
    };
  }
}

/**
 * 기존 파서와의 호환성을 위한 래퍼 함수
 */
export function parseRecipeFromTextAdvanced(text: string): RecipeDetail | null {
  // 1. 지능형 매칭으로 완전한 레시피 찾기
  const matchedRecipe = IntelligentRecipeParser.findBestMatchingRecipe(text);
  
  if (matchedRecipe) {
    return matchedRecipe;
  }
  
  // 2. 매칭이 안 되면 null 반환 (기본 파서 사용하지 않음)
  return null;
}

/**
 * 고도화된 레시피 컨텐츠 감지
 */
export function hasRecipeContentAdvanced(text: string): boolean {
  return IntelligentRecipeParser.isDetailedRecipeContent(text);
}

/**
 * 레시피 컨텐츠 점수 계산 (개선된 버전)
 */
export function getRecipeContentScoreAdvanced(text: string): number {
  const intent = IntelligentRecipeParser.analyzeUserIntent(text);
  
  // 의도 기반 점수
  const intentScores = {
    'recipe_detail': 0.9,
    'recipe_request': 0.7,
    'general_cooking': 0.5,
    'other': 0.1
  };
  
  let score = intentScores[intent.type];
  
  // 키워드 밀도 보너스
  const keywordDensity = intent.keywords.length / text.split(' ').length;
  score += keywordDensity * 0.3;
  
  // 최대 1.0으로 제한
  return Math.min(score, 1.0);
}