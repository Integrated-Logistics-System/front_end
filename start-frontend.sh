#!/bin/bash

# TaskMind AI Frontend 실행 스크립트

echo "🚀 TaskMind AI Frontend 시작..."

# 1. Node.js 버전 확인
echo "📝 Node.js 버전 확인..."
node --version
npm --version

# 2. 의존성 설치 (필요시)
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# 3. 백엔드 서버 상태 확인
echo "🔗 백엔드 서버 확인 중..."
if curl -s http://localhost:3000/api >/dev/null 2>&1; then
    echo "✅ 백엔드 서버가 실행 중입니다."
else
    echo "⚠️  백엔드 서버가 실행되지 않았습니다."
    echo "   별도 터미널에서 다음 명령어를 실행하세요:"
    echo "   cd /Users/choeseonghyeon/back_end && ./start-langgraph.sh"
fi

# 4. 프론트엔드 개발 서버 실행
echo "🌐 TaskMind AI Frontend 실행 중..."
echo "📍 http://localhost:3001"
echo "🎯 대시보드: http://localhost:3001/dashboard"

npm run dev
