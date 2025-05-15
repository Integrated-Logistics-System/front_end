import type { Metadata } from 'next'
import HeroBannerView from "@/src/views/HeroBannerView"
import MapAndChatView from "@/src/views/MapAndChatView"

export const metadata: Metadata = {
  title: 'AI Spot Finder - 홈',
  description: 'AI와 대화하며 최적의 입지를 찾아보세요',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroBannerView />
      <MapAndChatView />
    </main>
  )
}
