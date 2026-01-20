"use client"

import React, { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
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
  Briefcase,
  CalendarPlus,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/api/admin"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FirmDetailsForEditingDto, FirmRejectionReasonType } from "@/lib/types/admin"
import Link from "next/link"

export default function VerifyFirmDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { loading: authLoading } = useAuth()
  const { id } = use(params)

  const [firm, setFirm] = useState<FirmDetailsForEditingDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"approved" | "rejected">("approved")
  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined)
  const [rejectionNote, setRejectionNote] = useState("")

  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(firm?.location?.countryId || "")
  const { data: cities = [] } = useCities(firm?.location?.countyId || "")

  useEffect(() => {
    loadFirm()
  }, [id])

  const loadFirm = async () => {
    try {
      const data = await adminApi.getFirmForReview(id)
      setFirm(data)
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("firm.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = (status: "approved" | "rejected") => {
    setVerificationStatus(status)
    setRejectionReason(undefined)
    setRejectionNote("")
    setIsDialogOpen(true)
  }

  const handleSubmitVerification = async () => {
    if (!firm) return

    try {
      await adminApi.verifyFirm({
        firmId: firm.id,
        status: verificationStatus,
        rejectionReason: verificationStatus === "rejected" ? rejectionReason : undefined,
        rejectionNote: verificationStatus === "rejected" ? rejectionNote : undefined,
      })
      toast({ title: t("admin.verifySuccess") })
      setIsDialogOpen(false)
      router.push("/admin/verify-firms")
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("firm.submitError"),
        variant: "destructive",
      })
    }
  }

  const getLocationNames = () => {
    if (!firm || !firm.location) return { country: "", county: "", city: "" }

    const country = countries.find((c: any) => c.id === firm.location.countryId)
    const county = counties.find((c: any) => c.id === firm.location.countyId)
    const city = cities.find((c: any) => c.id === firm.location.cityId)

    return {
      country: country?.name || "",
      county: county?.name || "",
      city: city?.name || "",
    }
  }

  const locationNames = getLocationNames()

  const getTranslation = (
    translations: Array<{ languageCode: string; [key: string]: any }>,
    field: string = "name",
  ) => {
    const item =
      translations.find((t) => t.languageCode === language) ||
      translations.find((t) => t.languageCode === "en") ||
      translations[0]
    return item ? item[field] : ""
  }

  const getLogoImage = () => {
    return firm?.logoUrl || "/placeholder.svg"
  }

  const getBannerImage = () => {
    return firm?.bannerUrl
  }

  const getStatusBadge = (status: string | number) => {
    let statusKey = String(status)
    
    if (typeof status === 'number') {
        switch (status) {
            case 0: statusKey = "Draft"; break;
            case 1: statusKey = "AwaitingReview"; break;
            case 2: statusKey = "Approved"; break;
            case 3: statusKey = "Rejected"; break;
            case 4: statusKey = "Suspended"; break;
            case 5: statusKey = "Trusted"; break;
            default: statusKey = String(status);
        }
    }

    switch (statusKey) {
      case "Draft":
        return null
      case "AwaitingReview":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex-shrink-0">
            <Clock className="w-3 h-3 mr-1" />
            {t("firm.status.awaitingReview") || "Awaiting Review"}
          </Badge>
        )
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex-shrink-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t("firm.status.approved") || "Approved"}
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex-shrink-0">
            <XCircle className="w-3 h-3 mr-1" />
            {t("firm.status.rejected") || "Rejected"}
          </Badge>
        )
      case "Suspended":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 flex-shrink-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t("firm.status.suspended") || "Suspended"}
          </Badge>
        )
      case "Trusted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {t("firm.status.trusted") || "Trusted"}
          </Badge>
        )
      default:
        return <Badge variant="outline" className="flex-shrink-0">{statusKey}</Badge>
    }
  }

  const isSevereRejection = (reason: string | undefined) => {
    if (!reason) return false
    const reasonType = Number(reason)
    return (
      reasonType === FirmRejectionReasonType.InappropriateContent ||
      reasonType === FirmRejectionReasonType.FalseInformation ||
      reasonType === FirmRejectionReasonType.ViolatesTerms
    )
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
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 space-y-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin/verify-firms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>
      </div>

      {/* Banner Section */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden group bg-gray-100">
        {getBannerImage() ? (
          <img
            src={getBannerImage()}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Camera className="h-12 w-12 opacity-20" />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start -mt-16 px-6 relative z-10 gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full bg-white shadow-lg overflow-hidden flex-shrink-0 border-4 border-white"
            >
              <img
                src={getLogoImage()}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 text-center md:text-left mb-4 md:mb-0"
          >
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm bg-white/80 px-2 rounded-md inline-block backdrop-blur-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {firm.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 justify-center md:justify-start">
                <p className="text-muted-foreground text-lg">{firm.description || t("firm.manageSubtitle")}</p>
            </div>
            
            <div className="pt-2 flex items-center gap-2 justify-center md:justify-start">
                {getStatusBadge(firm.status)}
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-start gap-2 mt-4 md:mt-16">
            <Button
                size="sm"
                variant="default"
                onClick={() => handleVerify("approved")}
                className="gap-2"
            >
                <CheckCircle className="h-4 w-4" />
                {t("common.yes")}
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => handleVerify("rejected")}
                className="gap-2"
            >
                <XCircle className="h-4 w-4" />
                {t("common.no")}
            </Button>
        </div>
      </div>

      {/* Subscription Status */}
      {firm.subscriptionStatus ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle>{t("firm.yourSubscription")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("firm.plan")}</p>
                  <p className="text-lg font-semibold">
                    {getTranslation(firm.subscriptionStatus.planTranslations, "name")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("firm.status")}
                  </p>
                  <Badge variant={firm.subscriptionStatus.status === "Active" ? "default" : "secondary"}>
                    {firm.subscriptionStatus.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("firm.renewsOn")}
                  </p>
                  <p className="text-sm">{new Date(firm.subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("firm.billing")}
                  </p>
                  <p className="text-sm font-semibold">
                    {firm.subscriptionStatus.currentPrice} {firm.subscriptionStatus.currency} /{" "}
                    {firm.subscriptionStatus.isYearly ? t("partner.yearly") : t("partner.monthly")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t("firm.noSubscription")}</h3>
                <p className="text-sm text-muted-foreground">{t("firm.noSubscriptionDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Basic Info, Contact & Location - Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("firm.basicInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("firm.cui")}</p>
                <p className="text-base">{firm.cui}</p>
              </div>
              {firm.type && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("firm.type")}</p>
                  <p className="text-base">
                    {firm.type}
                  </p>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {t("nav.contact")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {firm.contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{t("firm.contactEmail")}</span>
                      <a href={`mailto:${firm.contact.email}`} className="text-base hover:text-primary transition-colors">
                        {firm.contact.email}
                      </a>
                  </div>
                </div>
              )}
              {firm.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{t("firm.contactPhone")}</span>
                      <a href={`tel:${firm.contact.phone}`} className="text-base hover:text-primary transition-colors">
                        {firm.contact.phone}
                      </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t("firm.location")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <p className="text-base">{firm.location.address}</p>
              <p className="text-sm text-muted-foreground">
                {locationNames?.city}, {locationNames?.county}, {locationNames?.country}
              </p>
              <p className="text-sm text-muted-foreground">{firm.location.postalCode}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t("firm.socialLinks")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4">
              {firm.links?.website && (
                <a
                  href={firm.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  {t("firm.website")}
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
              {!firm.links?.website &&
                !firm.links?.linkedin &&
                !firm.links?.facebook &&
                !firm.links?.twitter &&
                !firm.links?.instagram && <p className="text-muted-foreground text-sm">{t("firm.noLinks")}</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Universal Answers */}
      {firm.universalAnswers && firm.universalAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {t("firm.companyProfile")}
                </CardTitle>
                <CardDescription>{t("firm.universalAnswers")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {firm.universalAnswers
                  .sort((a, b) => a.order - b.order)
                  .map((answer) => {
                    const question = answer.universalQuestion
                    const questionText = getTranslation(question?.translations || [], "title")
                    const selectedOption = question?.options?.find((opt) => opt.id === answer.selectedOptionId)
                    const answerText = getTranslation(selectedOption?.translations || [], "label")

                    let IconComponent: any = HelpCircle
                    if (question?.icon) {
                      const pascalName = question.icon
                        .split("-")
                        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join("")
                      if ((LucideIcons as any)[pascalName]) {
                        IconComponent = (LucideIcons as any)[pascalName]
                      } else if ((LucideIcons as any)[question.icon]) {
                        IconComponent = (LucideIcons as any)[question.icon]
                      }
                    }

                    return (
                      <div key={answer.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <IconComponent className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{questionText}</p>
                            <Badge variant="secondary" className="mt-2">
                              {answerText || t("firm.noAnswer")}
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
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                {t("firm.categoryInformation")}
              </CardTitle>
              <CardDescription>{t("firm.categoryAnswers")}</CardDescription>
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
                        const questionText = getTranslation(question.translations, "title")
                        const answer = qa.categoryAnswer
                        
                        // Handle different answer types
                        let answerText = null
                        if (answer) {
                            if (answer.value) {
                                answerText = answer.value
                            } else if (answer.translations && answer.translations.length > 0) {
                                answerText = getTranslation(answer.translations, "text")
                            } else if (question.options && answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
                                // For select/multi-select, we need to find the option labels
                                const selectedLabels = answer.selectedOptionIds.map(optId => {
                                    const option = question.options?.find(o => o.id === optId)
                                    return option ? getTranslation(option.translations, "label") : null
                                }).filter(Boolean)
                                
                                if (selectedLabels.length > 0) {
                                    answerText = selectedLabels.join(", ")
                                }
                            }
                        }

                        return (
                          <div key={question.id} className="space-y-1">
                            <p className="text-sm font-medium">{questionText}</p>
                            {answerText && (
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{answerText}</p>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {verificationStatus === "approved" ? t("firm.status.approved") : t("firm.status.rejected")}
            </DialogTitle>
            <DialogDescription>
              {firm.name} - {firm.cui}
            </DialogDescription>
          </DialogHeader>
          {verificationStatus === "rejected" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">{t("firm.rejectionReason")}</Label>
                <Select onValueChange={setRejectionReason} value={rejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("firm.selectRejectionReason")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FirmRejectionReasonType)
                      .filter(([key]) => isNaN(Number(key)))
                      .map(([key, value]) => (
                        <SelectItem key={value} value={String(value)}>
                          {isSevereRejection(String(value)) && (
                            <span className="mr-2 text-red-500 font-bold">!</span>
                          )}
                          {t(`enums.firmRejectionReasonType.${key}` as any)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isSevereRejection(rejectionReason) && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{t("firm.rejectionWarning")}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="rejectionNote">{t("contact.message")}</Label>
                <Textarea
                  id="rejectionNote"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder={t("firm.answerPlaceholder")}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmitVerification}
              variant={verificationStatus === "approved" ? "default" : "destructive"}
            >
              {t("common.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
