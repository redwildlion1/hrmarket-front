"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { apiClient } from "@/lib/api/client"
import type { FirmDetailsForEditingDto } from "@/lib/api/firms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  HelpCircle,
  ImageIcon,
  Plus,
  Briefcase,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Badge } from "@/components/ui/badge"

function FirmManageContent() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [firm, setFirm] = useState<FirmDetailsForEditingDto | null>(null)

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
      const data = await apiClient.firm.getMyFirm()
      setFirm(data)
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

  const getTranslation = (translations: Array<{ languageCode: string; [key: string]: any }>) => {
    return translations.find((t) => t.languageCode === language) || translations[0]
  }

  const getCoverImage = () => {
    return firm?.media?.find((m) => m.type === "cover")?.url
  }

  const getLogoImage = () => {
    return firm?.media?.find((m) => m.type === "logo")?.url
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

      {/* Header with Cover and Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-2 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
            {getCoverImage() ? (
              <img src={getCoverImage() || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Button size="sm" variant="secondary" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("common.addImage")}
              </Button>
            </div>
            {getLogoImage() && (
              <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                <img src={getLogoImage() || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="pt-16 pb-4" />
        </Card>
      </motion.div>

      {/* Subscription & Resources - Compact */}
      {firm.subscriptionStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-semibold">
                    {getTranslation(firm.subscriptionStatus.planTranslations).name}
                  </p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {firm.subscriptionStatus.isYearly ? "Yearly" : "Monthly"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Posts</p>
                  <p className="text-2xl font-bold">{firm.availableResources.totalAvailableJobPosts}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{firm.availableResources.totalAvailableCategories}</p>
                    <Button size="sm" className="gap-1 h-auto py-1">
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Events</p>
                  <p className="text-2xl font-bold">{firm.availableResources.totalAvailableEvents}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Basic Info & Contact - Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("firm.basicInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CUI</p>
                <p className="text-base">{firm.cui}</p>
              </div>
              {firm.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("firm.description")}</p>
                  <p className="text-base text-muted-foreground line-clamp-3">{firm.description}</p>
                </div>
              )}
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
                <Mail className="h-5 w-5 text-primary" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {firm.contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${firm.contact.email}`} className="text-base hover:text-primary transition-colors">
                    {firm.contact.email}
                  </a>
                </div>
              )}
              {firm.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`tel:${firm.contact.phone}`} className="text-base hover:text-primary transition-colors">
                    {firm.contact.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Social Links */}
      {(firm.links?.website ||
        firm.links?.linkedin ||
        firm.links?.facebook ||
        firm.links?.twitter ||
        firm.links?.instagram) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {firm.links?.website && (
                  <a
                    href={firm.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {firm.links?.linkedin && (
                  <a
                    href={firm.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {firm.links?.facebook && (
                  <a
                    href={firm.links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </a>
                )}
                {firm.links?.twitter && (
                  <a
                    href={firm.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
                {firm.links?.instagram && (
                  <a
                    href={firm.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Universal Answers */}
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
              <CardDescription>Your answers to universal questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {firm.universalAnswers
                  .sort((a, b) => a.order - b.order)
                  .map((answer) => {
                    const question = answer.universalQuestion
                    const questionText = getTranslation(question?.translations || [])
                    const selectedOption = question?.options?.find((opt) => opt.id === answer.selectedOptionId)
                    const answerText = getTranslation(selectedOption?.translations || [])

                    return (
                      <div key={answer.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          {question?.icon && LucideIcons[question.icon as keyof typeof LucideIcons] ? (
                            React.createElement((LucideIcons as any)[question.icon], {
                              className: "h-5 w-5 text-primary flex-shrink-0 mt-0.5",
                            })
                          ) : (
                            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{questionText.name}</p>
                            <Badge variant="secondary" className="mt-2">
                              {answerText.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Forms */}
      {firm.forms && firm.forms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Category Information
              </CardTitle>
              <CardDescription>Your answers to category-specific questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {firm.forms.map((form) => (
                <div key={form.categoryId} className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">{form.categoryId}</h3>
                  <div className="space-y-4">
                    {form.questionsWithAnswers
                      .filter((qa) => qa.categoryAnswer) // Only show answered questions
                      .map((qa) => {
                        const question = qa.categoryQuestion
                        const questionText = getTranslation(question.translations)
                        const answer = qa.categoryAnswer
                        const answerText = answer ? getTranslation(answer.translations) : null

                        return (
                          <div key={question.id} className="space-y-1">
                            <p className="text-sm font-medium">{questionText.text}</p>
                            {answerText && (
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{answerText.text}</p>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
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
