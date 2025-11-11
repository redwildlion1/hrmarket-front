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
  currency: "EUR" | "RON"
  language: string
  onSelect: () => void
  loading?: boolean
}

const getTranslation = (
  translations: Array<{ languageCode: string; [key: string]: any }>,
  field: string,
  language: string,
) => {
  const translation = translations.find((t) => t.languageCode === language)
  return translation?.[field] || translations[0]?.[field] || ""
}

export function PlanCard({ plan, isYearly, currency, language, onSelect, loading }: PlanCardProps) {
  const { t } = useLanguage()

  const priceInfo = plan.prices.find((p) => p.currency.toUpperCase() === currency)
  if (!priceInfo) return null

  const price = isYearly ? priceInfo.yearlyPrice : priceInfo.monthlyPrice
  const period = isYearly ? t("subscription.perYear") : t("subscription.perMonth")
  const savings = isYearly
    ? Math.round(((priceInfo.monthlyPrice * 12 - priceInfo.yearlyPrice) / (priceInfo.monthlyPrice * 12)) * 100)
    : 0

  const name = getTranslation(plan.translations, "name", language)
  const description = getTranslation(plan.translations, "description", language)

  return (
    <Card className={plan.isPopular ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        {plan.isPopular && (
          <Badge className="mb-2 w-fit" variant="default">
            {t("subscription.popular")}
          </Badge>
        )}
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">
            {priceInfo.currencySymbol}
            {price}
          </span>
          {period}
        </CardDescription>
        {isYearly && savings > 0 && (
          <Badge variant="secondary" className="w-fit">
            {t("subscription.save").replace("{amount}", savings.toString())}
          </Badge>
        )}
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t("subscription.features")}:</p>
          {plan.features
            .sort((a, b) => a.order - b.order)
            .map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm">{getTranslation(feature.translations, "text", language)}</span>
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
