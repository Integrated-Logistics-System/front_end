"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useChatViewModel } from "@/src/viewmodels/ChatViewModel";
import ChatView from "@/src/views/ChatView";
import ReactKakaoMap from "@/src/views/MapView";
import { Map, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function MapAndChatView() {
  // 반응형 디자인을 위한 미디어 쿼리
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("map");
  
  // 채팅 ViewModel에서 추천 상태 가져오기
  const { getRecommendations } = useChatViewModel();
  const recommendations = getRecommendations();
  
  // 추천이 추가되면 모바일에서 채팅 탭으로 전환
  useEffect(() => {
    if (isMobile && recommendations.length > 0) {
      setActiveTab("chat");
    }
  }, [isMobile, recommendations.length]);
  
  return (
    <div id="map-and-chat" className="flex flex-col md:flex-row h-screen">
      {isMobile ? (
        // 모바일 레이아웃: 탭 기반 인터페이스
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 grid w-[200px] grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map size={16} />
              <span>지도</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>채팅</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="h-full m-0 p-0">
            <ReactKakaoMap />
          </TabsContent>
          <TabsContent value="chat" className="h-full m-0 p-0">
            <ChatView />
          </TabsContent>
        </Tabs>
      ) : (
        // 데스크톱 레이아웃: 분할 화면
        <>
          <div className="w-full md:w-2/3 h-full">
            <ReactKakaoMap />
          </div>
          <div className="w-full md:w-1/3 h-full border-l">
            <ChatView />
          </div>
        </>
      )}
    </div>
  );
}
