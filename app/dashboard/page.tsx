"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus, FileText, Calendar, Briefcase, Settings, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function DashboardPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

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

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold md:text-5xl gradient-text-red">Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild className="h-11 border-2 bg-transparent">
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="h-11 border-2 bg-transparent">
              {t("nav.logout")}
            </Button>
          </div>
        </motion.div>

        {/* Register Company CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-10 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 shadow-xl shadow-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl md:text-2xl mb-3">Register Your Company</CardTitle>
                  <CardDescription className="text-base md:text-sm leading-relaxed">
                    Add your company to HRMarket and connect with top HR talent. Showcase your brand and attract the
                    best professionals in the industry.
                  </CardDescription>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-red shadow-lg shadow-primary/20">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild size="lg" className="gap-2 h-12 px-8 shadow-lg shadow-primary/20">
                <Link href="/dashboard/company/register">
                  <Plus className="h-5 w-5" />
                  Register Company
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-10"
        >
          <h2 className="mb-6 text-2xl font-bold">Your Activity</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <motion.div variants={itemVariants}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Applications</CardTitle>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-primary">0</div>
                    <p className="text-sm text-muted-foreground mt-1">Active applications</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Events</CardTitle>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-primary">0</div>
                    <p className="text-sm text-muted-foreground mt-1">Registered events</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Connections</CardTitle>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-primary">0</div>
                    <p className="text-sm text-muted-foreground mt-1">Network connections</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={itemVariants}>
              <Link href="/talks">
                <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                  <CardHeader className="pb-3">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-gradient-red group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <FileText className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">HR Talks</CardTitle>
                    <CardDescription className="text-sm">Read latest articles and insights</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/events">
                <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                  <CardHeader className="pb-3">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-gradient-red group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <Calendar className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Events</CardTitle>
                    <CardDescription className="text-sm">Browse and register for events</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/jobs">
                <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                  <CardHeader className="pb-3">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-gradient-red group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <Briefcase className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Jobs</CardTitle>
                    <CardDescription className="text-sm">Find HR opportunities</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/companies">
                <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                  <CardHeader className="pb-3">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-gradient-red group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <Building2 className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Companies</CardTitle>
                    <CardDescription className="text-sm">Explore top HR companies</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
