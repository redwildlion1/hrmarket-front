import { apiClient } from "./client"
import type { SubscriptionPlan, CheckoutSessionResponse } from "@/lib/types/subscription"

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.subscriptions.getPlans()
  return response.plans
}

export async function createCheckoutSession(
  firmId: string,
  planId: string,
  priceId: string,
  isYearly: boolean,
  currency: "EUR" | "RON" = "EUR",
): Promise<CheckoutSessionResponse> {
  return apiClient.subscriptions.createCheckoutSession({
    firmId,
    planId,
    priceId,
    isYearly,
    currency,
  })
}

export async function getSubscriptionStatus(firmId: string) {
  return apiClient.subscriptions.getSubscriptionStatus(firmId)
}
