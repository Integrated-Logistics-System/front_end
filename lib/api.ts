import type { Market, ChatMessage, RecommendationPoint } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"

/**
 * Fetches all markets from the API
 */
export async function fetchMarkets(): Promise<Market[]> {
  const response = await fetch(`${API_BASE_URL}/markets`)

  if (!response.ok) {
    throw new Error("Failed to fetch markets")
  }

  return response.json()
}

/**
 * Sends a chat message to the AI and returns the response
 */
export async function postChat(
  prompt: string,
  context: {
    selectedMarket: Market | null
    userSelectedPoint: { lat: number; lng: number } | null
    previousMessages: ChatMessage[]
  },
): Promise<{
  text: string
  recommendations?: RecommendationPoint[]
}> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      context,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get AI response")
  }

  return response.json()
}

/**
 * Requests recommendations for a specific point and category
 */
export async function recommendPoint(lat: number, lng: number, category: string): Promise<RecommendationPoint[]> {
  const response = await fetch(`${API_BASE_URL}/recommend-point`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat,
      lng,
      category,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get recommendations")
  }

  return response.json()
}
