"use client";

import { Button } from "@/components/ui/forms/button";
import { ArrowDown } from "lucide-react";

export default function HeroBannerView() {
  const scrollToMap = () => {
    const mapElement = document.getElementById("map-and-chat");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-b from-primary/10 to-background px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">AI와 대화하며 최적의 입지를 찾으세요</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
        지도 위에 표시된 기존 상가를 확인하고, AI에게 바로 추천을 요청하세요.
      </p>
      <Button size="lg" onClick={scrollToMap} className="gap-2">
        채팅 시작하기
        <ArrowDown size={16} />
      </Button>
    </div>
  );
}
