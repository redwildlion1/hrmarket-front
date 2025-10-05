import type { SubscriptionPlan } from "@/lib/types/subscription"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await fetch(`${API_BASE_URL}/subscription-plans`)
  if (!response.ok) throw new Error("Failed to fetch subscription plans")
  return response.json()
}

export async function createCheckoutSession(
  companyId: string,
  priceId: string,
  token: string,
): Promise<{ sessionId: string }> {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId }),
  })

  if (!response.ok) throw new Error("Failed to create checkout session")
  return response.json()
}
