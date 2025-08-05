import { IntelligentRecipeParser } from './intelligentRecipeParser';

/**
 * 레시피 시스템 테스트 유틸리티
 */
export class RecipeTestUtils {
  
  /**
   * 다양한 테스트 케이스들
   */
  static testCases = [
    {
      name: '지중해식 치킨 케밥 직접 요청',
      input: '지중해식 스타일 레시피 자세히 알려줘',
      expectedRecipe: 'mediterranean_chicken_kebab',
      expectedScore: 0.8
    },
    {
      name: '치킨 케밥 키워드 매칭',
      input: '치킨 케밥 만드는 방법 알려주세요',
      expectedRecipe: 'mediterranean_chicken_kebab',
      expectedScore: 0.7
    },
    {
      name: '파스타 요청',
      input: '매콤한 파스타 레시피 추천해주세요',
      expectedRecipe: 'pasta_arrabbiata',
      expectedScore: 0.6
    },
    {
      name: '연어 요청',
      input: '연어 스테이크 만드는 법 자세히 설명해주세요',
      expectedRecipe: 'salmon_steak',
      expectedScore: 0.8
    },
    {
      name: '일반 대화 (레시피 아님)',
      input: '안녕하세요 오늘 날씨가 좋네요',
      expectedRecipe: null,
      expectedScore: 0.1
    }
  ];
  
  /**
   * 모든 테스트 케이스 실행
   */
  static runAllTests(): TestResult[] {
    return this.testCases.map(testCase => this.runSingleTest(testCase));
  }
  
  /**
   * 단일 테스트 케이스 실행
   */
  static runSingleTest(testCase: typeof RecipeTestUtils.testCases[0]): TestResult {
    const startTime = Date.now();
    
    try {
      // 1. 레시피 매칭 테스트
      const matchedRecipe = IntelligentRecipeParser.findBestMatchingRecipe(testCase.input);
      const actualRecipeId = matchedRecipe ? this.getRecipeId(matchedRecipe.title) : null;
      
      // 2. 컨텐츠 스코어 테스트
      const contentScore = IntelligentRecipeParser.isDetailedRecipeContent(testCase.input) ? 1 : 0;
      
      // 3. 사용자 의도 분석 테스트
      const intent = IntelligentRecipeParser.analyzeUserIntent(testCase.input);
      
      const executionTime = Date.now() - startTime;
      
      return {
        testName: testCase.name,
        input: testCase.input,
        expected: {
          recipeId: testCase.expectedRecipe,
          minScore: testCase.expectedScore
        },
        actual: {
          recipeId: actualRecipeId,
          recipe: matchedRecipe,
          contentScore,
          intent,
          executionTime
        },
        passed: this.evaluateTestResult(testCase, actualRecipeId, contentScore),
        details: {
          recipeMatch: actualRecipeId === testCase.expectedRecipe,
          scoreMatch: contentScore >= testCase.expectedScore,
          intentDetection: intent.type !== 'other' || testCase.expectedRecipe === null
        }
      };
    } catch (error) {
      return {
        testName: testCase.name,
        input: testCase.input,
        expected: {
          recipeId: testCase.expectedRecipe,
          minScore: testCase.expectedScore
        },
        actual: {
          recipeId: null,
          recipe: null,
          contentScore: 0,
          intent: { type: 'other', keywords: [] },
          executionTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : String(error)
        },
        passed: false,
        details: {
          recipeMatch: false,
          scoreMatch: false,
          intentDetection: false
        }
      };
    }
  }
  
  /**
   * 테스트 결과 평가
   */
  private static evaluateTestResult(
    testCase: typeof RecipeTestUtils.testCases[0],
    actualRecipeId: string | null,
    contentScore: number
  ): boolean {
    if (testCase.expectedRecipe === null) {
      // 레시피가 없어야 하는 경우
      return actualRecipeId === null && contentScore < 0.5;
    } else {
      // 특정 레시피가 매칭되어야 하는 경우
      return actualRecipeId === testCase.expectedRecipe && contentScore >= testCase.expectedScore;
    }
  }
  
  /**
   * 레시피 제목으로부터 ID 추출
   */
  private static getRecipeId(title: string): string | null {
    const titleMap: Record<string, string> = {
      '지중해식 치킨 케밥': 'mediterranean_chicken_kebab',
      '파스타 아라비아타': 'pasta_arrabbiata',
      '허브 연어 스테이크': 'salmon_steak'
    };
    
    return titleMap[title] || null;
  }
  
  /**
   * 테스트 결과를 콘솔에 출력
   */
  static printTestResults(results: TestResult[]): void {
    console.group('🧪 Recipe Parser Test Results');
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log('');
    
    results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.group(`${status} ${result.testName}`);
      
      console.log(`Input: "${result.input}"`);
      console.log(`Expected Recipe: ${result.expected.recipeId || 'None'}`);
      console.log(`Actual Recipe: ${result.actual.recipeId || 'None'}`);
      console.log(`Content Score: ${result.actual.contentScore.toFixed(2)}`);
      console.log(`Intent: ${result.actual.intent.type}`);
      console.log(`Execution Time: ${result.actual.executionTime}ms`);
      
      if (!result.passed) {
        console.log('🔍 Details:');
        console.log(`  Recipe Match: ${result.details.recipeMatch}`);
        console.log(`  Score Match: ${result.details.scoreMatch}`);
        console.log(`  Intent Detection: ${result.details.intentDetection}`);
      }
      
      if (result.actual.error) {
        console.error(`Error: ${result.actual.error}`);
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  /**
   * 성능 벤치마크 실행
   */
  static runPerformanceBenchmark(iterations: number = 100): BenchmarkResult {
    const startTime = Date.now();
    const testInput = '지중해식 치킨 케밥 만드는 방법 자세히 알려주세요';
    
    const executionTimes: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const iterationStart = Date.now();
      IntelligentRecipeParser.findBestMatchingRecipe(testInput);
      executionTimes.push(Date.now() - iterationStart);
    }
    
    const totalTime = Date.now() - startTime;
    const avgTime = executionTimes.reduce((a, b) => a + b, 0) / iterations;
    const minTime = Math.min(...executionTimes);
    const maxTime = Math.max(...executionTimes);
    
    return {
      iterations,
      totalTime,
      averageTime: avgTime,
      minTime,
      maxTime,
      throughput: iterations / (totalTime / 1000) // ops per second
    };
  }
}

// 타입 정의
interface TestResult {
  testName: string;
  input: string;
  expected: {
    recipeId: string | null;
    minScore: number;
  };
  actual: {
    recipeId: string | null;
    recipe: any;
    contentScore: number;
    intent: any;
    executionTime: number;
    error?: string;
  };
  passed: boolean;
  details: {
    recipeMatch: boolean;
    scoreMatch: boolean;
    intentDetection: boolean;
  };
}

interface BenchmarkResult {
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  throughput: number;
}

// 브라우저 콘솔에서 테스트 실행을 위한 글로벌 함수
declare global {
  interface Window {
    testRecipeParser: () => void;
    benchmarkRecipeParser: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.testRecipeParser = () => {
    const results = RecipeTestUtils.runAllTests();
    RecipeTestUtils.printTestResults(results);
  };
  
  window.benchmarkRecipeParser = () => {
    console.log('🚀 Running performance benchmark...');
    const benchmark = RecipeTestUtils.runPerformanceBenchmark(50);
    console.log('📊 Benchmark Results:');
    console.log(`Average Time: ${benchmark.averageTime.toFixed(2)}ms`);
    console.log(`Min Time: ${benchmark.minTime}ms`);
    console.log(`Max Time: ${benchmark.maxTime}ms`);
    console.log(`Throughput: ${benchmark.throughput.toFixed(1)} ops/sec`);
  };
}