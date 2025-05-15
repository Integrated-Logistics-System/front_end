"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { ScrollArea } from "@/components/ui/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/display/card";
import { useToast } from "@/components/ui/feedback/toaster";
import { useChatViewModel } from "@/src/viewmodels/ChatViewModel";
import { apiService } from "@/src/utils/apiService";

export default function ChatView() {
  // ViewModel에서 상태와 액션 가져오기
  const {
    conversation,
    inputText,
    isLoading,
    error,
    setInputText,
    sendMessage,
    setApiService,
    clearError,
    getMessages
  } = useChatViewModel();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // API 서비스 설정
  useEffect(() => {
    setApiService(apiService);
  }, [setApiService]);
  
  // 에러 처리
  useEffect(() => {
    if (error) {
      toast({
        title: "오류 발생",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);
  
  // 새 메시지 도착 시 스크롤 맨 아래로
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [getMessages()]);
  
  // 메시지 전송 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };
  
  // 메시지 목록
  const messages = getMessages();
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">AI Spot Finder</h2>
        <p className="text-sm text-muted-foreground">지역에 대해 질문하거나 추천을 요청해보세요</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>AI와 대화를 시작해보세요.</p>
            <p className="text-sm mt-2">예시: "이 지역에 어떤 업종이 부족해?", "여기 음식점 스트리트로 추천해줘"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index: number) => (
              <Card
                key={index}
                className={`max-w-[80%] ${
                  message.isUser() ? "ml-auto bg-primary text-primary-foreground" : "mr-auto"
                }`}
              >
                <CardContent className="p-3">
                  <p>{message.text}</p>
                </CardContent>
              </Card>
            ))}
            {isLoading && (
              <Card className="max-w-[80%] mr-auto">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="무엇을 도와드릴까요?"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send size={18} />
            <span className="sr-only">전송</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
