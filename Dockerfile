# 🚀 Next.js Frontend Dockerfile
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci && npm cache clean --force

# 소스 코드 복사
COPY . .

# Next.js 빌드 (프로덕션 최적화)
RUN npm run build

# 🏃 Production 스테이지
FROM node:20-alpine AS production

# 보안을 위한 비특권 사용자
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Next.js 실행에 필요한 파일들만 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# public 디렉터리 복사 (정적 자산)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 포트 노출
EXPOSE 3000

# 비특권 사용자로 실행
USER nextjs

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Next.js 시작
CMD ["node", "server.js"]
