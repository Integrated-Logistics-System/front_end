/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Docker 배포 최적화
  output: 'standalone',
  
  // 🔧 실험적 기능
  experimental: {
    serverComponentsExternalPackages: ['socket.io-client'],
  },
  
  // 🖼️ 이미지 최적화
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(',') || ['choi1994.duckdns.org', 'localhost', 'via.placeholder.com'],
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'choi1994.duckdns.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // 🌍 환경변수
  env: {
    // 🔄 Nginx를 통한 프록시 설정
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || '/ws',
  },
  
  // 🎨 컴파일러 최적화
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 🔄 API 프록시 설정 (개발환경용)
  async rewrites() {
    // 프로덕션에서는 Nginx가 처리
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8083';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${wsUrl}/:path*`,
      },
    ];
  },
  
  // 🔧 웹팩 설정
  webpack: (config, { dev, isServer }) => {
    // Socket.io 클라이언트 브라우저 호환성
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // 개발 환경에서 소스맵 최적화 및 청크 로딩 개선
    if (dev) {
      config.devtool = 'eval-source-map';
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // 🚀 성능 최적화
  poweredByHeader: false,
  compress: true,
  
  // 🔧 개발 서버 설정
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  
  // 🔄 청크 로딩 최적화
  onDemandEntries: {
    // 개발 환경에서 청크 로딩 타임아웃 증가
    maxInactiveAge: 60 * 1000, // 1분
    pagesBufferLength: 5,
  },
  
  // 📊 번들 분석 (개발 시)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      if (!dev && !isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // 🔒 보안 헤더
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
