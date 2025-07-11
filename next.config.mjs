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
    domains: ['localhost', 'via.placeholder.com', '192.168.0.111'],
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/webp', 'image/avif'],
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
    
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.111:8081/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://192.168.0.111:8083/:path*',
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

    // 개발 환경에서 소스맵 최적화
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    return config;
  },

  // 🚀 성능 최적화
  poweredByHeader: false,
  compress: true,
  
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
