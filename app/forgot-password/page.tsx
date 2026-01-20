"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"
import { Mail, ArrowLeft, LockKeyhole } from "lucide-react"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      toast({
        title: t("common.validationError"),
        description: t("firm.invalidEmail"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await apiClient.auth.forgotPassword(email)
      setSubmitted(true)
      toast({
        title: t("auth.passwordReset.successTitle"),
        description: t("auth.passwordReset.successDesc"),
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        title: t("common.error"),
        description: t("auth.passwordReset.errorDesc"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <LockKeyhole className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("auth.passwordReset.title")}</CardTitle>
              <CardDescription className="text-base">{t("auth.passwordReset.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center space-y-6 py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">{t("auth.passwordReset.successTitle")}</h3>
                    <p className="text-muted-foreground">{t("auth.passwordReset.checkInbox")}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSubmitted(false)}
                  >
                    Try another email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? t("common.loading") : t("auth.passwordReset.submitButton")}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="justify-center border-t pt-6">
              <Link 
                href="/login" 
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("auth.confirmEmail.goToLogin")}
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
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
          className="relative z-10 max-w-lg space-y-8 p-12 text-primary-foreground text-center"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
            <LockKeyhole className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">{t("auth.forgotPassword.title")}</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              {t("auth.forgotPassword.subtitle")}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
