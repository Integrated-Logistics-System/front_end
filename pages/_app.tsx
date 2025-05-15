import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/feedback/toaster';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v3/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <Script
        strategy="afterInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=pdqnlcxqrg`}
      ></Script>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}

export default MyApp;
