import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/feedback/toaster"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Spot Finder - 최적의 입지를 찾으세요",
  description: "지도 위에 표시된 기존 상가를 확인하고, AI에게 바로 추천을 요청하세요.",
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="text/javascript"
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2f3729c4eddd3e32208a9f02a1cfadf8"
          ></script>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
