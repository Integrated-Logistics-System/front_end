# Deleted Files List

## App Pages (Deleted)
- ✅ profile/page.tsx - 삭제됨
- ✅ recipe/[id]/page.tsx - 삭제됨  
- ✅ search/page.tsx - 삭제됨

## Components (Deleted)
- ✅ home/ 폴더 전체 - 삭제됨 (HeroSection, FeaturesSection, CTASection, StatsSection)
- ✅ search/ 폴더 전체 - 삭제됨 (EnhancedRecipeCard, EnhancedSearchComponent, EnhancedSearchForm, SearchInsights)
- ✅ profile/ 폴더 전체 - 삭제됨 (CookingProfile)
- ✅ chat/RecipeCard.tsx - 삭제됨

## Layout Components (Kept)
- ✅ layout/Header.tsx - 유지 (알레르기 설정 포함)
- ✅ layout/Footer.tsx - 유지

## Core Components (Kept)
- ✅ AuthInitializer.tsx - 유지 (인증 초기화)
- ✅ OnboardingManager.tsx - 유지 (온보딩)
- ✅ providers.tsx - 유지 (Provider 래퍼)
- ✅ onboarding/AllergySetup.tsx - 유지 (알레르기 설정)
- ✅ ui/ 폴더 - 유지 (Button, LoadingSpinner, ThemeToggle, etc.)

## Remaining Structure
```
src/
├── app/
│   ├── chat/page.tsx    # 채팅 페이지 (메인)
│   ├── layout.tsx       # 루트 레이아웃
│   ├── page.tsx         # 홈/로그인 페이지
│   └── globals.css      # 글로벌 스타일
├── components/
│   ├── AuthInitializer.tsx
│   ├── OnboardingManager.tsx
│   ├── providers.tsx
│   ├── layout/          # Header, Footer
│   ├── onboarding/      # AllergySetup
│   └── ui/              # 기본 UI 컴포넌트들
├── hooks/               # 커스텀 훅들
├── services/           # API 서비스들
├── store/              # Recoil 상태
├── viewmodels/         # 뷰모델들
└── lib/                # 유틸리티
```
