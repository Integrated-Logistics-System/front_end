// Global type declaration for Kakao Maps
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void
        Map: any
        LatLng: any
        Marker: any
        MarkerImage: any
        event: {
          addListener: (target: any, type: string, callback: any) => void
        }
        CustomOverlay: any
        InfoWindow: any
      }
    }
  }
}

// Market data from API
export interface Market {
  shop_id: string
  name: string
  category: string
  dong_code: string
  lat: number
  lng: number
  address?: string
}

// Chat message structure
export interface ChatMessage {
  role: "user" | "assistant"
  text: string
}

// AI recommendation point
export interface RecommendationPoint {
  name: string
  lat: number
  lng: number
  reason: string
  category?: string
  expectedFootTraffic?: string
  targetCustomer?: string
}

// AI response structure
export interface AIResponse {
  text: string
  recommendations?: RecommendationPoint[]
}
