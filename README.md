# TaskMind Frontend

TaskMind의 프론트엔드 애플리케이션입니다. Next.js 14, TypeScript, Tailwind CSS를 기반으로 구축되었으며, AI 기반 작업 관리 기능을 제공합니다.

## 🚀 주요 기능

### 📋 작업 관리
- **AI 기반 자연어 작업 생성**: "내일까지 보고서 작성하기"와 같은 자연어로 작업 생성
- **스마트 우선순위 제안**: AI가 작업의 중요도를 자동으로 분석하여 우선순위 제안
- **실시간 작업 상태 관리**: 할 일, 진행 중, 완료, 취소 상태 관리
- **마감일 및 알림 설정**: 작업 마감일 설정 및 리마인더 기능
- **태그 기반 분류**: 작업을 태그로 분류하고 필터링

### 📁 프로젝트 관리
- **프로젝트별 작업 그룹화**: 관련 작업들을 프로젝트로 묶어 관리
- **진행률 시각화**: 프로젝트별 완료율과 진행 상황을 시각적으로 표시
- **프로젝트 색상 커스터마이징**: 각 프로젝트별 고유 색상 설정

### 🤖 AI 어시스턴트
- **LangGraph 기반 고급 워크플로우**: 조건부 분기와 스마트 에러 처리
- **대화형 AI 인터페이스**: 자연스러운 대화를 통한 작업 관리 지원
- **작업 패턴 분석**: 사용자의 작업 패턴을 분석하여 개선 제안
- **프로젝트 인사이트 생성**: AI가 프로젝트 현황을 분석하여 인사이트 제공

### 📊 대시보드
- **실시간 통계**: 전체 작업, 완료율, 지연된 작업 등 주요 지표
- **오늘 할 일**: 당일 마감 작업 목록
- **지연된 작업**: 마감일이 지난 작업들을 한눈에 확인
- **다가오는 작업**: 향후 일주일 내 마감 예정 작업들

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Radix UI + Custom Components
- **Form Handling**: React Hook Form + Zod
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (React Query)

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input, Card 등)
│   └── layout/         # 레이아웃 컴포넌트 (Sidebar, Header 등)
├── lib/                # 유틸리티 및 설정
│   ├── api.ts          # API 클라이언트
│   └── utils.ts        # 헬퍼 함수들
├── stores/             # Zustand 상태 관리
│   ├── auth.ts         # 인증 상태
│   ├── tasks.ts        # 작업 상태
│   └── projects.ts     # 프로젝트 상태
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 전역 타입들
├── hooks/              # 커스텀 React 훅
└── utils/              # 헬퍼 유틸리티 함수

app/                    # Next.js App Router
├── (auth)/            # 인증 관련 페이지
│   ├── login/         # 로그인 페이지
│   └── register/      # 회원가입 페이지
├── (dashboard)/       # 대시보드 레이아웃
│   ├── dashboard/     # 메인 대시보드
│   ├── tasks/         # 작업 관리 페이지
│   ├── projects/      # 프로젝트 관리 페이지
│   └── ai/           # AI 어시스턴트 페이지
├── globals.css        # 전역 스타일
├── layout.tsx         # 루트 레이아웃
├── page.tsx          # 홈 페이지
└── providers.tsx     # 전역 프로바이더
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 개발 서버 실행
```bash
# 개발 서버 시작
npm run dev

# 또는 편의 스크립트 사용
./start-frontend.sh
```

### 4. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# 타입 검사
npm run type-check

# 린트 검사
npm run lint
```

## 🔧 개발 가이드

### 새로운 페이지 추가
1. `app/` 디렉토리에 폴더 생성
2. `page.tsx` 파일로 페이지 컴포넌트 작성
3. 필요시 `layout.tsx`로 레이아웃 정의

### 새로운 컴포넌트 추가
1. `src/components/` 에 컴포넌트 파일 생성
2. TypeScript 인터페이스 정의
3. `src/components/ui/` 에는 재사용 가능한 기본 컴포넌트 배치

### 상태 관리
- **Zustand** 스토어를 `src/stores/` 에 정의
- API 호출과 로컬 상태를 함께 관리
- 타입 안전성을 위해 TypeScript 인터페이스 활용

### API 연동
- `src/lib/api.ts`의 `ApiClient` 클래스 사용
- 모든 API 엔드포인트가 타입 안전하게 정의됨
- 자동 토큰 관리 및 에러 처리 포함

## 🎨 스타일링 가이드

### Tailwind CSS 클래스 사용
```tsx
// 좋은 예
<div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
  <h1 className="text-2xl font-bold text-gray-900">제목</h1>
</div>

// cn() 유틸리티로 조건부 클래스
<Button className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)}>
```

### 컴포넌트 디자인 원칙
- **일관성**: 전체 앱에서 동일한 디자인 패턴 사용
- **접근성**: ARIA 속성과 키보드 네비게이션 지원
- **반응형**: 모바일부터 데스크톱까지 모든 화면 크기 지원
- **로딩 상태**: 모든 비동기 작업에 적절한 로딩 인디케이터 제공

## 🔐 인증 시스템

### JWT 토큰 기반 인증
- 로그인 시 액세스 토큰을 localStorage에 저장
- API 요청 시 자동으로 Bearer 토큰 헤더 추가
- 토큰 만료 시 자동 로그아웃 및 로그인 페이지 리다이렉트

### 보호된 라우트
- `(dashboard)` 그룹의 모든 페이지는 인증 필요
- 미인증 사용자는 자동으로 로그인 페이지로 리다이렉트
- 인증 상태는 Zustand 스토어에서 전역 관리

## 🤖 AI 기능 활용

### 자연어 작업 생성
```typescript
// 자연어로 작업 생성
await createTaskFromNaturalLanguage("내일까지 보고서 작성하고 팀에게 공유하기")

// AI가 자동으로 파싱하여 구조화된 작업 생성:
// - 제목: "보고서 작성하고 팀에게 공유"
// - 마감일: 내일
// - 우선순위: AI가 판단
// - 태그: ["보고서", "공유"]
```

### AI 대화 인터페이스
```typescript
// 대화형 AI와 상호작용
await conversation({
  message: "오늘 할 일을 정리해줘",
  conversationHistory: [...],
  context: { userId, currentTasks }
})
```

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: `< 768px` - 스택형 레이아웃, 단일 컬럼
- **태블릿**: `768px - 1024px` - 2컬럼 그리드, 축소된 사이드바
- **데스크톱**: `> 1024px` - 전체 레이아웃, 사이드바 고정

### 모바일 최적화
- 터치 친화적인 버튼 크기 (최소 44px)
- 스와이프 제스처 지원
- 모바일 네비게이션 메뉴
- 적응형 폰트 크기

## 🚨 에러 처리

### 전역 에러 처리
- API 에러는 자동으로 toast 알림으로 표시
- 네트워크 에러 시 재시도 옵션 제공
- 401 에러 시 자동 로그아웃 처리

### 사용자 친화적 오류 메시지
```tsx
// 에러 상태 표시 예시
{error && (
  <div className="text-center py-12">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <p className="text-red-600">{error}</p>
    <Button onClick={retry} className="mt-4">
      다시 시도
    </Button>
  </div>
)}
```

## 🔄 상태 관리 패턴

### Zustand 스토어 구조
```typescript
interface TaskState {
  // 데이터
  tasks: Task[]
  selectedTask: Task | null
  
  // UI 상태
  isLoading: boolean
  error: string | null
  
  // 액션
  fetchTasks: () => Promise<void>
  createTask: (data: CreateTaskRequest) => Promise<Task>
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>
}
```

### 낙관적 업데이트
- 사용자 경험 향상을 위해 즉시 UI 업데이트
- 서버 응답 실패 시 자동 롤백
- 로딩 상태 최소화

## 📊 성능 최적화

### Next.js 최적화 기능
- **App Router**: 최신 Next.js 라우팅 시스템
- **이미지 최적화**: next/image 컴포넌트 사용
- **폰트 최적화**: next/font로 웹폰트 최적화
- **번들 분석**: 코드 스플리팅 자동 적용

### 컴포넌트 최적화
- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 비싼 계산 캐싱
- **Lazy Loading**: 대용량 컴포넌트 지연 로딩

## 🧪 테스트 가이드

### 테스트 전략
- **단위 테스트**: 유틸리티 함수 및 훅
- **컴포넌트 테스트**: React Testing Library 사용
- **E2E 테스트**: 주요 사용자 플로우
- **타입 검사**: TypeScript로 컴파일 타임 오류 방지

### 테스트 명령어
```bash
# 단위 테스트 실행
npm run test

# 테스트 커버리지 확인
npm run test:coverage

# E2E 테스트 실행
npm run test:e2e
```

## 🚀 배포 가이드

### Vercel 배포 (권장)
1. GitHub 리포지토리 연결
2. 환경 변수 설정
3. 자동 배포 설정

### 환경별 설정
```bash
# 개발 환경
NEXT_PUBLIC_API_URL=http://localhost:3001

# 스테이징 환경
NEXT_PUBLIC_API_URL=https://api-staging.taskmind.com

# 프로덕션 환경
NEXT_PUBLIC_API_URL=https://api.taskmind.com
```

## 🤝 기여 가이드

### 개발 플로우
1. 새 기능 브랜치 생성: `git checkout -b feature/새기능`
2. 코드 작성 및 테스트
3. 커밋 메시지 규칙 준수: `feat: 새로운 기능 추가`
4. Pull Request 생성
5. 코드 리뷰 후 병합

### 코드 스타일
- **Prettier**: 자동 코드 포맷팅
- **ESLint**: 코드 품질 검사
- **TypeScript**: 타입 안전성 보장
- **Husky**: Git 훅으로 품질 관리

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues 사용
- **기능 요청**: Discussion 탭 활용
- **보안 문제**: 비공개 이메일로 연락

---

**TaskMind Frontend**는 현대적인 웹 기술과 AI를 결합하여 사용자에게 최고의 작업 관리 경험을 제공합니다. 🚀
