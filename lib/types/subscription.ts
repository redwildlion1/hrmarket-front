export interface SubscriptionPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
  features: string[]
  popular?: boolean
}
