# 🍳 Smart Recipe Chatbot Frontend

AI 기반 스마트 레시피 추천 챗봇의 Next.js 프론트엔드 애플리케이션

## 🛠 기술 스택

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Real-time**: WebSocket

## 🎯 주요 기능

- 재료 입력 인터페이스
- 실시간 채팅 UI
- 레시피 검색 및 표시
- 반응형 디자인
- 다크/라이트 모드

## 🚀 시작하기

### 설치 및 실행
```bash
npm install
npm run dev
```

### 환경 변수 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 📱 주요 페이지

- `/` - 메인 홈페이지
- `/chat` - 채팅 인터페이스
- `/recipes` - 레시피 목록
- `/ingredients` - 재료 입력

## 🧪 테스트

```bash
npm run test
npm run test:watch
```

## 📦 빌드 및 배포

```bash
npm run build
npm start
```

## 🎨 UI 컴포넌트

- 채팅 인터페이스
- 레시피 카드
- 재료 선택기
- 검색 바
- 반응형 네비게이션
