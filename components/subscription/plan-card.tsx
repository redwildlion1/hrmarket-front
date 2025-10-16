"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SubscriptionPlan } from "@/lib/types/subscription"

interface PlanCardProps {
  plan: SubscriptionPlan
  isYearly: boolean
  onSelect: () => void
  loading?: boolean
}

export function PlanCard({ plan, isYearly, onSelect, loading }: PlanCardProps) {
  const { t } = useLanguage()

  const price = isYearly ? plan.priceYearly : plan.priceMonthly
  const period = isYearly ? t("subscription.perYear") : t("subscription.perMonth")
    const savings = isYearly
    ? Math.round(((plan.priceMonthly * 12 - plan.priceYearly) / (plan.priceMonthly * 12)) * 100)
    : 0

  return (
    <Card className={plan.popular ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        {plan.popular && (
          <Badge className="mb-2 w-fit" variant="default">
            {t("subscription.popular")}
          </Badge>
        )}
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">${price}</span>
          {period}
        </CardDescription>
        {isYearly && savings > 0 && (
          <Badge variant="secondary" className="w-fit">
            {t("subscription.save").replace("{amount}", savings.toString())}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t("subscription.features")}:</p>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect} disabled={loading}>
          {loading ? t("subscription.processing") : t("subscription.selectPlan")}
        </Button>
      </CardFooter>
    </Card>
  )
}
