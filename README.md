# 🧠 TaskMind AI - Frontend

TaskMind AI의 프론트엔드는 LangGraph 워크플로우 기반 AI 할 일 관리 시스템입니다. 자연어로 할 일을 입력하면 Qwen 2.5 모델이 0.5초 만에 분석하고 구조화된 할 일로 변환합니다.

## ✨ 주요 기능

### 🤖 **AI 기반 기능**
- **자연어 할 일 입력**: "내일까지 김팀장님께 보고서 제출하기"
- **LangGraph 워크플로우**: 정보추출 → 우선순위분석 → 검증 → 결과
- **실시간 AI 분석**: 0.5초 내 처리 완료
- **지능적 확인**: 신뢰도 기반 사용자 확인 요청

### 📋 **할 일 관리**
- **스마트 우선순위**: AI가 자동으로 urgent/high/medium/low 분류
- **자동 태그 생성**: 내용 기반 태그 자동 추출
- **진행 상황 추적**: 실시간 완료율 및 통계
- **지연 작업 알림**: 마감일 기반 자동 알림

### 🎨 **사용자 경험**
- **Modern UI**: shadcn/ui 기반 깔끔한 디자인
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **다크모드 지원**: 시스템 테마 자동 감지
- **실시간 피드백**: 로딩 상태 및 성공/에러 알림

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **HTTP Client**: Fetch API
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
cd /Users/choeseonghyeon/front_end
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일이 이미 설정되어 있습니다:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 📱 주요 페이지 구조

```
app/
├── page.tsx                  # 랜딩 페이지
├── dashboard/
│   ├── page.tsx             # 메인 대시보드
│   ├── tasks/               # 할 일 관리
│   ├── projects/            # 프로젝트 관리
│   └── ai-chat/             # AI 어시스턴트
```

## 🧩 주요 컴포넌트

### **TaskInput.tsx**
- 자연어 할 일 입력 컴포넌트
- LangGraph 워크플로우 결과 표시
- 신뢰도 기반 확인/수정 인터페이스

### **TaskList.tsx**
- 할 일 목록 표시
- 우선순위/상태별 정렬
- 체크박스로 완료 처리

### **WorkflowResultDisplay**
- AI 분석 결과 시각화
- 신뢰도, 처리시간, 제안사항 표시
- 확인/거부 액션

## 🔄 API 연동

### **주요 엔드포인트**
```typescript
// 자연어 할 일 생성
POST /api/tasks/natural-language
{
  "input": "내일까지 김팀장님께 보고서 제출하기"
}

// LangGraph 워크플로우 테스트
POST /api/ai/test-workflow
{
  "input": "긴급한 회의 준비하기"
}

// 할 일 목록 조회
GET /api/tasks

// AI 질문 답변
POST /api/ai/ask
{
  "question": "오늘 가장 중요한 작업은?",
  "context": "현재 진행 중인 프로젝트"
}
```

## 🎯 사용법

### **1. 자연어로 할 일 추가**
```
입력: "다음 주 화요일까지 김팀장님께 프로젝트 보고서 제출하기"

AI 분석 결과:
- 제목: 김팀장님께 프로젝트 보고서 제출하기
- 마감일: 2024-06-04
- 우선순위: high
- 태그: #보고서, #프로젝트
- 신뢰도: 92%
```

### **2. 워크플로우 과정 시각화**
```
자연어 입력 → [정보추출 0.2초] → [우선순위분석 0.2초] → [검증 0.1초] → 결과
                    ↓                    ↓                   ↓
               신뢰도 계산        조건부 확인 여부    최종 제안사항
```

### **3. 스마트 확인 시스템**
- **높은 신뢰도 (80% 이상)**: 자동 생성
- **중간 신뢰도 (60-80%)**: 확인 후 생성
- **낮은 신뢰도 (60% 미만)**: 수정 제안 + 확인 필요

## 🔧 개발 가이드

### **새 컴포넌트 추가**
```bash
# shadcn/ui 컴포넌트 추가
npx shadcn-ui@latest add [component-name]

# 새 페이지 생성
mkdir app/dashboard/new-page
touch app/dashboard/new-page/page.tsx
```

### **상태 관리**
```typescript
// Zustand 스토어 사용
import { useTaskStore } from '@/stores/tasks'

function MyComponent() {
  const { tasks, fetchTasks, createTask } = useTaskStore()
  
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])
}
```

### **API 호출**
```typescript
// API 클라이언트 사용
import apiClient from '@/lib/api'

const result = await apiClient.createTaskFromNaturalLanguage({
  input: "자연어 입력"
})
```

## 🎨 디자인 시스템

### **컬러 팔레트**
- **Primary**: Blue (AI/기술 느낌)
- **Success**: Green (완료/성공)
- **Warning**: Orange/Yellow (주의/대기)
- **Danger**: Red (긴급/오류)
- **Neutral**: Gray (기본/비활성)

### **우선순위 색상**
- **Urgent**: 🔴 Red (즉시 처리)
- **High**: 🟠 Orange (중요함)
- **Medium**: 🔵 Blue (보통)
- **Low**: ⚫ Gray (나중에)

## 🚀 성능 최적화

### **이미 적용된 최적화**
- **Next.js App Router**: 빠른 네비게이션
- **TypeScript**: 컴파일 타임 에러 방지
- **shadcn/ui**: 트리 쉐이킹으로 번들 크기 최적화
- **Zustand**: 가벼운 상태 관리
- **Lazy Loading**: 컴포넌트 지연 로딩

### **향후 개선 계획**
- **React Query**: 서버 상태 캐싱
- **Virtual Scrolling**: 대량 할 일 목록 처리
- **PWA**: 오프라인 지원
- **WebSocket**: 실시간 동기화

## 🔗 백엔드 연동

현재 백엔드 서버가 `http://localhost:3000`에서 실행 중이어야 합니다:

```bash
# 백엔드 실행 (별도 터미널)
cd /Users/choeseonghyeon/back_end
./start-langgraph.sh

# 프론트엔드 실행 (현재 터미널)
cd /Users/choeseonghyeon/front_end
npm run dev
```

## 🎯 주요 특징

### **AI 워크플로우 시각화**
- 각 단계별 처리 시간 표시
- 신뢰도 기반 색상 코딩
- 실시간 상태 업데이트

### **사용자 경험 최적화**
- 0.5초 내 AI 응답
- 부드러운 애니메이션
- 직관적인 인터페이스
- 명확한 피드백

### **접근성**
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 고대비 모드 지원
- 반응형 디자인

## 🎉 완성된 기능

✅ **랜딩 페이지**: TaskMind AI 소개  
✅ **대시보드**: 할 일 통계 및 현황  
✅ **자연어 입력**: LangGraph 워크플로우 연동  
✅ **할 일 목록**: CRUD + 우선순위 정렬  
✅ **AI 결과 표시**: 신뢰도 기반 확인 시스템  
✅ **반응형 디자인**: 모바일/데스크톱 최적화  

TaskMind AI 프론트엔드로 더 스마트한 할 일 관리를 경험해보세요! 🚀
