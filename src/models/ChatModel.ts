import { ChatMessage, RecommendationPoint, AIResponse } from '@/types';

// 채팅 메시지 모델 클래스
export class ChatMessageModel {
  constructor(private data: ChatMessage) {}

  get role(): 'user' | 'assistant' {
    return this.data.role;
  }

  get text(): string {
    return this.data.text;
  }

  isUser(): boolean {
    return this.data.role === 'user';
  }

  isAssistant(): boolean {
    return this.data.role === 'assistant';
  }

  toJSON(): ChatMessage {
    return { ...this.data };
  }
}

// 추천 지점 모델 클래스
export class RecommendationModel {
  constructor(private data: RecommendationPoint) {}

  get name(): string {
    return this.data.name;
  }

  get latitude(): number {
    return this.data.lat;
  }

  get longitude(): number {
    return this.data.lng;
  }

  get reason(): string {
    return this.data.reason;
  }

  get category(): string | undefined {
    return this.data.category;
  }

  get expectedFootTraffic(): string | undefined {
    return this.data.expectedFootTraffic;
  }

  get targetCustomer(): string | undefined {
    return this.data.targetCustomer;
  }

  getLocation(): { lat: number; lng: number } {
    return { lat: this.data.lat, lng: this.data.lng };
  }

  toJSON(): RecommendationPoint {
    return { ...this.data };
  }
}

// 채팅 대화 컬렉션 클래스
export class ChatConversationModel {
  private messages: ChatMessageModel[] = [];
  private recommendations: RecommendationModel[] = [];

  constructor(messages: ChatMessage[] = [], recommendations: RecommendationPoint[] = []) {
    this.messages = messages.map(msg => new ChatMessageModel(msg));
    this.recommendations = recommendations.map(rec => new RecommendationModel(rec));
  }

  getAllMessages(): ChatMessageModel[] {
    return this.messages;
  }

  getAllRecommendations(): RecommendationModel[] {
    return this.recommendations;
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(new ChatMessageModel(message));
  }

  addRecommendations(recommendations: RecommendationPoint[]): void {
    const newRecommendations = recommendations.map(rec => new RecommendationModel(rec));
    this.recommendations.push(...newRecommendations);
  }

  // 최근 메시지를 가져오는 메서드
  getLatestMessage(): ChatMessageModel | undefined {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : undefined;
  }

  // 사용자의 마지막 메시지를 가져오는 메서드
  getLatestUserMessage(): ChatMessageModel | undefined {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].isUser()) {
        return this.messages[i];
      }
    }
    return undefined;
  }

  // 메시지 수를 반환하는 메서드
  get messageCount(): number {
    return this.messages.length;
  }

  // 추천 수를 반환하는 메서드
  get recommendationCount(): number {
    return this.recommendations.length;
  }

  // 모든 데이터를 JSON 형태로 변환하는 메서드
  toJSON(): { messages: ChatMessage[]; recommendations: RecommendationPoint[] } {
    return {
      messages: this.messages.map(msg => msg.toJSON()),
      recommendations: this.recommendations.map(rec => rec.toJSON())
    };
  }
}
