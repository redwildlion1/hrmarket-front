"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const confirmEmail = async () => {
      const userId = searchParams.get("userId")
      const token = searchParams.get("token")

      if (!userId || !token) {
        setStatus("error")
        setErrorMessage(t("auth.confirmEmail.missingParams"))
        return
      }

      try {
        await apiClient.auth.confirmEmail(userId, token)
        setStatus("success")
      } catch (error: any) {
        console.error("[v0] Email confirmation error:", error)
        setStatus("error")
        setErrorMessage(error.detail || error.title || t("auth.confirmEmail.error"))
      }
    }

    confirmEmail()
  }, [searchParams, t])

  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === "error" && <XCircle className="h-16 w-16 text-destructive" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && t("auth.confirmEmail.verifying")}
            {status === "success" && t("auth.confirmEmail.success")}
            {status === "error" && t("auth.confirmEmail.failed")}
          </CardTitle>
          <CardDescription>
            {status === "loading" && t("auth.confirmEmail.verifyingDesc")}
            {status === "success" && t("auth.confirmEmail.successDesc")}
            {status === "error" && (errorMessage || t("auth.confirmEmail.errorDesc"))}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status === "success" && (
            <Button onClick={handleGoToLogin} className="w-full">
              {t("auth.confirmEmail.goToLogin")}
            </Button>
          )}
          {status === "error" && (
            <div className="flex flex-col gap-2">
              <Button onClick={handleGoToLogin} className="w-full">
                {t("auth.confirmEmail.goToLogin")}
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                {t("auth.confirmEmail.goToHome")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
