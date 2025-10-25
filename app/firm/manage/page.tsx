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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { Building2, MapPin, ArrowRight } from "lucide-react"

function FirmManageContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [firm, setFirm] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")

  const { setError, clearError } = useFormErrors()

  useEffect(() => {
    if (!authLoading && !userInfo) {
      router.push("/login")
      return
    }

    if (!userInfo?.hasFirm || !userInfo?.firmId) {
      router.push("/profile")
      return
    }

    loadFirm()
  }, [authLoading, userInfo])

  const loadFirm = async () => {
    if (!userInfo?.firmId) return

    setLoading(true)
    try {
      const data = await apiClient.firm.getDetails(userInfo.firmId)
      setFirm(data)
      setName(data.name || "")
      setEmail(data.email || "")
      setPhone(data.phone || "")
      setWebsite(data.website || "")
      setDescription(data.description || "")
      setAddress(data.address || "")
      setCity(data.city || "")
      setCountry(data.country || "")
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: t("firm.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInfo?.firmId) return

    setSaving(true)
    clearError()

    try {
      await apiClient.firm.updateDetails(userInfo.firmId, {
        name,
        email,
        phone,
        website,
        description,
        address,
        city,
        country,
      })

      toast({
        title: t("common.success"),
        description: t("firm.updateSuccess"),
      })

      await loadFirm()
    } catch (error: any) {
      setError(error)
      toast({
        title: t("common.error"),
        description: error.detail || t("firm.updateError"),
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
    <div className="container max-w-5xl py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t("firm.manageTitle")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("firm.manageSubtitle")}</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("firm.basicInfo")}
              </CardTitle>
              <CardDescription>{t("firm.basicInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  id="name"
                  label={t("firm.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  required
                />

                <FormInput
                  id="email"
                  label={t("firm.email")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={saving}
                  required
                />

                <FormInput
                  id="phone"
                  label={t("firm.phone")}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={saving}
                />

                <FormInput
                  id="website"
                  label={t("firm.website")}
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={saving}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="description">{t("firm.description")}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  rows={4}
                  className="mt-2"
                  placeholder={t("firm.descriptionPlaceholder")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t("firm.location")}
              </CardTitle>
              <CardDescription>{t("firm.locationDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput
                  id="address"
                  label={t("firm.address")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={saving}
                />

                <FormInput
                  id="city"
                  label={t("firm.city")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={saving}
                />

                <FormInput
                  id="country"
                  label={t("firm.country")}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end"
        >
          <Button type="submit" size="lg" className="group" disabled={saving}>
            {saving ? t("common.saving") : t("common.saveChanges")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </form>
    </div>
  )
}

export default function FirmManagePage() {
  return (
    <FormErrorProvider>
      <FirmManageContent />
    </FormErrorProvider>
  )
}
