# AI Recipe Assistant Frontend 🍽️

개인 알레르기 프로필 기반 안전한 레시피 추천 AI 시스템의 프론트엔드입니다.

## 🚀 주요 기능

- **🔍 스마트 레시피 검색**: 23만개+ 레시피 데이터베이스에서 실시간 검색
- **🛡️ 알레르기 안전 보장**: 개인 알레르기 프로필 기반 자동 필터링
- **🤖 AI 채팅**: 자연어로 요리 상담 및 레시피 추천
- **👤 개인화 프로필**: 알레르기, 선호도, 식단 관리
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

## 🛠️ 기술 스택

### Core
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링

### State Management
- **Recoil** - 상태 관리
- **TanStack Query** - 서버 상태 관리 및 캐싱

### UI/UX
- **Framer Motion** - 애니메이션
- **Headless UI** - 접근성 중심 UI 컴포넌트
- **Heroicons** - 아이콘
- **Next Themes** - 다크/라이트 모드

### API & Authentication
- **Axios** - HTTP 클라이언트
- **JWT** - 인증 (쿠키 기반)
- **React Hot Toast** - 알림

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── chat/              # AI 채팅 페이지
│   ├── profile/           # 사용자 프로필
│   ├── search/            # 레시피 검색
│   └── layout.tsx         # 루트 레이아웃
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── home/             # 홈페이지 섹션
│   └── recipe/           # 레시피 관련 컴포넌트
├── hooks/                # 커스텀 React 훅
├── lib/                  # 유틸리티 및 설정
├── store/                # Recoil 상태 관리
└── types/                # TypeScript 타입 정의
```

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_WS_URL=http://localhost:8081
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행 (Turbo 모드)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 검사
- `npm run type-check` - TypeScript 타입 검사
- `npm run format` - Prettier 코드 포맷팅

## 🔧 주요 컴포넌트

### 인증 시스템
- 회원가입/로그인 (JWT 기반)
- 프로필 관리
- 알레르기 설정

### 레시피 검색
- 실시간 검색
- 알레르기 필터링
- 고급 필터 (시간, 태그 등)

### AI 채팅
- 자연어 대화
- 레시피 추천
- 대화 기록 관리

### 사용자 프로필
- 알레르기 프로필 설정
- 요리 선호도 관리
- 즐겨찾기 관리

## 🌐 API 연동

백엔드 API와의 연동을 위해 다음 서비스들을 사용합니다:

```typescript
// API 클라이언트 설정
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// 주요 API 엔드포인트
- /auth/* - 사용자 인증
- /recipe/* - 레시피 검색
- /langchain/* - AI 채팅
- /allergen/* - 알레르기 체크
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Orange (f97316)
- **Secondary**: Amber (f59e0b)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red

### 애니메이션
- 페이지 전환: Fade in/out
- 카드 호버: Scale & Shadow
- 로딩: Spinner & Skeleton

## 🔐 보안

- **JWT 토큰**: 쿠키 기반 저장 (7일 만료)
- **API 인터셉터**: 자동 토큰 갱신
- **CORS**: 백엔드와 안전한 통신
- **XSS 방지**: Content Security Policy

## 📱 반응형 디자인

- **Mobile First**: 모바일 우선 설계
- **Breakpoints**: 
  - `xs`: 475px
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🧪 테스팅

```bash
# 타입 체크
npm run type-check

# 린팅
npm run lint

# 포맷팅 체크
npm run format:check
```

## 🚀 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 수동 빌드
```bash
npm run build
npm run start
```

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

## 👥 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.

---

**🔗 관련 링크**
- [백엔드 저장소](../backend)
- [API 문서](../docs/api.md)
- [배포 가이드](../docs/deployment.md)

**✨ 개발자: 최성현**
