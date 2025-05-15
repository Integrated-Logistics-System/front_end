import { NextResponse } from "next/server"
import type { RecommendationPoint } from "@/types"

export async function POST(req: Request) {
  try {
    const { lat, lng, category } = await req.json()

    // In a real application, you would use AI or an algorithm to generate recommendations
    // based on the provided coordinates and category

    // For demonstration, we'll return a sample recommendation near the provided coordinates
    const recommendations: RecommendationPoint[] = [
      {
        name: `${category} 추천 위치`,
        lat: lat + 0.001, // Slightly offset from the provided coordinates
        lng: lng + 0.001,
        reason: `이 위치는 ${category} 사업에 적합한 유동인구와 접근성을 갖추고 있습니다.`,
        category,
        expectedFootTraffic: "하루 평균 300명",
        targetCustomer: "20-40대",
      },
    ]

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error in recommend-point API:", error)
    return NextResponse.json({ error: "Failed to process recommendation request" }, { status: 500 })
  }
}
