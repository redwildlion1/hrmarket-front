"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PlanCard } from "@/components/subscription/plan-card"
import { getSubscriptionPlans, createCheckoutSession } from "@/lib/api/subscription"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CompanySubscriptionPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const companyId = params.id as string

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isYearly, setIsYearly] = useState(false)
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
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const priceId = isYearly ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly
      const { sessionId } = await createCheckoutSession(companyId, priceId, session.access_token)

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      }
    } catch (error: any) {
      console.error("[v0] Checkout error:", error)
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

        <div className="mb-8 flex justify-center">
          <Tabs value={isYearly ? "yearly" : "monthly"} onValueChange={(v) => setIsYearly(v === "yearly")}>
            <TabsList>
              <TabsTrigger value="monthly">{t("subscription.monthly")}</TabsTrigger>
              <TabsTrigger value="yearly">{t("subscription.yearly")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              onSelect={() => handleSelectPlan(plan)}
              loading={processingPlanId === plan.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
