"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { apiClient } from "@/lib/api/client"
import type { FirmDetailsDto } from "@/lib/api/firms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { Building2, MapPin, Mail, Phone, Globe, Linkedin, Facebook, Twitter, Instagram, HelpCircle, ImageIcon } from 'lucide-react'
import * as LucideIcons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function FirmManageContent() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [firm, setFirm] = useState<FirmDetailsDto | null>(null)
  const [locationNames, setLocationNames] = useState<{ country: string; county: string } | null>(null)

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
    setLoading(true)
    try {
      console.log("[v0] Loading firm data for user:", userInfo?.email)
      const data = await apiClient.firm.getMyFirm()
      console.log("[v0] Firm data loaded successfully:", data)
      setFirm(data)

      if (data.locationCountryId && data.locationCountyId) {
        console.log("[v0] Fetching location names for country:", data.locationCountryId, "county:", data.locationCountyId)
        const locationData = await apiClient.location.getLocationSimple(data.locationCountryId, data.locationCountyId)
        console.log("[v0] Location names loaded:", locationData)
        setLocationNames({
          country: locationData.country.name,
          county: locationData.county.name,
        })
      }
    } catch (error: any) {
      console.error("[v0] Error loading firm:", error)
      setError(error)
      toast({
        title: t("common.error"),
        description: t("firm.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || HelpCircle
    return <IconComponent className="h-5 w-5 text-primary" />
  }

  const getTranslation = (translations: { languageCode: string; name: string; description?: string }[]) => {
    return translations.find((t) => t.languageCode === language) || translations[0]
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

  if (!firm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{t("firm.loadError")}</p>
          <Button onClick={loadFirm}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {firm.name}
        </h1>
        <p className="text-muted-foreground text-lg">{t("firm.manageSubtitle")}</p>
      </motion.div>

      {(firm.coverImageUrl || firm.logoUrl) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
              {firm.coverImageUrl ? (
                <img src={firm.coverImageUrl || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {firm.logoUrl && (
                <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  <img src={firm.logoUrl || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="pt-16 pb-4" />
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("firm.basicInfo")}
              </CardTitle>
              <CardDescription>{t("firm.basicInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CUI</p>
                  <p className="text-base">{firm.cui}</p>
                </div>
                {firm.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("firm.description")}</p>
                    <p className="text-base text-muted-foreground">{firm.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact
              </CardTitle>
              <CardDescription>Contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("firm.email")}</p>
                    <a href={`mailto:${firm.contactEmail}`} className="text-base hover:text-primary transition-colors">
                      {firm.contactEmail}
                    </a>
                  </div>
                </div>
                {firm.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("firm.phone")}</p>
                      <a href={`tel:${firm.contactPhone}`} className="text-base hover:text-primary transition-colors">
                        {firm.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t("firm.location")}
              </CardTitle>
              <CardDescription>{t("firm.locationDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationNames && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("firm.country")}</p>
                    <p className="text-base">{locationNames.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("firm.county")}</p>
                    <p className="text-base">{locationNames.county}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("firm.city")}</p>
                <p className="text-base">{firm.locationCity}</p>
              </div>
              {firm.locationAddress && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("firm.address")}</p>
                  <p className="text-base">{firm.locationAddress}</p>
                </div>
              )}
              {firm.locationPostalCode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("firm.postalCode")}</p>
                  <p className="text-base">{firm.locationPostalCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {(firm.linksWebsite ||
          firm.linksLinkedIn ||
          firm.linksFacebook ||
          firm.linksTwitter ||
          firm.linksInstagram) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Social Links
                </CardTitle>
                <CardDescription>Online presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {firm.linksWebsite && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={firm.linksWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:text-primary transition-colors"
                    >
                      {firm.linksWebsite}
                    </a>
                  </div>
                )}
                {firm.linksLinkedIn && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={firm.linksLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:text-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                {firm.linksFacebook && (
                  <div className="flex items-center gap-3">
                    <Facebook className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={firm.linksFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:text-primary transition-colors"
                    >
                      Facebook
                    </a>
                  </div>
                )}
                {firm.linksTwitter && (
                  <div className="flex items-center gap-3">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={firm.linksTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:text-primary transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                )}
                {firm.linksInstagram && (
                  <div className="flex items-center gap-3">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={firm.linksInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {firm.universalAnswers && firm.universalAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Company Profile
              </CardTitle>
              <CardDescription>Additional information about your firm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {firm.universalAnswers.map((answer, index) => {
                  const question = getTranslation(answer.questionDisplayTranslations)
                  const answerText = getTranslation(answer.answerTranslations)

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getIconComponent(answer.icon)}
                        <p className="text-sm font-medium text-muted-foreground">{question.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-base font-normal">
                        {answerText.name}
                      </Badge>
                      {answerText.description && (
                        <p className="text-sm text-muted-foreground">{answerText.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
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
