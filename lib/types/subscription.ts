export interface SubscriptionPlan {
  id: string
  stripeProductId: string
  isPopular: boolean
  maxCategories: number
  maxArticles: number
  maxOpenJobs: number
  displayOrder: number
  isActive: boolean
  translations: PlanTranslation[]
  features: Feature[]
  prices: Price[]
}

export interface PlanTranslation {
  languageCode: string
  name: string
  description: string | null
}

export interface Feature {
  order: number
  translations: FeatureTranslation[]
}

export interface FeatureTranslation {
  languageCode: string
  text: string
}

export interface Price {
  currency: string // "EUR" or "RON"
  currencyCode: string // "eur" or "ron"
  currencySymbol: string // "€" or "RON"
  monthlyPrice: number
  yearlyPrice: number
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[]
  totalCount: number
}

export interface CreateSubscriptionPlanDto {
  translations: Array<{
    languageCode: string
    name: string
    description?: string
  }>
  features: Array<{
    order: number
    translations: Array<{
      languageCode: string
      text: string
    }>
  }>
  prices: Array<{
    currency: "EUR" | "RON"
    monthlyPrice: number
    yearlyPrice: number
  }>
  isPopular: boolean
  maxCategories: number
  maxArticles: number
  maxOpenJobs: number
  displayOrder: number
}

export interface UpdateSubscriptionPlanDto {
  id: string
  translations: Array<{
    languageCode: string
    name: string
    description?: string
  }>
  features: Array<{
    order: number
    translations: Array<{
      languageCode: string
      text: string
    }>
  }>
  isPopular: boolean
  maxCategories: number
  maxArticles: number
  maxOpenJobs: number
  displayOrder: number
  isActive: boolean
}

export interface CheckoutSessionResponse {
  sessionId: string
  publishableKey: string
}

export interface SubscriptionStatusDto {
  subscriptionId: string
  status: string
  currentPeriodEnd: string
  isYearly: boolean
  currency: string
  currentPrice: number
  plan: SubscriptionPlan
}
