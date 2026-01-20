"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Sparkles, Zap, Crown, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  icon: any
  popular?: boolean
}

export default function PartnerPage() {
  const { t } = useLanguage()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    // TODO: Fetch from backend API
    setTiers([
      {
        id: "basic",
        name: t("partner.basic.name"),
        description: t("partner.basic.description"),
        price: 99,
        icon: Zap,
        features: [
          t("partner.basic.feature1"),
          t("partner.basic.feature2"),
          t("partner.basic.feature3"),
          t("partner.basic.feature4"),
        ],
      },
      {
        id: "professional",
        name: t("partner.professional.name"),
        description: t("partner.professional.description"),
        price: 199,
        icon: Rocket,
        popular: true,
        features: [
          t("partner.professional.feature1"),
          t("partner.professional.feature2"),
          t("partner.professional.feature3"),
          t("partner.professional.feature4"),
          t("partner.professional.feature5"),
        ],
      },
      {
        id: "enterprise",
        name: t("partner.enterprise.name"),
        description: t("partner.enterprise.description"),
        price: 499,
        icon: Crown,
        features: [
          t("partner.enterprise.feature1"),
          t("partner.enterprise.feature2"),
          t("partner.enterprise.feature3"),
          t("partner.enterprise.feature4"),
          t("partner.enterprise.feature5"),
          t("partner.enterprise.feature6"),
        ],
      },
    ])
    setLoading(false)
  }, [t])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-10 right-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-primary shadow-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("partner.badge")}
            </div>
            <h1 className="mb-4 sm:mb-6 text-balance text-4xl sm:text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="gradient-text-red">{t("partner.title")}</span>
            </h1>
            <p className="text-pretty text-lg sm:text-xl text-muted-foreground md:text-2xl">{t("partner.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16 md:py-24">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {tiers.map((tier) => {
              const Icon = tier.icon
              return (
                <motion.div key={tier.id} variants={itemVariants}>
                  <Card
                    className={`relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      tier.popular
                        ? "border-primary shadow-xl shadow-primary/20 scale-105"
                        : "hover:border-primary hover:shadow-primary/10"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-red text-white px-3 py-1 sm:px-4 text-xs sm:text-sm font-semibold rounded-bl-lg">
                        {t("partner.popular")}
                      </div>
                    )}
                    <CardHeader className="pb-6 sm:pb-8 pt-6 sm:pt-8">
                      <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl sm:text-3xl">{tier.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">{tier.description}</CardDescription>
                      <div className="mt-4 sm:mt-6">
                        <span className="text-4xl sm:text-5xl font-bold text-primary">${tier.price}</span>
                        <span className="text-base sm:text-lg text-muted-foreground">/{t("partner.monthly")}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6 sm:pb-8">
                      <ul className="space-y-3 sm:space-y-4">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            </div>
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        className="w-full h-10 sm:h-12 text-sm sm:text-base shadow-lg"
                        variant={tier.popular ? "default" : "outline"}
                      >
                        {t("partner.selectPlan")}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 sm:mb-12 text-center">
              <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold md:text-5xl">{t("partner.faq.title")}</h2>
              <p className="text-lg sm:text-xl text-muted-foreground">{t("partner.faq.subtitle")}</p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="border-2 rounded-lg px-4 sm:px-6 bg-background">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-primary text-left">
                  {t("partner.faq.q1")}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("partner.faq.a1")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-2 rounded-lg px-4 sm:px-6 bg-background">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-primary text-left">
                  {t("partner.faq.q2")}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("partner.faq.a2")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-2 rounded-lg px-4 sm:px-6 bg-background">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-primary text-left">
                  {t("partner.faq.q3")}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("partner.faq.a3")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
