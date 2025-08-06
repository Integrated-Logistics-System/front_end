import { RecipeDetail } from '@/utils/recipeParser';

// 완전한 레시피 데이터베이스
export const RECIPE_DATABASE: Record<string, RecipeDetail> = {
  // 지중해식 치킨 케밥
  'mediterranean_chicken_kebab': {
    title: '지중해식 치킨 케밥',
    description: '신선한 허브와 올리브 오일로 마리네이드한 부드럽고 향긋한 치킨 케밥입니다. 건강하고 맛있는 지중해식 요리의 대표작입니다.',
    cookingTime: '45분 (마리네이드 30분 포함)',
    difficulty: '쉬움',
    servings: 4,
    servingsText: '4인분',
    rating: 4.8,
    ingredients: [
      '닭가슴살 600g (한입 크기로 잘라서)',
      '적양파 1개 (굵게 썰기)',
      '피망 2개 (굵게 썰기)',
      '방울토마토 12개',
      '올리브 오일 3큰술',
      '레몬즙 2큰술',
      '마늘 4쪽 (다진 것)',
      '말린 오레가노 1큰술',
      '말린 타임 1작은술',
      '소금 1작은술',
      '후추 1/2작은술',
      '파프리카 가루 1작은술'
    ],
    steps: [
      {
        step: 1,
        instruction: '볼에 올리브 오일, 레몬즙, 다진 마늘, 오레가노, 타임, 소금, 후추, 파프리카 가루를 넣고 마리네이드 소스를 만듭니다.',
        time: '5분',
        tip: '허브는 손으로 비벼서 향을 더 많이 낼 수 있어요!'
      },
      {
        step: 2,
        instruction: '자른 닭가슴살을 마리네이드 소스에 넣고 골고루 버무린 후, 냉장고에서 30분간 재워둡니다.',
        time: '30분',
        tip: '더 오래 재울수록 맛이 더 깊어집니다. 최대 2시간까지 가능해요.'
      },
      {
        step: 3,
        instruction: '꼬치에 닭고기, 양파, 피망, 토마토를 번갈아가며 꽂습니다. 너무 꽉 채우지 말고 적당히 간격을 두세요.',
        time: '10분',
        tip: '재료 사이에 공간이 있어야 고르게 익고, 뒤집기도 쉬워져요!'
      },
      {
        step: 4,
        instruction: '그릴팬이나 오븐(200°C)에서 15-20분간 구워줍니다. 중간에 한 번 뒤집어 주세요.',
        time: '15-20분',
        tip: '닭고기 중심 온도가 74°C에 도달하면 완성입니다!'
      },
      {
        step: 5,
        instruction: '완성된 케밥을 접시에 담고 레몬 조각과 그리스 요거트 소스와 함께 서빙합니다.',
        time: '2분',
        tip: '차치키 소스나 후무스와 함께 드시면 정통 지중해 맛을 즐길 수 있어요!'
      }
    ],
    tips: [
      '닭고기는 가슴살 대신 허벅지살을 사용하면 더 부드럽고 촉촉합니다.',
      '나무 꼬치를 사용할 때는 미리 물에 30분간 담가두면 타지 않아요.',
      '채소는 같은 크기로 썰어야 고르게 익습니다.',
      '그릴이 없다면 팬에 기름을 두르고 중불에서 구워도 맛있어요.'
    ],
    nutritionInfo: {
      calories: '320kcal',
      protein: '35g',
      carbs: '12g',
      fat: '15g'
    },
    tags: ['지중해식', '치킨', '케밥', '건강식', '그릴요리', '단백질']
  },

  // 파스타 아라비아타
  'pasta_arrabbiata': {
    title: '파스타 아라비아타',
    description: '매콤하고 진한 토마토 소스가 일품인 이탈리아 클래식 파스타입니다. 간단하지만 풍미가 깊어 누구나 좋아하는 요리입니다.',
    cookingTime: '25분',
    difficulty: '쉬움',
    servings: 2,
    servingsText: '2인분',
    rating: 4.6,
    ingredients: [
      '스파게티 200g',
      '올리브 오일 3큰술',
      '마늘 3쪽 (편썰기)',
      '홍고추 2개 (씨 제거 후 썰기)',
      '토마토 통조림 400g (으깬 것)',
      '소금 1작은술',
      '후추 1/4작은술',
      '파슬리 2큰술 (다진 것)',
      '파르메산 치즈 4큰술 (갈은 것)'
    ],
    steps: [
      {
        step: 1,
        instruction: '큰 냄비에 물을 끓여 소금을 넣고 스파게티를 포장지 시간보다 1분 적게 삶습니다.',
        time: '8-10분',
        tip: '파스타 물은 바다물처럼 짜야 해요! 물 1L당 소금 10g이 적당합니다.'
      },
      {
        step: 2,
        instruction: '팬에 올리브 오일을 두르고 편썬 마늘과 홍고추를 넣어 약불에서 2분간 볶아 향을 냅니다.',
        time: '2분',
        tip: '마늘이 갈색으로 변하기 시작하면 불을 줄여주세요. 타면 쓴맛이 나요!'
      },
      {
        step: 3,
        instruction: '으깬 토마토를 넣고 중불에서 10분간 끓여 소스를 걸쭉하게 만듭니다. 소금, 후추로 간을 맞춰주세요.',
        time: '10분',
        tip: '토마토 소스가 팬 바닥에서 끓는 소리가 나면 완벽한 농도예요!'
      },
      {
        step: 4,
        instruction: '삶은 스파게티와 파스타 삶은 물 1/2컵을 소스에 넣고 1분간 볶아 섞어줍니다.',
        time: '1분',
        tip: '파스타 물의 전분이 소스와 면을 완벽하게 연결해줍니다!'
      },
      {
        step: 5,
        instruction: '불을 끄고 다진 파슬리와 파르메산 치즈를 넣어 완성합니다.',
        time: '1분',
        tip: '치즈는 열기로 살짝 녹여주면 더 부드러워져요!'
      }
    ],
    tips: [
      '홍고추의 양을 조절해서 매운 정도를 맞춰보세요.',
      '신선한 바질을 추가하면 향이 더욱 좋아집니다.',
      '파스타 삶은 물을 꼭 남겨두세요. 소스 농도 조절에 필수입니다.',
      '파르메산 치즈 대신 페코리노 로마노를 사용해도 맛있어요.'
    ],
    nutritionInfo: {
      calories: '450kcal',
      protein: '15g',
      carbs: '70g',
      fat: '14g'
    },
    tags: ['이탈리아', '파스타', '토마토', '매콤한', '간단요리']
  },

  // 연어 스테이크
  'salmon_steak': {
    title: '허브 연어 스테이크',
    description: '부드럽고 촉촉한 연어에 신선한 허브 향이 어우러진 고급 요리입니다. 특별한 날이나 손님 접대용으로 완벽합니다.',
    cookingTime: '20분',
    difficulty: '보통',
    servings: 2,
    servingsText: '2인분',
    rating: 4.9,
    ingredients: [
      '연어 필레 2조각 (각 150g)',
      '올리브 오일 2큰술',
      '버터 2큰술',
      '레몬 1개 (즙과 껍질)',
      '마늘 2쪽 (다진 것)',
      '신선한 딜 2큰술',
      '신선한 파슬리 2큰술',
      '소금 1/2작은술',
      '후추 1/4작은술'
    ],
    steps: [
      {
        step: 1,
        instruction: '연어는 상온에 30분 정도 두어 온도를 맞춰주고, 키친타월로 물기를 완전히 제거합니다.',
        time: '30분',
        tip: '차가운 생선을 바로 구우면 겉만 타고 속은 덜 익어요!'
      },
      {
        step: 2,
        instruction: '연어 양면에 소금과 후추를 뿌려 간을 합니다.',
        time: '2분',
        tip: '간은 조리 직전에 하는 것이 좋아요. 미리 하면 수분이 빠집니다.'
      },
      {
        step: 3,
        instruction: '팬에 올리브 오일을 두르고 강불에서 연어를 껍질 면부터 3-4분간 굽습니다.',
        time: '3-4분',
        tip: '연어를 올린 후 절대 움직이지 마세요! 바삭한 껍질이 만들어집니다.'
      },
      {
        step: 4,
        instruction: '뒤집어서 2-3분 더 굽고, 버터와 다진 마늘을 넣어 30초간 더 구워줍니다.',
        time: '2-3분',
        tip: '연어는 중심이 살짝 분홍색일 때가 가장 맛있어요!'
      },
      {
        step: 5,
        instruction: '불을 끄고 레몬즙, 딜, 파슬리를 넣어 완성합니다.',
        time: '1분',
        tip: '허브는 마지막에 넣어야 신선한 향을 유지할 수 있어요!'
      }
    ],
    tips: [
      '연어의 신선도가 가장 중요합니다. 냄새가 비리지 않은 것을 선택하세요.',
      '팬은 충분히 달궈서 사용해야 껍질이 바삭해집니다.',
      '레몬 제스트를 추가하면 향이 더욱 풍부해집니다.',
      '아스파라거스나 브로콜리와 함께 서빙하면 완벽한 한 끼입니다.'
    ],
    nutritionInfo: {
      calories: '280kcal',
      protein: '25g',
      carbs: '2g',
      fat: '18g'
    },
    tags: ['연어', '스테이크', '허브', '고급요리', '오메가3', '단백질']
  }
};

// 레시피 키워드 매칭 맵
export const RECIPE_KEYWORD_MAP: Record<string, string[]> = {
  'mediterranean_chicken_kebab': [
    '지중해', '지중해식', '치킨', '닭', '케밥', '꼬치', '그릴', '올리브오일', '마리네이드', '바베큐'
  ],
  'pasta_arrabbiata': [
    '파스타', '스파게티', '아라비아타', '토마토', '매운', '이탈리아', '면', '마늘', '홍고추'
  ],
  'salmon_steak': [
    '연어', '생선', '스테이크', '허브', '딜', '파슬리', '레몬', '구이', '필레'
  ]
};

// 요리 타입별 분류
export const RECIPE_CATEGORIES = {
  MAIN_DISH: ['mediterranean_chicken_kebab', 'pasta_arrabbiata', 'salmon_steak'],
  QUICK_MEAL: ['pasta_arrabbiata'],
  HEALTHY: ['mediterranean_chicken_kebab', 'salmon_steak'],
  GRILLED: ['mediterranean_chicken_kebab', 'salmon_steak'],
  PASTA: ['pasta_arrabbiata'],
  SEAFOOD: ['salmon_steak'],
  CHICKEN: ['mediterranean_chicken_kebab']
};