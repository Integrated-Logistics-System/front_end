import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/providers';
import ConnectionStatus from '@/components/common/ConnectionStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simple Recipe Chat',
  description: 'AI와 함께하는 간단한 레시피 채팅',
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
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-orange-950 via-amber-950 to-red-950`} suppressHydrationWarning>
        <Providers>
          {children}
          <ConnectionStatus />
        </Providers>
      </body>
    </html>
  );
}