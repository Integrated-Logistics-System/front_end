import { NextResponse } from "next/server"
import type { Market } from "@/types"

// Sample data for demonstration
const sampleMarkets: Market[] = [
  {
    shop_id: "1",
    name: "스타벅스 강남점",
    category: "카페",
    dong_code: "1168010100",
    lat: 37.5025,
    lng: 127.0248,
    address: "서울특별시 강남구 테헤란로 101",
  },
  {
    shop_id: "2",
    name: "맥도날드 역삼점",
    category: "패스트푸드",
    dong_code: "1168010100",
    lat: 37.5015,
    lng: 127.0268,
    address: "서울특별시 강남구 테헤란로 152",
  },
  {
    shop_id: "3",
    name: "올리브영 강남역점",
    category: "드럭스토어",
    dong_code: "1168010100",
    lat: 37.5005,
    lng: 127.0278,
    address: "서울특별시 강남구 강남대로 396",
  },
  {
    shop_id: "4",
    name: "CGV 강남",
    category: "영화관",
    dong_code: "1168010100",
    lat: 37.5035,
    lng: 127.0258,
    address: "서울특별시 강남구 강남대로 438",
  },
  {
    shop_id: "5",
    name: "교보문고 강남점",
    category: "서점",
    dong_code: "1168010100",
    lat: 37.5045,
    lng: 127.0238,
    address: "서울특별시 강남구 강남대로 465",
  },
]

export async function GET() {
  // In a real application, you would fetch this data from a database
  return NextResponse.json(sampleMarkets)
}
