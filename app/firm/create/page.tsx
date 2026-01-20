"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/lib/errors/form-input"
import { ErrorAlert } from "@/components/errors/error-alert"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Info, HelpCircle, AlertCircle } from "lucide-react"
import { useCreateFirm, useFirmTypes } from "@/lib/hooks/use-firms"
import { useUniversalQuestions } from "@/lib/hooks/use-categories"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"

type UniversalQuestionAnswer = {
  universalQuestionId: string
  selectedOptionId: string
}

type UniversalQuestion = {
  id: string
  order: number
  isRequired: boolean
  translations: Array<{
    languageCode: string
    title: string
    display: string
    description: string | null
    placeholder: string | null
  }>
  options: Array<{
    id: string
    value: string
    order: number
    translations: Array<{
      languageCode: string
      label: string
      display: string
      description: string | null
    }>
  }>
}

const STORAGE_KEY = "firm_create_form_data"

function CreateFirmForm() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, updateUserInfo } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  const { setError, clearError, apiError } = useFormErrors()

  const [formData, setFormData] = useState({
    cui: "",
    name: "",
    type: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    linksWebsite: "",
    linksLinkedIn: "",
    linksFacebook: "",
    linksTwitter: "",
    linksInstagram: "",
    locationCountryId: "",
    locationCountyId: "",
    locationCityId: "",
    locationAddress: "",
    locationPostalCode: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({})

  // React Query Hooks
  const { data: firmTypesData } = useFirmTypes()
  const { data: universalQuestionsData } = useUniversalQuestions()
  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(formData.locationCountryId)
  const { data: cities = [] } = useCities(formData.locationCountyId)
  const createFirm = useCreateFirm()

  const universalQuestions = universalQuestionsData?.questions ? universalQuestionsData.questions.sort((a: any, b: any) => a.order - b.order) : []

  const fieldNameMap: Record<string, string> = {
    cui: "cui",
    name: "name",
    type: "type",
    description: "description",
    "contact.email": "contactEmail",
    "contact.phone": "contactPhone",
    "links.website": "linksWebsite",
    "links.linkedIn": "linksLinkedIn",
    "links.facebook": "linksFacebook",
    "links.twitter": "linksTwitter",
    "links.instagram": "linksInstagram",
    "location.countryId": "locationCountryId",
    "location.countyId": "locationCountyId",
    "location.cityId": "locationCityId",
    "location.address": "locationAddress",
    "location.postalCode": "locationPostalCode",
  }

  // Map fields to steps
  const fieldStepMap: Record<string, number> = {
    cui: 1,
    name: 1,
    type: 1,
    description: 1,
    contactEmail: 2,
    contactPhone: 2,
    linksWebsite: 2,
    linksLinkedIn: 2,
    linksFacebook: 2,
    linksTwitter: 2,
    linksInstagram: 2,
    locationCountryId: 3,
    locationCountyId: 3,
    locationCityId: 3,
    locationAddress: 3,
    locationPostalCode: 3,
  }

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.formData) {
          setFormData(prev => ({ ...prev, ...parsed.formData }))
        }
        if (parsed.step) {
          setStep(parsed.step)
        }
        if (parsed.questionAnswers) {
          setQuestionAnswers(parsed.questionAnswers)
        }
      } catch (error) {
        console.error("Failed to parse saved form data", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save data
  useEffect(() => {
    if (isLoaded) {
      const dataToSave = {
        formData,
        step,
        questionAnswers
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [formData, step, questionAnswers, isLoaded])

  useEffect(() => {
    // Only pre-fill email if not already set (either from saved data or user input)
    if (userInfo?.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: userInfo.email }))
    }
  }, [userInfo, formData.contactEmail])

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      locationCountryId: value,
      locationCountyId: "",
      locationCityId: "",
    })
  }

  const handleCountyChange = (value: string) => {
    setFormData({ ...formData, locationCountyId: value, locationCityId: "" })
  }

  const firmTypes = firmTypesData ? (language === "en" ? firmTypesData.en : firmTypesData.ro) : []

  const getQuestionTranslation = (question: UniversalQuestion) => {
    return question.translations.find((t) => t.languageCode === language) || question.translations[0]
  }

  const getOptionTranslation = (option: UniversalQuestion["options"][0]) => {
    return option.translations.find((t) => t.languageCode === language) || option.translations[0]
  }

  const handleSubmit = async () => {
    console.log("[v0] handleSubmit called, step:", step)
    if (!validateStep(step)) {
      console.log("[v0] validateStep failed for step:", step)
      return
    }

    setIsSubmitting(true)
    setValidationErrors({})
    setStepErrors({})
    clearError()
    console.log("[v0] Starting form submission")

    const universalQuestionAnswers = Object.entries(questionAnswers).map(([questionId, optionId]) => ({
      universalQuestionId: questionId,
      selectedOptionId: optionId,
    }))

    const submitData = {
      cui: formData.cui,
      name: formData.name,
      type: formData.type, // Send as string, not object
      description: formData.description,
      contact: {
        email: formData.contactEmail,
        phone: formData.contactPhone || null,
      },
      links: {
        website: formData.linksWebsite || null,
        linkedIn: formData.linksLinkedIn || null,
        facebook: formData.linksFacebook || null,
        twitter: formData.linksTwitter || null,
        instagram: formData.linksInstagram || null,
      },
      location: {
        countryId: formData.locationCountryId,
        countyId: formData.locationCountyId,
        cityId: formData.locationCityId,
        address: formData.locationAddress || null,
        postalCode: formData.locationPostalCode || null,
      },
      universalQuestionAnswers,
    }

    createFirm.mutate(submitData, {
        onSuccess: (response: any) => {
            if (response.firmId && response.firmName) {
                console.log("[v0] Updating user info with firm data", {
                  firmId: response.firmId,
                  firmName: response.firmName,
                })
                updateUserInfo({
                  firmId: response.firmId,
                  firmName: response.firmName,
                })
            }
        
            localStorage.removeItem(STORAGE_KEY)
            toast({
                title: t("common.success"),
                description: t("firm.createSuccess"),
            })
        
            console.log("[v0] Redirecting to /firm/manage")
            router.push("/firm/manage")
        },
        onError: (error: any) => {
            console.log("[v0] Error creating firm", { error, errorType: typeof error, errorKeys: Object.keys(error || {}) })
            setIsSubmitting(false)
            setError(error)

            if (error.validationErrors) {
                console.log("[v0] Handling validation errors:", error.validationErrors)
                const newValidationErrors: Record<string, string> = {}
                const newStepErrors: Record<number, boolean> = {}
        
                Object.entries(error.validationErrors).forEach(([field, messages]) => {
                  let frontendField = field
                  const normalizedField = field.charAt(0).toLowerCase() + field.slice(1)
                  
                  if (fieldNameMap[normalizedField]) {
                    frontendField = fieldNameMap[normalizedField]
                  } else {
                     const parts = normalizedField.split('.')
                     if (parts.length > 1) {
                        if (parts[0] === 'contact' && parts[1] === 'email') frontendField = 'contactEmail'
                        else if (parts[0] === 'contact' && parts[1] === 'phone') frontendField = 'contactPhone'
                        else if (parts[0] === 'links' && parts[1] === 'website') frontendField = 'linksWebsite'
                     }
                  }
        
                  const message = Array.isArray(messages) ? messages[0] : (messages as string)
                  newValidationErrors[frontendField] = message
        
                  const stepNumber = fieldStepMap[frontendField]
                  if (stepNumber) {
                    newStepErrors[stepNumber] = true
                  }
                })
        
                setValidationErrors(newValidationErrors)
                setStepErrors(newStepErrors)
        
                const firstErrorStep = Object.keys(newStepErrors).map(Number).sort((a, b) => a - b)[0]
                if (firstErrorStep) {
                  setStep(firstErrorStep)
                }
        
                toast({
                  title: t("firm.validationErrors"),
                  description: t("firm.validationErrorDesc"),
                  variant: "destructive",
                })
            } else if (error.detail) {
                toast({
                    title: t("common.error"),
                    description: error.detail,
                    variant: "destructive",
                })
            } else {
                console.log("[v0] Showing generic error toast")
                toast({
                  title: t("common.error"),
                  description: error.message || t("firm.createError"),
                  variant: "destructive",
                })
            }
        }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log("[v0] handleKeyDown", { key: e.key, step })
    if (e.key === "Enter" && step !== 5) {
      console.log("[v0] Enter pressed on non-review step, preventing default")
      e.preventDefault()
      if (canProceed()) {
        console.log("[v0] Moving to next step")
        nextStep()
      }
    }
  }

  const nextStep = () => {
    console.log("[v0] nextStep called", { currentStep: step })
    if (step < 5) setStep(step + 1)
  }

  const prevStep = () => {
    console.log("[v0] prevStep called", { currentStep: step })
    if (step > 1) setStep(step - 1)
  }

  const validateEmail = (email: string): string => {
    if (!email) return ""
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? "" : t("firm.validation.invalidEmail")
  }

  const validatePhone = (phone: string): string => {
    if (!phone) return ""
    const phoneRegex = /^[\d\s+\-$$$$]+$/
    if (!phoneRegex.test(phone)) {
      return t("firm.validation.invalidPhone")
    }
    const digits = phone.replace(/\D/g, "")
    return digits.length >= 9 ? "" : t("firm.validation.invalidPhone")
  }

  const validateUrl = (url: string): string => {
    if (!url) return ""
    try {
      new URL(url)
      return ""
    } catch {
      return t("firm.validation.invalidUrl")
    }
  }

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, contactEmail: value })
    const error = validateEmail(value)
    console.log("[v0] Email validation - value:", value, "error:", error)
    setValidationErrors((prev) => ({ ...prev, contactEmail: error }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, contactPhone: value })
    const error = validatePhone(value)
    console.log("[v0] Phone validation - value:", value, "error:", error)
    setValidationErrors((prev) => ({ ...prev, contactPhone: error }))
  }

  const handleWebsiteChange = (value: string) => {
    setFormData({ ...formData, linksWebsite: value })
    const error = validateUrl(value)
    setValidationErrors((prev) => ({ ...prev, linksWebsite: error }))
  }

  const handleLinkedInChange = (value: string) => {
    setFormData({ ...formData, linksLinkedIn: value })
    const error = validateUrl(value)
    setValidationErrors((prev) => ({ ...prev, linksLinkedIn: error }))
  }

  const handleFacebookChange = (value: string) => {
    setFormData({ ...formData, linksFacebook: value })
    const error = validateUrl(value)
    setValidationErrors((prev) => ({ ...prev, linksFacebook: error }))
  }

  const handleTwitterChange = (value: string) => {
    setFormData({ ...formData, linksTwitter: value })
    const error = validateUrl(value)
    setValidationErrors((prev) => ({ ...prev, linksTwitter: error }))
  }

  const handleInstagramChange = (value: string) => {
    setFormData({ ...formData, linksInstagram: value })
    const error = validateUrl(value)
    setValidationErrors((prev) => ({ ...prev, linksInstagram: error }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        const step1Valid =
          formData.cui.trim() !== "" &&
          formData.name.trim() !== "" &&
          formData.type !== "" &&
          !validationErrors.cui &&
          !validationErrors.name &&
          !validationErrors.type
        return step1Valid
      case 2:
        const emailValid = formData.contactEmail && !validationErrors.contactEmail
        const phoneValid = !formData.contactPhone || !validationErrors.contactPhone
        const websiteValid = !formData.linksWebsite || !validationErrors.linksWebsite
        const linkedInValid = !formData.linksLinkedIn || !validationErrors.linksLinkedIn
        const facebookValid = !formData.linksFacebook || !validationErrors.linksFacebook
        const twitterValid = !formData.linksTwitter || !validationErrors.linksTwitter
        const instagramValid = !formData.linksInstagram || !validationErrors.linksInstagram
        return (
          emailValid && phoneValid && websiteValid && linkedInValid && facebookValid && twitterValid && instagramValid
        )
      case 3:
        const step3Valid =
          formData.locationCountryId !== "" &&
          formData.locationCountyId !== "" &&
          formData.locationCityId !== "" &&
          !validationErrors.locationCountryId &&
          !validationErrors.locationCountyId &&
          !validationErrors.locationCityId
        return step3Valid
      case 4:
        const requiredQuestions = universalQuestions.filter((q: any) => q.isRequired)
        return requiredQuestions.every((q: any) => questionAnswers[q.id] && questionAnswers[q.id].trim() !== "")
      case 5:
        return true
      default:
        return false
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        const step1Valid =
          ensureString(formData.cui).trim() !== "" &&
          ensureString(formData.name).trim() !== "" &&
          formData.type !== "" &&
          !validationErrors.cui &&
          !validationErrors.name &&
          !validationErrors.type
        return step1Valid
      case 2:
        const emailValid = formData.contactEmail && !validationErrors.contactEmail
        const phoneValid = !formData.contactPhone || !validationErrors.contactPhone
        const websiteValid = !formData.linksWebsite || !validationErrors.linksWebsite
        const linkedInValid = !formData.linksLinkedIn || !validationErrors.linksLinkedIn
        const facebookValid = !formData.linksFacebook || !validationErrors.linksFacebook
        const twitterValid = !formData.linksTwitter || !validationErrors.linksTwitter
        const instagramValid = !formData.linksInstagram || !validationErrors.linksInstagram
        return (
          emailValid && phoneValid && websiteValid && linkedInValid && facebookValid && twitterValid && instagramValid
        )
      case 3:
        const step3Valid =
          formData.locationCountryId !== "" &&
          formData.locationCountyId !== "" &&
          formData.locationCityId !== "" &&
          !validationErrors.locationCountryId &&
          !validationErrors.locationCountyId &&
          !validationErrors.locationCityId
        return step3Valid
      case 4:
        const requiredQuestions = universalQuestions.filter((q: any) => q.isRequired)
        return requiredQuestions.every((q: any) => questionAnswers[q.id] && questionAnswers[q.id].trim() !== "")
      case 5:
        return true
      default:
        return false
    }
  }

  const ensureString = (value: any): string => {
    if (typeof value === "string") return value
    if (value === null || value === undefined) return ""
    return String(value)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior
    e.stopPropagation()
    console.log("[v0] Form submitted via handleFormSubmit")
    await handleSubmit()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-3xl border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t("firm.createTitle")}
              </CardTitle>
              <CardDescription className="text-base mt-2">{t("firm.createSubtitle")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-10 rounded-full transition-all flex items-center justify-center ${
                    s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-gray-200"
                  } ${stepErrors[s] ? "bg-destructive" : ""}`}
                >
                  {stepErrors[s] && <AlertCircle className="h-3 w-3 text-white" />}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
          <CardContent className="space-y-6">
            {apiError && !apiError.isValidationError && <ErrorAlert />}
            {Object.keys(stepErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("firm.validationErrorDesc")}
                </AlertDescription>
              </Alert>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step1Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step1Desc")}</p>
                    </div>
                  </div>

                  <FormInput
                    id="cui"
                    label={t("firm.cui")}
                    value={formData.cui}
                    onChange={(e) => {
                      setFormData({ ...formData, cui: e.target.value })
                      setValidationErrors((prev) => ({ ...prev, cui: "" }))
                    }}
                    placeholder={t("firm.cuiPlaceholder")}
                    required
                    // error={validationErrors.cui} // FormInput handles errors via context now
                  />
                  <FormInput
                    id="name"
                    label={t("firm.name")}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setValidationErrors((prev) => ({ ...prev, name: "" }))
                    }}
                    placeholder={t("firm.namePlaceholder")}
                    required
                    // error={validationErrors.name}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("firm.type")}</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("firm.selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {firmTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("firm.description")}</Label>
                    <Textarea
                      id="description"
                      placeholder={t("firm.descriptionPlaceholder")}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value })
                        setValidationErrors((prev) => ({ ...prev, description: "" }))
                      }}
                      rows={4}
                      // error={validationErrors.description}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step2Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step2Desc")}</p>
                    </div>
                  </div>

                  <FormInput
                    id="contactEmail"
                    label={t("firm.contactEmail")}
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                    disabled={createFirm.isPending}
                    // error={validationErrors.contactEmail}
                  />

                  <FormInput
                    id="contactPhone"
                    label={t("firm.contactPhone")}
                    type="tel"
                    placeholder="+40 123 456 789"
                    value={formData.contactPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    disabled={createFirm.isPending}
                    // error={validationErrors.contactPhone}
                  />

                  <FormInput
                    id="linksWebsite"
                    label={t("firm.website")}
                    type="url"
                    placeholder="https://company.com"
                    value={formData.linksWebsite}
                    onChange={(e) => handleWebsiteChange(e.target.value)}
                    disabled={createFirm.isPending}
                    // error={validationErrors.linksWebsite}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      id="linksLinkedIn"
                      label="LinkedIn"
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.linksLinkedIn}
                      onChange={(e) => handleLinkedInChange(e.target.value)}
                      disabled={createFirm.isPending}
                      // error={validationErrors.linksLinkedIn}
                    />

                    <FormInput
                      id="linksFacebook"
                      label="Facebook"
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={formData.linksFacebook}
                      onChange={(e) => handleFacebookChange(e.target.value)}
                      disabled={createFirm.isPending}
                      // error={validationErrors.linksFacebook}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      id="linksTwitter"
                      label="Twitter"
                      type="url"
                      placeholder="https://twitter.com/..."
                      value={formData.linksTwitter}
                      onChange={(e) => handleTwitterChange(e.target.value)}
                      disabled={createFirm.isPending}
                      // error={validationErrors.linksTwitter}
                    />

                    <FormInput
                      id="linksInstagram"
                      label="Instagram"
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={formData.linksInstagram}
                      onChange={(e) => handleInstagramChange(e.target.value)}
                      disabled={createFirm.isPending}
                      // error={validationErrors.linksInstagram}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step3Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step3Desc")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">{t("firm.country")}</Label>
                      <Select
                        value={formData.locationCountryId}
                        onValueChange={(value) => handleCountryChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("firm.selectCountry")} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county">{t("firm.county")}</Label>
                      <Select
                        value={formData.locationCountyId}
                        onValueChange={(value) => handleCountyChange(value)}
                        disabled={!formData.locationCountryId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              formData.locationCountryId ? t("firm.selectCounty") : t("firm.selectCountyFirst")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.map((county: any) => (
                            <SelectItem key={county.id} value={county.id}>
                              {county.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t("firm.city")}</Label>
                      <Select
                        value={formData.locationCityId}
                        onValueChange={(value) => setFormData({ ...formData, locationCityId: value })}
                        disabled={!formData.locationCountyId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={formData.locationCountyId ? t("firm.selectCity") : t("firm.selectCityFirst")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city: any) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <FormInput
                    id="locationAddress"
                    label={t("firm.address")}
                    placeholder={t("firm.addressPlaceholder")}
                    value={formData.locationAddress}
                    onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                    disabled={createFirm.isPending}
                    // error={validationErrors.locationAddress}
                  />

                  <FormInput
                    id="locationPostalCode"
                    label={t("firm.postalCode")}
                    placeholder="012345"
                    value={formData.locationPostalCode}
                    onChange={(e) => setFormData({ ...formData, locationPostalCode: e.target.value })}
                    disabled={createFirm.isPending}
                    // error={validationErrors.locationPostalCode}
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step4Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step4Desc")}</p>
                    </div>
                  </div>

                  {universalQuestions.length === 0 ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{t("firm.noQuestions")}</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-6">
                      {universalQuestions.map((question: any) => {
                        const translation = getQuestionTranslation(question)
                        const hasOptions = question.options.length > 0

                        return (
                          <div key={question.id} className="space-y-2">
                            <Label htmlFor={`question-${question.id}`}>
                              {translation.display}
                              {question.isRequired && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            {translation.description && (
                              <p className="text-sm text-muted-foreground">{translation.description}</p>
                            )}

                            {hasOptions ? (
                              <Select
                                value={questionAnswers[question.id] || ""}
                                onValueChange={(optionId) =>
                                  setQuestionAnswers((prev) => ({ ...prev, [question.id]: optionId }))
                                }
                              >
                                <SelectTrigger id={`question-${question.id}`}>
                                  <SelectValue placeholder={translation.placeholder || t("firm.selectOption")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {question.options
                                    .sort((a: any, b: any) => a.order - b.order)
                                    .map((option: any) => {
                                      const optionTranslation = getOptionTranslation(option)
                                      return (
                                        <SelectItem key={option.id} value={option.id}>
                                          {optionTranslation.display}
                                        </SelectItem>
                                      )
                                    })}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Alert variant="destructive">
                                <AlertDescription>{t("firm.questionMissingOptions")}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step5Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step5Desc")}</p>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{t("firm.reviewNote")}</AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-2">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {t("firm.step3Title")}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">{t("firm.country")}:</span>{" "}
                          {countries.find((c: any) => c.id === formData.locationCountryId)?.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.county")}:</span>{" "}
                          {counties.find((c: any) => c.id === formData.locationCountyId)?.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.city")}:</span>{" "}
                          {cities.find((c: any) => c.id === formData.locationCityId)?.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.address")}:</span> {formData.locationAddress}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.postalCode")}:</span> {formData.locationPostalCode}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">{t("firm.step2Title")}</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">{t("firm.contactEmail")}:</span> {formData.contactEmail}
                        </p>
                        {formData.contactPhone && (
                          <p>
                            <span className="font-medium">{t("firm.contactPhone")}:</span> {formData.contactPhone}
                          </p>
                        )}
                        {formData.linksWebsite && (
                          <p>
                            <span className="font-medium">{t("firm.website")}:</span> {formData.linksWebsite}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">{t("firm.step1Title")}</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">{t("firm.cui")}:</span> {formData.cui}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.name")}:</span> {formData.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.type")}:</span>{" "}
                          {firmTypes.find((t) => t.value === formData.type)?.label}
                        </p>
                      </div>
                    </div>

                    {universalQuestions.length > 0 && Object.keys(questionAnswers).length > 0 && (
                      <div className="rounded-lg border p-4 space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">{t("firm.step4Title")}</h4>
                        <div className="space-y-1 text-sm">
                          {universalQuestions
                            .filter((q: any) => questionAnswers[q.id])
                            .map((question: any) => {
                              const translation = getQuestionTranslation(question)
                              const selectedOptionId = questionAnswers[question.id]

                              const selectedOption = question.options.find((opt: any) => opt.id === selectedOptionId)
                              let displayAnswer = t("firm.noAnswer")

                              if (selectedOption) {
                                const optionTranslation = getOptionTranslation(selectedOption)
                                displayAnswer = optionTranslation.display
                              }

                              return (
                                <p key={question.id}>
                                  <span className="font-medium">{translation.display}:</span> {displayAnswer}
                                </p>
                              )
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <div className="flex items-center justify-between px-6 pb-6 mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={createFirm.isPending}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("common.previous")}
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Next button clicked", { step })
                  nextStep()
                }}
                disabled={!canProceed() || createFirm.isPending}
              >
                {t("common.next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createFirm.isPending || isSubmitting}
                onClick={() => console.log("[v0] Submit button clicked", { step, isSubmitting, loading: createFirm.isPending })}
              >
                {createFirm.isPending ? t("common.loading") : t("common.submit")}
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default function CreateFirmPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-3xl">
        <FormErrorProvider>
          <CreateFirmForm />
        </FormErrorProvider>
      </div>
    </div>
  )
}
