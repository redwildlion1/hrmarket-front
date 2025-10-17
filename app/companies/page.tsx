"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, MapPin, Users, ArrowRight, Filter, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function CompaniesPage() {
  const { t } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    // TODO: Fetch from backend API
    setLoading(false)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-primary shadow-lg">
              <Sparkles className="h-5 w-5" />
              {t("companies.badge")}
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="gradient-text-red">{t("companies.title")}</span>
            </h1>
            <p className="mb-10 text-pretty text-xl text-muted-foreground md:text-2xl">{t("companies.subtitle")}</p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("companies.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 pr-4 text-lg border-2 shadow-lg"
                  />
                </div>
                <Button size="lg" className="h-14 px-8 shadow-lg">
                  <Filter className="mr-2 h-5 w-5" />
                  {t("companies.filter")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16 md:py-24">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          {companies.length === 0 && !loading && (
            <motion.div variants={itemVariants} className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">{t("companies.noResults")}</h3>
              <p className="text-lg text-muted-foreground">{t("companies.noResultsDesc")}</p>
            </motion.div>
          )}

          {/* Mock Company Cards for demonstration */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="group h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  <CardHeader className="pb-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-red shadow-lg">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {t("companies.featured")}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      Company Name {i}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Bucharest, Romania
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Leading HR solutions provider specializing in talent acquisition and workforce management.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>50-200 {t("companies.employees")}</span>
                    </div>
                    <Button variant="ghost" className="group/btn w-full gap-2 text-primary font-semibold">
                      {t("companies.viewProfile")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
