import { create } from 'zustand';
import { Market, RecommendationPoint } from '@/types';
import { MarketModel, MarketCollection } from '@/src/models/MarketModel';
import { RecommendationModel } from '@/src/models/ChatModel';

// 지도 관련 상태와 로직을 관리하는 ViewModel
interface MapState {
  // 모델 인스턴스들
  marketCollection: MarketCollection;
  recommendations: RecommendationModel[];
  
  // UI 상태
  selectedMarketId: string | null;
  userSelectedPoint: { lat: number; lng: number } | null;
  isLoading: boolean;
  mapCenter: { lat: number; lng: number };
  zoomLevel: number;
  
  // 액션 메서드들
  initializeMarkets: (markets: Market[]) => void;
  selectMarket: (marketId: string | null) => void;
  selectPoint: (lat: number, lng: number) => void;
  clearSelectedPoint: () => void;
  setMapCenter: (lat: number, lng: number) => void;
  setZoomLevel: (level: number) => void;
  addRecommendations: (recommendations: RecommendationPoint[]) => void;
  getSelectedMarket: () => MarketModel | null;
}

// Zustand 스토어 생성
export const useMapViewModel = create<MapState>((set: any, get: any) => ({
  // 초기 상태
  marketCollection: new MarketCollection([]),
  recommendations: [],
  selectedMarketId: null,
  userSelectedPoint: null,
  isLoading: false,
  mapCenter: { lat: 33.5563, lng: 126.79581 }, // 기본값
  zoomLevel: 13,
  
  // 액션 메서드 구현
  initializeMarkets: (markets: Market[]) => {
    set({ marketCollection: new MarketCollection(markets) });
  },
  
  selectMarket: (marketId: string | null) => {
    set({ selectedMarketId: marketId });
  },
  
  selectPoint: (lat: number, lng: number) => {
    set({ userSelectedPoint: { lat, lng } });
  },
  
  clearSelectedPoint: () => {
    set({ userSelectedPoint: null });
  },
  
  setMapCenter: (lat: number, lng: number) => {
    set({ mapCenter: { lat, lng } });
  },
  
  setZoomLevel: (level: number) => {
    set({ zoomLevel: level });
  },
  
  addRecommendations: (recommendations: RecommendationPoint[]) => {
    const currentRecommendations = get().recommendations;
    const newRecommendations = recommendations.map(rec => new RecommendationModel(rec));
    set({ recommendations: [...currentRecommendations, ...newRecommendations] });
  },
  
  getSelectedMarket: () => {
    const { marketCollection, selectedMarketId } = get();
    
    if (!selectedMarketId) return null;
    return marketCollection.findById(selectedMarketId) || null;
  }
}));
