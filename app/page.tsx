"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, FileText, Briefcase, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">{t("home.hero.title")}</h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">{t("home.hero.subtitle")}</p>
            <Button size="lg" asChild className="gap-2">
              <Link href="/register">
                {t("home.hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl">{t("home.about.title")}</h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{t("home.about.description")}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("home.features.companies")}</CardTitle>
                <CardDescription>{t("home.features.companiesDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="gap-2 p-0">
                  <Link href="/companies">
                    {t("nav.companies")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("home.features.talks")}</CardTitle>
                <CardDescription>{t("home.features.talksDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="gap-2 p-0">
                  <Link href="/talks">
                    {t("nav.talks")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("home.features.events")}</CardTitle>
                <CardDescription>{t("home.features.eventsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="gap-2 p-0">
                  <Link href="/events">
                    {t("nav.events")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("home.features.jobs")}</CardTitle>
                <CardDescription>{t("home.features.jobsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="gap-2 p-0">
                  <Link href="/jobs">
                    {t("nav.jobs")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">{t("home.cta.title")}</h2>
            <p className="mb-8 text-pretty text-lg opacity-90">{t("home.cta.subtitle")}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">{t("nav.register")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                <Link href="/partner">{t("nav.partner")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
