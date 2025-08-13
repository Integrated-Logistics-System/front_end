import { RecipeDetail } from '@/utils/recipeParser';

/**
 * 마크다운 형태의 레시피 텍스트를 RecipeDetail 객체로 파싱
 */
export function parseRecipeMarkdown(markdownText: string): RecipeDetail | null {
  try {
    // 제목 추출
    const titleMatch = markdownText.match(/🍳\s*\*\*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1].trim() : '레시피';

    // 재료 섹션 파싱
    const ingredientsMatch = markdownText.match(/🥘\s*\*\*재료\*\*(.*?)(?=🔥|💡|⚠️|$)/s);
    const ingredients: string[] = [];
    if (ingredientsMatch) {
      const ingredientLines = ingredientsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
      ingredients.push(...ingredientLines);
    }

    // 조리법 섹션 파싱
    const stepsMatch = markdownText.match(/🔥\s*\*\*조리법\*\*(.*?)(?=💡|⚠️|$)/s);
    const steps: { step: number; instruction: string; time?: string; tip?: string }[] = [];
    if (stepsMatch) {
      const stepLines = stepsMatch[1]
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()));
      
      stepLines.forEach((line, index) => {
        const stepText = line.replace(/^\d+\.\s*/, '').trim();
        const timeMatch = stepText.match(/(\d+분)/);
        
        steps.push({
          step: index + 1,
          instruction: stepText,
          time: timeMatch ? timeMatch[1] : undefined,
        });
      });
    }

    // 요리 팁 파싱
    const tipsMatch = markdownText.match(/💡\s*\*\*요리 팁\*\*(.*?)(?=⚠️|💡|$)/s);
    const tips: string[] = [];
    if (tipsMatch) {
      const tipLines = tipsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
      tips.push(...tipLines);
    }

    // 인분 수 추출 (재료 섹션에서)
    const servingsMatch = markdownText.match(/\((\d+[-~]\d+)인분\)|【(\d+[-~]\d+)인분】/);
    const servingsText = servingsMatch ? `${servingsMatch[1] || servingsMatch[2]}인분` : '2-3인분';

    // 조리 시간 추출 (대략적으로 계산)
    const totalTime = steps.reduce((acc, step) => {
      const timeMatch = step.instruction.match(/(\d+)분/);
      return acc + (timeMatch ? parseInt(timeMatch[1]) : 5);
    }, 0);

    const recipeDetail: RecipeDetail = {
      title,
      description: `${title}을 맛있게 만드는 방법입니다.`,
      cookingTime: totalTime > 0 ? `${totalTime}분` : '30분',
      difficulty: '보통',
      servings: null,
      servingsText,
      rating: 4.5,
      ingredientCount: ingredients.length,
      tags: ['한식', '찌개', '집밥'],
      ingredients,
      steps,
      tips,
      nutritionInfo: undefined, // 마크다운에서 영양정보는 파싱하지 않음
    };

    return recipeDetail;
  } catch (error) {
    console.error('레시피 마크다운 파싱 실패:', error);
    return null;
  }
}

/**
 * 텍스트가 레시피 마크다운 형태인지 확인
 */
export function isRecipeMarkdown(text: string): boolean {
  // 레시피 마크다운의 특징적인 패턴들 확인
  const patterns = [
    /🍳.*\*\*.*만드는 법\*\*/,
    /🥘.*\*\*재료\*\*/,
    /🔥.*\*\*조리법\*\*/,
    /\d+\.\s+.*(끓|볶|썰|넣)/
  ];

  return patterns.some(pattern => pattern.test(text));
}