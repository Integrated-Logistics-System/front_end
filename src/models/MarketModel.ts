import { Market } from '@/types';

// Market 모델 클래스: 데이터와 비즈니스 로직을 담당
export class MarketModel {
  constructor(private data: Market) {}

  get id(): string {
    return this.data.shop_id;
  }

  get name(): string {
    return this.data.name;
  }

  get category(): string {
    return this.data.category;
  }

  get dongCode(): string {
    return this.data.dong_code;
  }

  get latitude(): number {
    return this.data.lat;
  }

  get longitude(): number {
    return this.data.lng;
  }

  get address(): string {
    return this.data.address || '';
  }

  // 위치 좌표를 반환하는 메서드
  getLocation(): { lat: number; lng: number } {
    return { lat: this.data.lat, lng: this.data.lng };
  }

  // JSON 형태로 변환하는 메서드
  toJSON(): Market {
    return { ...this.data };
  }
}

// 여러 마켓을 관리하는 컬렉션 클래스
export class MarketCollection {
  private markets: MarketModel[] = [];

  constructor(markets: Market[] = []) {
    this.markets = markets.map(market => new MarketModel(market));
  }

  getAll(): MarketModel[] {
    return this.markets;
  }

  findById(id: string): MarketModel | undefined {
    return this.markets.find(market => market.id === id);
  }

  findByCategory(category: string): MarketModel[] {
    return this.markets.filter(market => market.category === category);
  }

  // 특정 위치 근처의 마켓을 찾는 메서드
  findNearby(lat: number, lng: number, radiusKm: number): MarketModel[] {
    return this.markets.filter(market => {
      const distance = calculateDistance(
        lat, lng,
        market.latitude, market.longitude
      );
      return distance <= radiusKm;
    });
  }
}

// 두 지점 간의 거리를 계산하는 헬퍼 함수 (Haversine 공식 사용)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // 거리 (km)
}
