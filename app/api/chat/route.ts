import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { ChatMessage, RecommendationPoint } from "@/types"

// Sample recommendations for demonstration
const sampleRecommendations: Record<string, RecommendationPoint[]> = {
  카페: [
    {
      name: "신규 카페 추천 위치",
      lat: 37.5055,
      lng: 127.0228,
      reason: "유동인구가 많고 경쟁 매장이 적은 위치입니다.",
      category: "카페",
      expectedFootTraffic: "하루 평균 500명",
      targetCustomer: "20-30대 직장인",
    },
  ],
  음식점: [
    {
      name: "한식당 추천 위치",
      lat: 37.5065,
      lng: 127.0218,
      reason: "오피스 밀집 지역으로 점심 수요가 많습니다.",
      category: "한식",
      expectedFootTraffic: "하루 평균 300명",
      targetCustomer: "직장인",
    },
  ],
  부동산: [
    {
      name: "부동산 중개소 추천 위치",
      lat: 37.5075,
      lng: 127.0208,
      reason: "신축 아파트 단지 인근으로 거래가 활발합니다.",
      category: "부동산",
      expectedFootTraffic: "하루 평균 50명",
      targetCustomer: "30-40대 가족",
    },
  ],
}

// This is a simplified implementation for demonstration
// In a real application, you would use a more sophisticated AI model
export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json()

    // Extract keywords to determine recommendations
    const keywords = extractKeywords(prompt)

    // Generate AI response using AI SDK
    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [
        ...context.previousMessages.map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.text,
        })),
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const text = await result.text

    // Determine if we should include recommendations
    let recommendations: RecommendationPoint[] = []

    if (keywords.includes("카페")) {
      recommendations = sampleRecommendations["카페"]
    } else if (keywords.includes("음식점") || keywords.includes("식당")) {
      recommendations = sampleRecommendations["음식점"]
    } else if (keywords.includes("부동산")) {
      recommendations = sampleRecommendations["부동산"]
    }

    return NextResponse.json({
      text,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

// Simple keyword extraction function
function extractKeywords(text: string): string[] {
  const keywords = ["카페", "음식점", "식당", "부동산", "중개소"]
  return keywords.filter((keyword) => text.includes(keyword))
}
