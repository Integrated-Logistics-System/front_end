# 🍳 Recipe AI - Frontend

Next.js 기반 AI 레시피 채팅 인터페이스

> **📂 레포지토리 구조**: 이 프로젝트는 프론트엔드와 백엔드가 분리된 마이크로서비스 구조입니다.
> - **🌐 프론트엔드**: 이 레포지토리 (Next.js + Nginx)  
> - **⚙️ 백엔드**: [recipe-ai-backend](https://github.com/choeseonghyeon/recipe-ai-backend) (NestJS)

## 📋 프로젝트 개요

**기술 스택**: Next.js 14 + TypeScript + TailwindCSS + Socket.IO + React Query + Docker + Nginx  
**핵심 기능**: 실시간 AI 채팅, 스트리밍 응답, 사용자 인증, 반응형 UI, 프록시 라우팅

## 🏗 아키텍처

```
Next.js Frontend ←→ Nginx Proxy ←→ NestJS Backend
        ↓                ↓              ↓
   React Components   Load Balancing   WebSocket API
        ↓                ↓              ↓  
   Socket.IO Client   Static Caching   AI Processing
        ↓                ↓              ↓
   Real-time Chat    Performance      LangChain
```

## 🚀 주요 기능

### 1. **실시간 AI 채팅 인터페이스**
- Socket.IO 기반 실시간 통신
- 스트리밍 응답으로 타이핑 효과
- 메시지 기록 관리 및 표시

### 2. **사용자 인증 시스템**
- JWT 기반 로그인/회원가입
- 알레르기 정보 관리
- 요리 실력 설정

### 3. **반응형 UI/UX**
- TailwindCSS 기반 모던 디자인
- 다크/라이트 모드 지원
- 모바일 최적화

### 4. **성능 최적화**
- React Query로 상태 관리
- Next.js 14 App Router
- 컴포넌트 코드 스플리팅

## 🔧 주요 컴포넌트

### **ChatInterface** - 채팅 인터페이스
```typescript
- 실시간 메시지 송수신
- 스트리밍 응답 렌더링
- 메시지 기록 표시
- 타이핑 상태 표시
```

### **AuthSystem** - 인증 시스템
```typescript
- 로그인/회원가입 폼
- JWT 토큰 관리
- 보호된 라우트
- 사용자 프로필 관리
```

### **RecipeDisplay** - 레시피 표시
```typescript
- AI 응답 마크다운 렌더링
- 레시피 카드 UI
- 알레르기 정보 표시
- 즐겨찾기 기능
```

## 🛠 기술적 특징

### **1. WebSocket 실시간 통신**
```typescript
const socket = io(WEBSOCKET_URL, {
  auth: { token: getAuthToken() }
});

socket.on('chat-stream', (data) => {
  // 실시간 스트리밍 응답 처리
});
```

### **2. React Query 상태 관리**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['chatHistory', userId],
  queryFn: () => fetchChatHistory(userId)
});
```

### **3. Next.js 최적화**
```typescript
// App Router + Server Components
// 동적 imports로 번들 크기 최적화
// ISR (Incremental Static Regeneration)
```

## 🎨 UI/UX 특징

### **모던 인터페이스**
- 클린한 채팅 UI
- 부드러운 애니메이션
- 직관적인 네비게이션

### **접근성**
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 고대비 모드 지원

### **반응형 디자인**
- 모바일 우선 설계
- 태블릿 최적화
- 데스크톱 확장 레이아웃

## 🐳 Docker + Nginx 배포

### **개발 환경**
```bash
npm run dev
```

### **프로덕션 배포**
```bash
docker-compose up -d
```

### **Nginx 통합**
```nginx
# 리버스 프록시 설정
# 정적 파일 캐싱
# 로드 밸런싱
# Rate limiting
```

## 📱 화면 구성

### **메인 채팅 화면**
- 실시간 채팅 인터페이스
- AI 응답 스트리밍
- 메시지 기록 표시

### **사용자 설정**
- 프로필 정보 수정
- 알레르기 정보 관리
- 요리 실력 설정

### **레시피 상세**
- AI 추천 레시피 표시
- 재료 및 조리법
- 알레르기 경고 표시

## 🔗 백엔드 연동

- **REST API**: 사용자 인증, 프로필 관리
- **WebSocket**: 실시간 채팅, 스트리밍 응답
- **GraphQL**: 복잡한 데이터 조회 (향후 예정)

## 🎯 핵심 차별점

1. **실시간 스트리밍**: 타이핑 효과로 자연스러운 AI 대화
2. **완전한 반응형**: 모든 디바이스에서 최적화된 경험
3. **성능 우선**: Next.js 14 + React Query 최적화
4. **사용자 중심**: 직관적이고 접근성 높은 UI

## 🚀 향후 계획

- PWA 지원
- 오프라인 모드
- 음성 인터페이스
- 다국어 지원

---

**📧 Contact**: 바카티오 Frontend Engineer 지원용 포트폴리오  
**🌐 Demo**: [Live Demo Link]
**🚀 Status**: 프로덕션 배포 준비 완료
