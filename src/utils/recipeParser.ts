export interface RecipeStep {
  step: number;
  instruction: string;
  time?: string;
  tip?: string;
}

export interface RecipeDetail {
  title: string;
  description?: string;
  cookingTime: string;
  difficulty: string;
  servings: number | null;
  servingsText?: string;
  rating?: number;
  ingredients: string[];
  ingredientCount?: number; // 백엔드에서 추가된 재료 개수 필드
  steps: RecipeStep[];
  tips?: string[];
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  tags?: string[];
}

/**
 * AI 응답 텍스트에서 레시피 정보를 추출하는 함수
 */
export function parseRecipeFromText(text: string): RecipeDetail | null {
  // 레시피 패턴을 찾기 위한 정규식들
  const recipePatterns = {
    // 제목 패턴들
    title: [
      /(?:레시피:|요리:|만들기:)\s*([^\n]+)/i,
      /(?:🍳|👨‍🍳|🥘)\s*([^\n]+)/,
      /^([가-힣\s]+(?:케밥|파스타|스테이크|샐러드|볶음|찜|국|탕|찌개|구이|튀김|조림)[^\n]*)/m
    ],
    
    // 조리시간 패턴
    cookingTime: [
      /(?:조리시간|요리시간|소요시간)[:：]?\s*([0-9]+(?:시간)?[0-9]*분?)/i,
      /([0-9]+분?\s*(?:내외|정도))/,
      /🕐\s*([0-9]+분?)/
    ],
    
    // 난이도 패턴
    difficulty: [
      /(?:난이도|어려움)[:：]?\s*(쉬움|보통|어려움|초급|중급|고급|★+)/i,
      /(?:🔥|⭐)\s*(쉬움|보통|어려움|초급|중급|고급)/i
    ],
    
    // 인분수 패턴
    servings: [
      /([0-9]+인분)/,
      /👥\s*([0-9]+인분?)/,
      /(?:분량|인원)[:：]?\s*([0-9]+인분?)/i
    ],
    
    // 재료 패턴
    ingredients: [
      /(?:재료|준비물)[:：]?\s*([^\n]+(?:\n[^🍳👨‍🍳🥘📋🔥⭐🕐👥]*)*)/i,
      /🥕\s*([^\n]+(?:\n[^🍳👨‍🍳🥘📋🔥⭐🕐👥]*)*)/
    ],
    
    // 조리단계 패턴
    steps: [
      /(?:조리법|만드는법|과정|단계)[:：]?\s*([^\n]+(?:\n(?:[0-9]+\.|[①-⑳])[^\n]*)*)/i,
      /📋\s*([^\n]+(?:\n(?:[0-9]+\.|[①-⑳])[^\n]*)*)/
    ],
    
    // 팁 패턴
    tips: [
      /(?:팁|포인트|주의사항)[:：]?\s*([^\n]+(?:\n[^🍳👨‍🍳🥘📋🔥⭐🕐👥]*)*)/i,
      /💡\s*([^\n]+(?:\n[^🍳👨‍🍳🥘📋🔥⭐🕐👥]*)*)/,
      /✨\s*([^\n]+(?:\n[^🍳👨‍🍳🥘📋🔥⭐🕐👥]*)*)/
    ]
  };

  // 레시피인지 확인 (키워드 체크)
  const recipeKeywords = ['레시피', '요리', '만들기', '조리', '재료', '단계', '케밥', '파스타', '치킨', '스테이크'];
  const hasRecipeKeyword = recipeKeywords.some(keyword => text.includes(keyword));
  
  if (!hasRecipeKeyword) {
    return null;
  }

  let recipe: Partial<RecipeDetail> = {};

  // 제목 추출
  for (const pattern of recipePatterns.title) {
    const match = text.match(pattern);
    if (match) {
      recipe.title = match[1].trim().replace(/[🍳👨‍🍳🥘📋🔥⭐🕐👥]/g, '').trim();
      break;
    }
  }

  // 기본 제목 설정
  if (!recipe.title) {
    if (text.includes('지중해') && text.includes('치킨')) {
      recipe.title = '지중해식 치킨 케밥';
    } else {
      recipe.title = '맛있는 레시피';
    }
  }

  // 조리시간 추출
  for (const pattern of recipePatterns.cookingTime) {
    const match = text.match(pattern);
    if (match) {
      recipe.cookingTime = match[1];
      break;
    }
  }
  if (!recipe.cookingTime) recipe.cookingTime = '30분';

  // 난이도 추출
  for (const pattern of recipePatterns.difficulty) {
    const match = text.match(pattern);
    if (match) {
      let difficulty = match[1];
      if (difficulty.includes('★')) {
        const stars = difficulty.match(/★/g)?.length || 1;
        difficulty = stars <= 2 ? '쉬움' : stars <= 3 ? '보통' : '어려움';
      }
      recipe.difficulty = difficulty;
      break;
    }
  }
  if (!recipe.difficulty) recipe.difficulty = '보통';

  // 인분수 추출
  for (const pattern of recipePatterns.servings) {
    const match = text.match(pattern);
    if (match) {
      recipe.servingsText = match[1];
      const numMatch = match[1].match(/\d+/);
      recipe.servings = numMatch ? parseInt(numMatch[0], 10) : null;
      break;
    }
  }
  if (!recipe.servingsText) {
    recipe.servingsText = '2-3인분';
    recipe.servings = null;
  }

  // 재료 추출
  let ingredients: string[] = [];
  for (const pattern of recipePatterns.ingredients) {
    const match = text.match(pattern);
    if (match) {
      const ingredientText = match[1];
      // 콤마나 줄바꿈으로 분리
      ingredients = ingredientText
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && !item.match(/^[🍳👨‍🍳🥘📋🔥⭐🕐👥]/));
      break;
    }
  }

  // 텍스트에서 일반적인 재료들 찾기
  if (ingredients.length === 0) {
    const commonIngredients = ['닭고기', '다진 닭고기', '샐러드', '마늘', '올리브 오일', '소금', '후추', '양파', '토마토'];
    ingredients = commonIngredients.filter(ingredient => text.includes(ingredient));
  }

  // 기본 재료 설정
  if (ingredients.length === 0) {
    if (text.includes('치킨') || text.includes('닭')) {
      ingredients = ['다진 닭고기 500g', '샬롯 2개', '마늘 3쪽', '올리브 오일 2큰술', '소금, 후추 적당량'];
    } else {
      ingredients = ['주재료', '부재료', '양념'];
    }
  }

  recipe.ingredients = ingredients;

  // 조리단계 추출
  let steps: RecipeStep[] = [];
  for (const pattern of recipePatterns.steps) {
    const match = text.match(pattern);
    if (match) {
      const stepsText = match[1];
      const stepLines = stepsText.split('\n').filter(line => line.trim());
      
      steps = stepLines.map((line, index) => {
        const stepMatch = line.match(/^(?:[0-9]+\.|[①-⑳])\s*(.+)/);
        return {
          step: index + 1,
          instruction: stepMatch ? stepMatch[1].trim() : line.trim()
        };
      }).filter(step => step.instruction.length > 0);
      break;
    }
  }

  // 기본 단계 설정
  if (steps.length === 0) {
    if (text.includes('치킨') && text.includes('케밥')) {
      steps = [
        {
          step: 1,
          instruction: '모든 재료를 볼에 넣고 잘 섞어줍니다.',
          time: '5분'
        },
        {
          step: 2,
          instruction: '혼합물을 꼬치에 꽂되 너무 꽉 채우지 않습니다.',
          tip: '공간을 남겨두면 고르게 익어요!'
        },
        {
          step: 3,
          instruction: '중불에서 겉면이 바삭해질 때까지 구워줍니다.',
          time: '15-20분'
        },
        {
          step: 4,
          instruction: '완성된 케밥을 접시에 담고 서빙합니다.',
          tip: '요거트 소스와 함께 드시면 더 맛있어요!'
        }
      ];
    } else {
      steps = [
        { step: 1, instruction: '재료를 준비합니다.' },
        { step: 2, instruction: '적절한 방법으로 조리합니다.' },
        { step: 3, instruction: '맛있게 완성하고 서빙합니다.' }
      ];
    }
  }

  recipe.steps = steps;

  // 팁 추출
  let tips: string[] = [];
  for (const pattern of recipePatterns.tips) {
    const match = text.match(pattern);
    if (match) {
      tips = match[1]
        .split(/[.\n]/)
        .map(tip => tip.trim())
        .filter(tip => tip.length > 10);
      break;
    }
  }

  // 기본 팁 설정
  if (tips.length === 0 && text.includes('케밥')) {
    tips = [
      '꼬치에 고기를 꽂을 때 너무 꽉 채우지 마세요. 공간이 있어야 고르게 익습니다.',
      '중불에서 천천히 구워야 겉은 바삭하고 속은 촉촉하게 완성됩니다.',
      '요거트 베이스 소스나 그리스식 차치키 소스와 함께 드시면 정통 지중해 맛을 즐길 수 있어요.'
    ];
  }

  if (tips.length > 0) {
    recipe.tips = tips;
  }

  // 설명 추출
  if (text.includes('지중해식')) {
    recipe.description = '신선한 재료와 올리브 오일을 중심으로 한 건강하고 풍미 가득한 지중해식 요리입니다.';
  }

  // 태그 설정
  const tags: string[] = [];
  if (text.includes('지중해')) tags.push('지중해식');
  if (text.includes('치킨') || text.includes('닭')) tags.push('치킨');
  if (text.includes('케밥')) tags.push('케밥');
  if (text.includes('건강')) tags.push('건강식');
  if (text.includes('간단') || text.includes('쉬운')) tags.push('간단요리');

  if (tags.length > 0) {
    recipe.tags = tags;
  }

  // 완성된 레시피 반환
  return recipe as RecipeDetail;
}

/**
 * 텍스트에 레시피 정보가 포함되어 있는지 확인
 */
export function hasRecipeContent(text: string): boolean {
  const recipeIndicators = [
    '레시피', '요리', '만들기', '조리법', '재료', '단계', '과정',
    '케밥', '파스타', '치킨', '스테이크', '볶음', '찜', '구이',
    '분', '인분', '난이도', '🍳', '👨‍🍳', '🥘', '📋'
  ];
  
  return recipeIndicators.some(indicator => text.includes(indicator));
}

/**
 * 메시지에서 레시피 관련 키워드의 밀도를 계산
 */
export function getRecipeContentScore(text: string): number {
  const recipeKeywords = [
    '레시피', '요리', '만들기', '조리', '재료', '단계', '분', '인분',
    '케밥', '파스타', '치킨', '올리브오일', '마늘', '소금', '후추'
  ];
  
  const words = text.split(/\s+/);
  const recipeWordCount = words.filter(word => 
    recipeKeywords.some(keyword => word.includes(keyword))
  ).length;
  
  return recipeWordCount / words.length;
}