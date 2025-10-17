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
import { Users, TrendingUp, Award, ArrowRight, Mail, CheckCircle2 } from "lucide-react"

function RegisterForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { register: registerUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const { setError, clearError, apiError } = useFormErrors()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    console.log("[v0] Registration started")

    if (password !== confirmPassword) {
      setError({
        response: {
          data: {
            title: t("auth.error"),
            status: 400,
            timestamp: new Date().toISOString(),
            validationErrors: {
              confirmPassword: [t("auth.passwordMismatch")],
            },
          },
        },
      })
      return
    }

    if (password.length < 8) {
      setError({
        response: {
          data: {
            title: t("auth.error"),
            status: 400,
            timestamp: new Date().toISOString(),
            validationErrors: {
              password: ["Password must be at least 8 characters long"],
            },
          },
        },
      })
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Calling registerUser with email:", email)
      await registerUser(email, password)
      console.log("[v0] Registration successful, setting success state")

      setRegistrationSuccess(true)

      toast({
        title: t("auth.success"),
        description: t("auth.checkEmail"),
      })
    } catch (error: any) {
      console.log("[v0] Registration error:", error)
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
      console.log("[v0] Registration complete, loading:", false, "success:", registrationSuccess)
    }
  }

  console.log("[v0] Render - registrationSuccess:", registrationSuccess)

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-4 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70"
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("auth.success")}
            </CardTitle>
            <CardDescription className="text-base">{t("auth.checkEmail")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{email}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("auth.checkEmail")}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button onClick={() => router.push("/login")} className="w-full group">
              {t("auth.loginHere")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("auth.register")}
          </CardTitle>
          <CardDescription className="text-base">{t("auth.registerDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
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
              helperText="Must be at least 8 characters long"
            />

            <FormInput
              id="confirmPassword"
              label={t("auth.confirmPassword")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full group" disabled={loading}>
              {loading ? t("common.loading") : t("auth.register")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="font-medium text-primary hover:underline transition-colors">
                {t("auth.loginHere")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default function RegisterPage() {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: Users,
      title: t("home.whyChoose.network"),
      description: t("home.whyChoose.networkDesc"),
    },
    {
      icon: TrendingUp,
      title: t("home.whyChoose.growth"),
      description: t("home.whyChoose.growthDesc"),
    },
    {
      icon: Award,
      title: t("home.whyChoose.recognition"),
      description: t("home.whyChoose.recognitionDesc"),
    },
  ]

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <FormErrorProvider>
            <RegisterForm />
          </FormErrorProvider>
        </div>
      </div>

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
            <p className="text-xl opacity-90">{t("home.cta.subtitle")}</p>
          </div>
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <benefit.icon className="h-6 w-6 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
