"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/hooks/use-toast"
import { PlanCard } from "@/components/subscription/plan-card"
import { getSubscriptionPlans, createCheckoutSession } from "@/lib/api/subscription"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CompanySubscriptionPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const companyId = params.id as string

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isYearly, setIsYearly] = useState(false)
  const [currency, setCurrency] = useState<"EUR" | "RON">("EUR")
  const [loading, setLoading] = useState(true)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

  useEffect(() => {
    getSubscriptionPlans()
      .then(setPlans)
      .catch((error) => {
        console.error("[v0] Failed to load plans:", error)
        toast({
          title: t("auth.error"),
          description: "Failed to load subscription plans",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setProcessingPlanId(plan.id)

    try {
      const price = plan.prices.find((p) => p.currency === currency)
      if (!price) {
        throw new Error("Price not found for selected currency")
      }

      const priceId = isYearly ? price.stripePriceIdYearly : price.stripePriceIdMonthly
      const { sessionId } = await createCheckoutSession(companyId, plan.id, priceId, isYearly, currency)

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      }
    } catch (error: any) {
      console.error("[v0] Checkout error:", error)
      if (error.message?.includes("Unauthorized")) {
        router.push("/login")
        return
      }
      toast({
        title: t("auth.error"),
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      })
      setProcessingPlanId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{t("subscription.title")}</h1>
          <p className="text-muted-foreground">{t("subscription.subtitle")}</p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Tabs value={isYearly ? "yearly" : "monthly"} onValueChange={(v) => setIsYearly(v === "yearly")}>
            <TabsList>
              <TabsTrigger value="monthly">{t("subscription.monthly")}</TabsTrigger>
              <TabsTrigger value="yearly">{t("subscription.yearly")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={currency} onValueChange={(v) => setCurrency(v as "EUR" | "RON")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="RON">RON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans
            .filter((plan) => plan.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isYearly={isYearly}
                currency={currency}
                language={language}
                onSelect={() => handleSelectPlan(plan)}
                loading={processingPlanId === plan.id}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
