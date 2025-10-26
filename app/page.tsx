"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Calendar,
  FileText,
  Briefcase,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import LogoCarousel from "@/components/logo-carousel"
import { AnimatedCounter } from "@/components/animated-counter"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ClustersSection } from "@/components/home/clusters-section"

export default function HomePage() {
  const { t } = useLanguage()
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24 md:py-32 lg:py-40">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container relative mx-auto px-4"
        >
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/10"
            >
              <Sparkles className="h-5 w-5" />
              {t("home.hero.badge")}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="mb-8 text-balance text-5xl font-bold tracking-tight text-shadow-sm md:text-6xl lg:text-7xl xl:text-8xl"
            >
              <span className="gradient-text-red">{t("home.hero.title")}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mb-12 text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl lg:text-3xl"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="group gap-3 text-lg px-10 py-7 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <Link href="/register">
                  {t("home.hero.cta")}
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-10 py-7 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:border-primary transition-all"
              >
                <Link href="/companies">{t("nav.companies")}</Link>
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 border-t-2 border-primary/10 pt-16"
            >
              <div className="group text-center">
                <div className="mb-3 text-5xl font-bold text-primary transition-transform group-hover:scale-110 md:text-6xl">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-base font-medium text-muted-foreground md:text-lg">
                  {t("home.stats.companies")}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span>{t("home.stats.companiesGrowth")}</span>
                </div>
              </div>

              <div className="group text-center">
                <div className="mb-3 text-5xl font-bold text-primary transition-transform group-hover:scale-110 md:text-6xl">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <div className="text-base font-medium text-muted-foreground md:text-lg">
                  {t("home.stats.professionals")}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-primary">
                  <Users className="h-4 w-4" />
                  <span>{t("home.stats.professionalsActive")}</span>
                </div>
              </div>

              <div className="group text-center">
                <div className="mb-3 text-5xl font-bold text-primary transition-transform group-hover:scale-110 md:text-6xl">
                  <AnimatedCounter end={1000} suffix="+" />
                </div>
                <div className="text-base font-medium text-muted-foreground md:text-lg">{t("home.stats.events")}</div>
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-primary">
                  <Award className="h-4 w-4" />
                  <span>{t("home.stats.eventsYear")}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-10 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">{t("home.about.title")}</h2>
            <p className="text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl lg:leading-relaxed">
              {t("home.about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Partner Logo Carousel */}
      <LogoCarousel />

      {/* Clusters Section */}
      <ClustersSection />

      {/* Features Section */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-24 md:py-32">
        <motion.div
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">{t("home.features.title")}</h2>
            <p className="text-xl text-muted-foreground md:text-2xl">{t("home.features.subtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Companies Card */}
            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center md:text-left pb-4">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto md:mx-0 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10 group-hover:shadow-primary/20">
                    <Building2 className="h-8 w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-xl mb-3">{t("home.features.companies")}</CardTitle>
                  <CardDescription className="text-base md:text-sm leading-relaxed">
                    {t("home.features.companiesDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-center md:text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group/btn gap-2 p-0 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    <Link href="/companies">
                      {t("nav.companies")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Talks Card */}
            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center md:text-left pb-4">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto md:mx-0 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10 group-hover:shadow-primary/20">
                    <FileText className="h-8 w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-xl mb-3">{t("home.features.talks")}</CardTitle>
                  <CardDescription className="text-base md:text-sm leading-relaxed">
                    {t("home.features.talksDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-center md:text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group/btn gap-2 p-0 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    <Link href="/talks">
                      {t("nav.talks")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Events Card */}
            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center md:text-left pb-4">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto md:mx-0 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10 group-hover:shadow-primary/20">
                    <Calendar className="h-8 w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-xl mb-3">{t("home.features.events")}</CardTitle>
                  <CardDescription className="text-base md:text-sm leading-relaxed">
                    {t("home.features.eventsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-center md:text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group/btn gap-2 p-0 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    <Link href="/events">
                      {t("nav.events")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Jobs Card */}
            <motion.div variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center md:text-left pb-4">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto md:mx-0 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10 group-hover:shadow-primary/20">
                    <Briefcase className="h-8 w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-xl mb-3">{t("home.features.jobs")}</CardTitle>
                  <CardDescription className="text-base md:text-sm leading-relaxed">
                    {t("home.features.jobsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-center md:text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group/btn gap-2 p-0 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    <Link href="/jobs">
                      {t("nav.jobs")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">{t("home.whyChoose.title")}</h2>
              <p className="text-xl text-muted-foreground md:text-2xl">{t("home.whyChoose.subtitle")}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/20">
                  <Zap className="h-10 w-10 text-primary transition-colors duration-500 group-hover:text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{t("home.whyChoose.fast")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("home.whyChoose.fastDesc")}</p>
              </div>
              <div className="group text-center p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/20">
                  <Shield className="h-10 w-10 text-primary transition-colors duration-500 group-hover:text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{t("home.whyChoose.secure")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("home.whyChoose.secureDesc")}</p>
              </div>
              <div className="group text-center p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/20">
                  <Globe className="h-10 w-10 text-primary transition-colors duration-500 group-hover:text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{t("home.whyChoose.global")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("home.whyChoose.globalDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={itemVariants}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-red p-16 text-center text-white shadow-2xl md:p-20 lg:p-24"
          >
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="mb-8 text-balance text-4xl font-bold md:text-5xl lg:text-6xl text-shadow-sm">
                {t("home.cta.title")}
              </h2>
              <p className="mb-12 text-pretty text-xl opacity-95 md:text-2xl lg:text-3xl">{t("home.cta.subtitle")}</p>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Link href="/register">{t("nav.register")}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Link href="/partner">{t("nav.partner")}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
