"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/lib/errors/form-input"
import { ErrorAlert } from "@/components/errors/error-alert"
import { parseApiError } from "@/lib/errors/types"

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { register: registerUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<ReturnType<typeof parseApiError> | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null) // Clear previous errors

    if (password !== confirmPassword) {
      setApiError({
        problemDetails: {
          title: t("auth.error"),
          status: 400,
          timestamp: new Date().toISOString(),
          validationErrors: {
            confirmPassword: [t("auth.passwordMismatch")],
          },
        },
        isValidationError: true,
        isServerError: false,
        isClientError: true,
      })
      return
    }

    if (password.length < 8) {
      setApiError({
        problemDetails: {
          title: t("auth.error"),
          status: 400,
          timestamp: new Date().toISOString(),
          validationErrors: {
            password: ["Password must be at least 8 characters long"],
          },
        },
        isValidationError: true,
        isServerError: false,
        isClientError: true,
      })
      return
    }

    setLoading(true)

    try {
      await registerUser(email, password)

      toast({
        title: t("auth.success"),
        description: "Account created successfully!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      const parsedError = parseApiError(error)
      setApiError(parsedError)

      // Show toast for general errors
      if (!parsedError.isValidationError) {
        toast({
          title: t("auth.error"),
          description: parsedError.problemDetails.detail || parsedError.problemDetails.title,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const clearFieldError = (fieldName: string) => {
    if (!apiError?.problemDetails.validationErrors) return

    const newValidationErrors = { ...apiError.problemDetails.validationErrors }
    delete newValidationErrors[fieldName]

    if (Object.keys(newValidationErrors).length === 0) {
      setApiError(null)
    } else {
      setApiError({
        ...apiError,
        problemDetails: {
          ...apiError.problemDetails,
          validationErrors: newValidationErrors,
        },
      })
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("auth.register")}</CardTitle>
          <CardDescription>{t("auth.registerDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            {apiError && !apiError.isValidationError && (
              <ErrorAlert apiError={apiError} onClose={() => setApiError(null)} />
            )}

            <FormInput
              label={t("auth.email")}
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              apiError={apiError?.problemDetails as any}
              onErrorClear={clearFieldError}
            />

            <FormInput
              label={t("auth.password")}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              apiError={apiError?.problemDetails as any}
              onErrorClear={clearFieldError}
              helperText="Must be at least 8 characters long"
            />

            <FormInput
              label={t("auth.confirmPassword")}
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              apiError={apiError?.problemDetails as any}
              onErrorClear={clearFieldError}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : t("auth.register")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t("auth.loginHere")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
