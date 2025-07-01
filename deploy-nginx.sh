#!/bin/bash

# 🚀 Recipe AI - Nginx 통합 배포 스크립트
# 사용법: ./deploy-nginx.sh [backend|frontend|all|status|logs|test|restart|stop|clean]

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 설정
BACKEND_DIR="ts_backend"
FRONTEND_DIR="frontend"
NAS_IP="192.168.0.111"

# 함수: 백엔드 배포
deploy_backend() {
    log_info "🚀 백엔드 배포 시작..."
    
    cd $BACKEND_DIR
    
    # Docker 이미지 빌드
    log_info "🏗️  Docker 이미지 빌드 중..."
    docker-compose build
    
    # 기존 컨테이너 정리
    log_info "🧹 기존 컨테이너 정리..."
    docker-compose down 2>/dev/null || true
    
    # 새 컨테이너 시작
    log_info "🚀 백엔드 컨테이너 시작..."
    docker-compose up -d
    
    # 헬스체크
    log_info "⏳ 백엔드 헬스체크 대기..."
    for i in {1..30}; do
        if curl -f http://localhost:8081/api/auth/health &>/dev/null; then
            log_success "✅ 백엔드 정상 시작됨!"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "❌ 백엔드 시작 실패 (타임아웃)"
            exit 1
        fi
        sleep 2
    done
    
    cd ..
}

# 함수: 프론트엔드 + Nginx 배포  
deploy_frontend() {
    log_info "🚀 프론트엔드 + Nginx 배포 시작..."
    
    cd $FRONTEND_DIR
    
    # Nginx 설정 검증
    log_info "🔧 Nginx 설정 검증..."
    if [ ! -f "./nginx/nginx.conf" ]; then
        log_error "❌ Nginx 설정 파일이 없습니다!"
        exit 1
    fi
    
    # Docker 이미지 빌드
    log_info "🏗️  Docker 이미지 빌드 중..."
    docker-compose build
    
    # 기존 컨테이너 정리
    log_info "🧹 기존 컨테이너 정리..."
    docker-compose down 2>/dev/null || true
    
    # 새 컨테이너 시작
    log_info "🚀 프론트엔드 + Nginx 컨테이너 시작..."
    docker-compose up -d
    
    # Nginx 헬스체크
    log_info "⏳ Nginx 헬스체크 대기..."
    for i in {1..30}; do
        if curl -f http://localhost/nginx-health &>/dev/null; then
            log_success "✅ Nginx 정상 시작됨!"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "❌ Nginx 시작 실패 (타임아웃)"
            docker-compose logs nginx
            exit 1
        fi
        sleep 2
    done
    
    # Frontend 헬스체크
    log_info "⏳ Frontend 헬스체크 대기..."
    for i in {1..30}; do
        if curl -f http://localhost &>/dev/null; then
            log_success "✅ Frontend 정상 시작됨!"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "❌ Frontend 시작 실패 (타임아웃)"
            docker-compose logs frontend
            exit 1
        fi
        sleep 2
    done
    
    cd ..
}

# 함수: 전체 배포
deploy_all() {
    log_info "🚀 전체 시스템 배포 시작..."
    
    deploy_backend
    sleep 5  # 백엔드 완전 시작 대기
    deploy_frontend
    
    log_success "🎉 전체 배포 완료!"
    log_info "📋 접속 정보:"
    log_info "   🌐 Main Site: http://$NAS_IP"
    log_info "   🔗 API Docs: http://$NAS_IP/api/docs"
    log_info "   📊 Nginx Status: http://$NAS_IP:8080/nginx_status"
    log_info ""
    log_info "🔧 직접 접속 (Nginx 우회):"
    log_info "   Frontend: http://$NAS_IP:3000" 
    log_info "   Backend: http://$NAS_IP:8081"
}

# 함수: 상태 확인
check_status() {
    log_info "📊 서비스 상태 확인..."
    
    echo ""
    echo "🔍 컨테이너 상태:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "🌐 서비스 헬스체크:"
    
    # Nginx
    if curl -f http://localhost/nginx-health &>/dev/null; then
        log_success "✅ Nginx: 정상"
    else
        log_error "❌ Nginx: 오류"
    fi
    
    # Frontend (Nginx를 통해)
    if curl -f http://localhost &>/dev/null; then
        log_success "✅ Frontend (via Nginx): 정상"
    else
        log_error "❌ Frontend (via Nginx): 오류"
    fi
    
    # Backend API (Nginx를 통해)
    if curl -f http://localhost/api/auth/health &>/dev/null; then
        log_success "✅ Backend API (via Nginx): 정상"
    else
        log_error "❌ Backend API (via Nginx): 오류"
    fi
    
    # Direct Backend API
    if curl -f http://localhost:8081/api/auth/health &>/dev/null; then
        log_success "✅ Backend API (Direct): 정상"
    else
        log_error "❌ Backend API (Direct): 오류"
    fi
    
    # WebSocket (간단 체크)
    if nc -z localhost 8083 2>/dev/null; then
        log_success "✅ WebSocket: 정상"
    else
        log_error "❌ WebSocket: 오류"
    fi
    
    echo ""
    echo "📈 Nginx 상태 (자세한 정보):"
    curl -s http://localhost:8080/nginx_status 2>/dev/null || log_warning "⚠️ Nginx status 페이지 접근 불가"
}

# 함수: 로그 보기
show_logs() {
    local service="${1:-all}"
    
    case "$service" in
        "nginx")
            log_info "📋 Nginx 로그 확인..."
            cd $FRONTEND_DIR
            docker-compose logs -f nginx
            ;;
        "frontend")
            log_info "📋 Frontend 로그 확인..."
            cd $FRONTEND_DIR  
            docker-compose logs -f frontend
            ;;
        "backend")
            log_info "📋 Backend 로그 확인..."
            cd $BACKEND_DIR
            docker-compose logs -f ts-backend
            ;;
        "all")
            log_info "📋 전체 로그 확인..."
            echo "[1] Backend 로그"
            cd $BACKEND_DIR && docker-compose logs --tail=50 ts-backend
            echo ""
            echo "[2] Frontend 로그" 
            cd ../$FRONTEND_DIR && docker-compose logs --tail=50 frontend
            echo ""
            echo "[3] Nginx 로그"
            docker-compose logs --tail=50 nginx
            ;;
        *)
            log_error "❌ 잘못된 서비스명: $service"
            echo "사용 가능한 서비스: nginx, frontend, backend, all"
            ;;
    esac
}

# 함수: 성능 테스트
performance_test() {
    log_info "🚀 성능 테스트 시작..."
    
    # 기본 연결 테스트
    log_info "1️⃣ 기본 연결 테스트"
    time curl -s http://localhost > /dev/null && log_success "✅ Frontend 응답 시간 측정 완료"
    time curl -s http://localhost/api/auth/health > /dev/null && log_success "✅ API 응답 시간 측정 완료"
    
    # 동시 연결 테스트 (간단한 버전)
    if command -v ab &> /dev/null; then
        log_info "2️⃣ Apache Bench 테스트 (10 concurrent, 100 requests)"
        ab -n 100 -c 10 http://localhost/
        
        log_info "3️⃣ API 엔드포인트 테스트"
        ab -n 50 -c 5 http://localhost/api/auth/health
    else
        log_warning "⚠️ Apache Bench (ab) 없음. 설치 권장: apt-get install apache2-utils"
    fi
    
    # Nginx 상태 확인
    log_info "4️⃣ Nginx 상태 확인"
    curl -s http://localhost:8080/nginx_status
}

# 메인 로직
case "${1:-all}" in
    "backend")
        deploy_backend
        ;;
    "frontend") 
        deploy_frontend
        ;;
    "all")
        deploy_all
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs "${2:-all}"
        ;;
    "test")
        performance_test
        ;;
    "restart")
        log_info "🔄 서비스 재시작..."
        cd $FRONTEND_DIR && docker-compose restart
        cd ../$BACKEND_DIR && docker-compose restart
        log_success "✅ 재시작 완료"
        ;;
    "stop")
        log_info "🛑 서비스 중지..."
        cd $FRONTEND_DIR && docker-compose down
        cd ../$BACKEND_DIR && docker-compose down
        log_success "✅ 모든 서비스 중지됨"
        ;;
    "clean")
        log_warning "🧹 Docker 시스템 정리 (주의: 모든 중지된 컨테이너/이미지 삭제)"
        read -p "계속하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker system prune -af
            docker volume prune -f
            log_success "✅ Docker 정리 완료"
        else
            log_info "❌ 취소됨"
        fi
        ;;
    *)
        log_error "❌ 잘못된 명령어입니다."
        echo "사용법: $0 [backend|frontend|all|status|logs|test|restart|stop|clean]"
        echo ""
        echo "명령어:"
        echo "  backend   - 백엔드만 배포"
        echo "  frontend  - 프론트엔드 + Nginx 배포" 
        echo "  all       - 전체 배포 (기본값)"
        echo "  status    - 상태 확인"
        echo "  logs      - 로그 확인 [nginx|frontend|backend|all]"
        echo "  test      - 성능 테스트"
        echo "  restart   - 서비스 재시작"
        echo "  stop      - 서비스 중지"
        echo "  clean     - Docker 정리"
        echo ""
        echo "예시:"
        echo "  $0 all              # 전체 배포"
        echo "  $0 logs nginx       # Nginx 로그만 보기"
        echo "  $0 test             # 성능 테스트"
        exit 1
        ;;
esac
