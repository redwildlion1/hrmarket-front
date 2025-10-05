"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check } from "lucide-react"

interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
}

export default function PartnerPage() {
  const { t } = useLanguage()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from backend API
    // Mock data for now
    setTiers([
      {
        id: "basic",
        name: "Basic",
        description: "Perfect for small businesses",
        price: 99,
        features: ["Company profile", "Up to 5 job postings", "Basic analytics", "Email support"],
      },
      {
        id: "professional",
        name: "Professional",
        description: "For growing companies",
        price: 199,
        features: [
          "Everything in Basic",
          "Up to 20 job postings",
          "Advanced analytics",
          "Priority support",
          "Featured company listing",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For large organizations",
        price: 499,
        features: [
          "Everything in Professional",
          "Unlimited job postings",
          "Custom branding",
          "Dedicated account manager",
          "API access",
          "Custom integrations",
        ],
      },
    ])
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">{t("partner.title")}</h1>
        <p className="text-pretty text-lg text-muted-foreground">{t("partner.subtitle")}</p>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className={tier.id === "professional" ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground">/{t("partner.monthly")}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.id === "professional" ? "default" : "outline"}>
                {t("partner.selectPlan")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-center text-3xl font-bold">{t("partner.faq.title")}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("partner.faq.q1")}</AccordionTrigger>
            <AccordionContent>{t("partner.faq.a1")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("partner.faq.q2")}</AccordionTrigger>
            <AccordionContent>{t("partner.faq.a2")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("partner.faq.q3")}</AccordionTrigger>
            <AccordionContent>{t("partner.faq.a3")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
