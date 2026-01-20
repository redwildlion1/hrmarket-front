"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  Linkedin,
  Users,
  Target,
  TrendingUp,
  Rocket,
  DollarSign,
  BarChart3,
  Globe2,
  Award,
  Zap,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { AnimatedCounter } from "@/components/animated-counter"

export default function InvestorsPage() {
  const { t } = useLanguage()
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [metricsRef, metricsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const team = [
    {
      name: t("investors.team.member1.name"),
      role: t("investors.team.member1.role"),
      bio: t("investors.team.member1.bio"),
      linkedin: "https://linkedin.com/company/thinkr-science",
    },
    {
      name: t("investors.team.member2.name"),
      role: t("investors.team.member2.role"),
      bio: t("investors.team.member2.bio"),
      linkedin: "https://linkedin.com/in/alinahrmarket",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-20 right-10 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 left-10 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container relative mx-auto px-4"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              variants={itemVariants}
              className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-primary shadow-lg shadow-primary/10"
            >
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("investors.badge")}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 sm:mb-8 text-balance text-4xl sm:text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="gradient-text-red">{t("investors.title")}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-8 sm:mb-12 text-pretty text-lg sm:text-xl leading-relaxed text-muted-foreground md:text-2xl lg:text-3xl"
            >
              {t("investors.subtitle")}
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                asChild
                className="gap-3 text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-7 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all w-full sm:w-auto"
              >
                <a href="mailto:investors@hrmarket.com">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                  {t("investors.contactButton")}
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Market Metrics Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background">
        <motion.div
          ref={metricsRef}
          initial="hidden"
          animate={metricsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">{t("investors.market.title")}</h2>
            <p className="text-lg sm:text-xl text-muted-foreground md:text-2xl">{t("investors.market.subtitle")}</p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
            <motion.div variants={itemVariants}>
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center pb-4">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 mx-auto transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter end={50} prefix="$" suffix="M" />
                  </div>
                  <CardDescription className="text-sm sm:text-base">{t("investors.market.tam")}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center pb-4">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 mx-auto transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter end={35} suffix="%" />
                  </div>
                  <CardDescription className="text-sm sm:text-base">{t("investors.market.growth")}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center pb-4">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 mx-auto transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter end={50000} suffix="+" />
                  </div>
                  <CardDescription className="text-sm sm:text-base">{t("investors.market.professionals")}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative text-center pb-4">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 mx-auto transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter end={2000} suffix="+" />
                  </div>
                  <CardDescription className="text-sm sm:text-base">{t("investors.market.companies")}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">{t("investors.vision.title")}</h2>
              <p className="text-lg sm:text-xl text-muted-foreground md:text-2xl">{t("investors.vision.subtitle")}</p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <Target className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 sm:mb-3">{t("investors.vision.mission")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.vision.missionDesc")}</p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <Globe2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 sm:mb-3">{t("investors.vision.market")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.vision.marketDesc")}</p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                    <Rocket className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 sm:mb-3">{t("investors.vision.growth")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.vision.growthDesc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">{t("investors.advantages.title")}</h2>
              <p className="text-lg sm:text-xl text-muted-foreground md:text-2xl">{t("investors.advantages.subtitle")}</p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group text-center p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 shadow-lg shadow-primary/20 transition-all group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                  <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">{t("investors.advantages.firstMover")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.advantages.firstMoverDesc")}</p>
              </div>

              <div className="group text-center p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 shadow-lg shadow-primary/20 transition-all group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">{t("investors.advantages.network")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.advantages.networkDesc")}</p>
              </div>

              <div className="group text-center p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white border-2 border-primary/20 shadow-lg shadow-primary/20 transition-all group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">{t("investors.advantages.quality")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("investors.advantages.qualityDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24 md:py-32">
        <motion.div
          ref={teamRef}
          initial="hidden"
          animate={teamInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">{t("investors.team.title")}</h2>
              <p className="text-lg sm:text-xl text-muted-foreground md:text-2xl">{t("investors.team.subtitle")}</p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {team.map((member, index) => (
                <motion.div key={member.name} variants={itemVariants}>
                  <Card className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CardHeader className="relative">
                      <div className="mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-red text-white text-2xl sm:text-3xl font-bold shadow-lg shadow-primary/20">
                        {member.name.charAt(0)}
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">{member.name}</CardTitle>
                      <CardDescription className="text-base sm:text-lg font-semibold text-primary">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{member.bio}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 bg-transparent hover:bg-primary hover:text-white transition-all"
                      >
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                          {t("investors.team.linkedin")}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl gradient-red p-8 sm:p-16 text-center text-white shadow-2xl md:p-20">
              <div className="absolute inset-0 bg-dot-pattern opacity-20" />
              <div className="absolute top-10 right-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-10 left-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 sm:mb-8 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Mail className="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold md:text-5xl">{t("investors.contact.title")}</h2>
                <p className="mb-6 sm:mb-8 text-lg sm:text-xl opacity-95 md:text-2xl">{t("investors.contact.description")}</p>
                <div className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wider">
                    {t("investors.contact.emailLabel")}
                  </p>
                  <a
                    href="mailto:investors@hrmarket.com"
                    className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold hover:underline transition-all whitespace-nowrap inline-block"
                  >
                    investors@hrmarket.com
                  </a>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto"
                >
                  <a href="mailto:investors@hrmarket.com">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    {t("investors.contact.getInTouch")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
