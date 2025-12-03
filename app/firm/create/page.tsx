"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { apiClient } from "@/lib/api/client"
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
import { Building2, Mail, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Info, HelpCircle } from "lucide-react"

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

function CreateFirmForm() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, updateUserInfo } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countries, setCountries] = useState<Array<{ id: number; name: string }>>([])
  const [counties, setCounties] = useState<Array<{ id: number; name: string }>>([])
  const [firmTypesData, setFirmTypesData] = useState<{
    ro: Array<{ value: string; label: string; description: string }>
    en: Array<{ value: string; label: string; description: string }>
  } | null>(null)
  const [universalQuestions, setUniversalQuestions] = useState<UniversalQuestion[]>([])
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})

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
    locationAddress: "",
    locationCountryId: 0,
    locationCountyId: 0,
    locationCity: "",
    locationPostalCode: "",
  })

  useEffect(() => {
    const loadUniversalQuestions = async () => {
      try {
        const data = await apiClient.universalQuestions.getAll()
        setUniversalQuestions(data.questions ? data.questions.sort((a, b) => a.order - b.order) : [])
      } catch (error) {
        console.error("Failed to load universal questions:", error)
      }
    }
    loadUniversalQuestions()
  }, [])

  useEffect(() => {
    const loadFirmTypes = async () => {
      try {
        const data = await apiClient.config.getFirmTypes()
        setFirmTypesData(data)
      } catch (error) {
        console.error("Failed to load firm types:", error)
      }
    }
    loadFirmTypes()
  }, [])

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await apiClient.location.getCountries()
        setCountries(data)
      } catch (error) {
        console.error("Failed to load countries:", error)
      }
    }
    loadCountries()
  }, [])

  useEffect(() => {
    const loadCounties = async () => {
      if (formData.locationCountryId > 0) {
        try {
          const data = await apiClient.location.getCounties(formData.locationCountryId)
          setCounties(data)
        } catch (error) {
          console.error("Failed to load counties:", error)
        }
      }
    }
    loadCounties()
  }, [formData.locationCountryId])

  const firmTypes = firmTypesData ? (language === "en" ? firmTypesData.en : firmTypesData.ro) : []

  const getQuestionTranslation = (question: UniversalQuestion) => {
    return question.translations.find((t) => t.languageCode === language) || question.translations[0]
  }

  const getOptionTranslation = (option: UniversalQuestion["options"][0]) => {
    return option.translations.find((t) => t.languageCode === language) || option.translations[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("[v0] handleSubmit called", {
      timestamp: new Date().toISOString(),
      step,
      isSubmitting,
      loading,
      eventType: e.type,
    })

    e.preventDefault()
    e.stopPropagation()

    console.log("[v0] After preventDefault/stopPropagation", { step, isSubmitting })

    if (step !== 5) {
      console.log("[v0] Blocked: Not on step 5", { currentStep: step })
      return
    }

    if (isSubmitting) {
      console.log("[v0] Blocked: Already submitting")
      return
    }

    console.log("[v0] Starting firm creation submission")
    setIsSubmitting(true)
    setLoading(true)
    clearError()

    try {
      const universalQuestionAnswers: UniversalQuestionAnswer[] = Object.entries(questionAnswers).map(
        ([questionId, optionId]) => ({
          universalQuestionId: questionId,
          selectedOptionId: optionId,
        }),
      )

      const submitData = {
        ...formData,
        universalQuestionAnswers,
      }

      console.log("[v0] Calling API to create firm", { submitData })
      const response = await apiClient.firm.create(submitData)
      console.log("[v0] API response received", { response })

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

      toast({
        title: t("common.success"),
        description: t("firm.createSuccess"),
      })

      console.log("[v0] Redirecting to /firm/manage")
      router.push("/firm/manage")
    } catch (error: any) {
      console.log("[v0] Error creating firm", { error })
      setError(error)

      if (error.validationErrors) {
        toast({
          title: t("common.validationError"),
          description: t("firm.validationErrorDesc"),
          variant: "destructive",
        })
      } else {
        toast({
          title: t("common.error"),
          description: error.detail || error.title,
          variant: "destructive",
        })
      }
    } finally {
      console.log("[v0] Submission complete, resetting flags")
      setLoading(false)
      setIsSubmitting(false)
    }
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

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.cui && formData.name && formData.type
      case 2:
        return formData.contactEmail
      case 3:
        return formData.locationCountryId > 0 && formData.locationCountyId > 0 && formData.locationCity
      case 4:
        const requiredQuestions = universalQuestions.filter((q) => q.isRequired)
        return requiredQuestions.every((q) => questionAnswers[q.id] && questionAnswers[q.id].trim() !== "")
      case 5:
        return true
      default:
        return false
    }
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
                  className={`h-2 w-10 rounded-full transition-all ${
                    s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <CardContent className="space-y-6">
            {apiError && !apiError.isValidationError && <ErrorAlert />}
            {apiError && apiError.isValidationError && step === 5 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">{t("firm.validationErrors")}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(apiError.validationErrors || {}).map(([field, errors]) => (
                        <li key={field} className="text-sm">
                          <span className="font-medium">{field}:</span> {errors.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  className="space-y-6"
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
                    placeholder="RO12345678"
                    value={formData.cui}
                    onChange={(e) => setFormData({ ...formData, cui: e.target.value })}
                    required
                    disabled={loading}
                  />

                  <FormInput
                    id="name"
                    label={t("firm.name")}
                    placeholder={t("firm.namePlaceholder")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      disabled={loading}
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
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    disabled={loading}
                  />

                  <FormInput
                    id="contactPhone"
                    label={t("firm.contactPhone")}
                    type="tel"
                    placeholder="+40 123 456 789"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    disabled={loading}
                  />

                  <FormInput
                    id="linksWebsite"
                    label={t("firm.website")}
                    type="url"
                    placeholder="https://company.com"
                    value={formData.linksWebsite}
                    onChange={(e) => setFormData({ ...formData, linksWebsite: e.target.value })}
                    disabled={loading}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      id="linksLinkedIn"
                      label="LinkedIn"
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.linksLinkedIn}
                      onChange={(e) => setFormData({ ...formData, linksLinkedIn: e.target.value })}
                      disabled={loading}
                    />

                    <FormInput
                      id="linksFacebook"
                      label="Facebook"
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={formData.linksFacebook}
                      onChange={(e) => setFormData({ ...formData, linksFacebook: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      id="linksTwitter"
                      label="Twitter"
                      type="url"
                      placeholder="https://twitter.com/..."
                      value={formData.linksTwitter}
                      onChange={(e) => setFormData({ ...formData, linksTwitter: e.target.value })}
                      disabled={loading}
                    />

                    <FormInput
                      id="linksInstagram"
                      label="Instagram"
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={formData.linksInstagram}
                      onChange={(e) => setFormData({ ...formData, linksInstagram: e.target.value })}
                      disabled={loading}
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

                  <div className="space-y-2">
                    <Label htmlFor="country">{t("firm.country")}</Label>
                    <Select
                      value={formData.locationCountryId.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, locationCountryId: Number.parseInt(value), locationCountyId: 0 })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("firm.selectCountry")} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">{t("firm.county")}</Label>
                    <Select
                      value={formData.locationCountyId.toString()}
                      onValueChange={(value) => setFormData({ ...formData, locationCountyId: Number.parseInt(value) })}
                      disabled={!formData.locationCountryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("firm.selectCounty")} />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county) => (
                          <SelectItem key={county.id} value={county.id.toString()}>
                            {county.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <FormInput
                    id="locationCity"
                    label={t("firm.city")}
                    placeholder={t("firm.cityPlaceholder")}
                    value={formData.locationCity}
                    onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                    required
                    disabled={loading}
                  />

                  <FormInput
                    id="locationAddress"
                    label={t("firm.address")}
                    placeholder={t("firm.addressPlaceholder")}
                    value={formData.locationAddress}
                    onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                    disabled={loading}
                  />

                  <FormInput
                    id="locationPostalCode"
                    label={t("firm.postalCode")}
                    placeholder="123456"
                    value={formData.locationPostalCode}
                    onChange={(e) => setFormData({ ...formData, locationPostalCode: e.target.value })}
                    disabled={loading}
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
                      {universalQuestions.map((question) => {
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
                                    .sort((a, b) => a.order - b.order)
                                    .map((option) => {
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
                      <h4 className="font-semibold text-sm text-muted-foreground">{t("firm.step3Title")}</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">{t("firm.country")}:</span>{" "}
                          {countries.find((c) => c.id === formData.locationCountryId)?.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.county")}:</span>{" "}
                          {counties.find((c) => c.id === formData.locationCountyId)?.name}
                        </p>
                        <p>
                          <span className="font-medium">{t("firm.city")}:</span> {formData.locationCity}
                        </p>
                        {formData.locationAddress && (
                          <p>
                            <span className="font-medium">{t("firm.address")}:</span> {formData.locationAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    {universalQuestions.length > 0 && Object.keys(questionAnswers).length > 0 && (
                      <div className="rounded-lg border p-4 space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">{t("firm.step4Title")}</h4>
                        <div className="space-y-1 text-sm">
                          {universalQuestions
                            .filter((q) => questionAnswers[q.id])
                            .map((question) => {
                              const translation = getQuestionTranslation(question)
                              const selectedOptionId = questionAnswers[question.id]

                              const selectedOption = question.options.find((opt) => opt.id === selectedOptionId)
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
              <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
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
                disabled={!canProceed() || loading}
              >
                {t("common.next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                onClick={() => console.log("[v0] Submit button clicked", { step, isSubmitting, loading })}
              >
                {loading ? t("common.loading") : t("common.submit")}
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
