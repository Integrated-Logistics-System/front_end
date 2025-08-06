# 🛠️ 개발 환경 설정 가이드

## 환경 설정 파일

### 🔧 개발 환경
```bash
# .env.dev 파일을 .env.local로 복사
cp .env.dev .env.local

# 또는 직접 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:8081/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:8083" >> .env.local
```

### 🚀 프로덕션 환경 (Docker)
```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local
```

## 개발 서버 실행

### 로컬 개발 (백엔드 직접 연결)
```bash
# 1. 환경 파일 설정
cp .env.dev .env.local

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev

# 접속: http://localhost:3000
```

### Docker 환경 테스트
```bash
# 1. 환경 파일 설정  
cp .env.example .env.local

# 2. Docker 빌드 및 실행
docker-compose -f docker-compose.local.yml up -d

# 접속: http://localhost:81
```

## 환경별 백엔드 연결

| 환경 | API URL | WebSocket URL | 포트 |
|------|---------|---------------|------|
| 로컬 개발 | `http://localhost:8081/api` | `http://localhost:8083` | 3000 |
| Docker 로컬 | `/api` (nginx 프록시) | `/ws` (nginx 프록시) | 81 |

## 디버깅

### WebSocket 연결 확인
```javascript
// 브라우저 개발자 도구 → Console
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('WS URL:', process.env.NEXT_PUBLIC_WS_URL);
```

### 네트워크 확인
- 개발자 도구 → Network 탭
- WS 필터로 WebSocket 연결 확인
- Failed 상태면 백엔드 서버 실행 상태 확인

## 자주 발생하는 문제

### 1. WebSocket 연결 실패
```bash
# 백엔드 서버 실행 확인
curl http://localhost:8081/api/health
curl http://localhost:8083

# 환경 변수 확인
cat .env.local
```

### 2. API 호출 실패  
```bash
# CORS 에러인경우 백엔드 CORS 설정 확인
# 네트워크 에러인 경우 백엔드 서버 상태 확인
```

### 3. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000  # 프론트엔드
lsof -i :8081  # 백엔드 API  
lsof -i :8083  # 백엔드 WebSocket
```

## 유용한 명령어

```bash
# 타입 체크
npm run type-check

# 린팅
npm run lint

# 빌드 (프로덕션용)
npm run build

# 캐시 정리
npm run clean

# 번들 분석
npm run analyze
```