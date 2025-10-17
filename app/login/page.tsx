"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/lib/errors/form-input"
import { ErrorAlert } from "@/components/errors/error-alert"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { Building2, Briefcase, Calendar, ArrowRight } from "lucide-react"

function LoginForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { setError, clearError, apiError } = useFormErrors()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearError()

    try {
      await login(email, password)

      toast({
        title: t("auth.success"),
        description: t("auth.welcomeBack"),
      })

      router.push("/dashboard")
    } catch (error: any) {
      setError(error)

      if (error.response?.data && !error.response.data.validationErrors) {
        toast({
          title: t("auth.error"),
          description: error.response.data.detail || error.response.data.title,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("auth.login")}
          </CardTitle>
          <CardDescription className="text-base">{t("auth.loginDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {apiError && !apiError.isValidationError && <ErrorAlert />}

            <FormInput
              id="email"
              label={t("auth.email")}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <FormInput
              id="password"
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full group" disabled={loading}>
              {loading ? t("common.loading") : t("auth.login")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link href="/register" className="font-medium text-primary hover:underline transition-colors">
                {t("auth.registerHere")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default function LoginPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Building2,
      title: t("home.features.companies"),
      description: t("home.features.companiesDesc"),
    },
    {
      icon: Briefcase,
      title: t("home.features.jobs"),
      description: t("home.features.jobsDesc"),
    },
    {
      icon: Calendar,
      title: t("home.features.events"),
      description: t("home.features.eventsDesc"),
    },
  ]

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <FormErrorProvider>
            <LoginForm />
          </FormErrorProvider>
        </div>
      </div>

      {/* Visual Side - Hidden on mobile */}
      <div className="relative hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 lg:flex lg:items-center lg:justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-professional-pattern.png')] bg-cover bg-center opacity-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg space-y-8 p-12 text-primary-foreground"
        >
          <div className="space-y-3">
            <h2 className="text-5xl font-bold tracking-tight">{t("home.cta.title")}</h2>
            <p className="text-xl opacity-90">{t("home.hero.subtitle")}</p>
          </div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <feature.icon className="h-6 w-6 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
