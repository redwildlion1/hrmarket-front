"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/lib/errors/form-input"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { User, Mail, Building2, ArrowRight } from "lucide-react"

function ProfileContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  const { setError, clearError } = useFormErrors()

  useEffect(() => {
    if (!authLoading && !userInfo) {
      router.push("/login")
      return
    }

    if (userInfo?.hasFirm) {
      router.push("/firm/manage")
      return
    }

    loadProfile()
  }, [authLoading, userInfo])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await apiClient.user.getProfile()
      setProfile(data)
      setFirstName(data.firstName || "")
      setLastName(data.lastName || "")
      setPhone(data.phone || "")
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: t("profile.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    clearError()

    try {
      await apiClient.user.updateProfile({
        firstName,
        lastName,
        phone,
      })

      toast({
        title: t("common.success"),
        description: t("profile.updateSuccess"),
      })

      await loadProfile()
    } catch (error: any) {
      setError(error)
      toast({
        title: t("common.error"),
        description: error.detail || t("profile.updateError"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t("profile.title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("profile.subtitle")}</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("profile.personalInfo")}
              </CardTitle>
              <CardDescription>{t("profile.personalInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <FormInput
                  id="firstName"
                  label={t("profile.firstName")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={saving}
                />

                <FormInput
                  id="lastName"
                  label={t("profile.lastName")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={saving}
                />

                <FormInput
                  id="phone"
                  label={t("profile.phone")}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={saving}
                />

                <Button type="submit" className="w-full group" disabled={saving}>
                  {saving ? t("common.saving") : t("common.save")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {t("profile.accountInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("auth.email")}</p>
                <p className="font-medium">{userInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("profile.accountType")}</p>
                <p className="font-medium">{t("profile.personalAccount")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("profile.registerFirm")}
              </CardTitle>
              <CardDescription>{t("profile.registerFirmDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/firm/create")}
                variant="outline"
                className="w-full border-primary/50 hover:bg-primary hover:text-white group"
              >
                {t("profile.createFirm")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <FormErrorProvider>
      <ProfileContent />
    </FormErrorProvider>
  )
}
