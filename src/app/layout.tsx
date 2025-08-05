import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/providers';
import { EnhancedDebugPanel } from '../components/debug/EnhancedDebugPanel';
import { TokenDebugger } from '../components/debug/TokenDebugger';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Recipe Assistant',
  description: '개인 맞춤 AI 셔프와 함께하는 스마트 요리 여행',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-orange-950 via-amber-950 to-red-950`} suppressHydrationWarning>
        <Providers>
          {children}
          {/* 강화된 디버그 패널 */}
          {process.env.NODE_ENV === 'development' && <EnhancedDebugPanel />}
          {/* 토큰 매니저 */}
          {process.env.NODE_ENV === 'development' && <TokenDebugger />}
        </Providers>
      </body>
    </html>
  );
}
