#!/bin/bash

echo "🚀 TaskMind Frontend 설정을 시작합니다..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 패키지를 설치합니다..."
    npm install
else
    echo "✅ 의존성 패키지가 이미 설치되어 있습니다."
fi

# Install additional dependencies that might be missing
echo "🔧 추가 의존성을 확인하고 설치합니다..."
npm install tailwindcss-animate

echo "🏗️  Next.js 빌드를 확인합니다..."
npm run build 2>/dev/null || {
    echo "⚠️  빌드 오류가 있습니다. 타입 검사를 수행합니다..."
    npm run type-check 2>/dev/null || echo "타입 오류를 확인하세요."
}

echo "🎯 프론트엔드 서버를 시작합니다..."
echo "브라우저에서 http://localhost:3000 에 접속하세요."
echo "백엔드 서버가 http://localhost:3001 에서 실행 중인지 확인하세요."

npm run dev
