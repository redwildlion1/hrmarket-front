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
import { Building2, Mail, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Info } from "lucide-react"

function CreateFirmForm() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Array<{ id: number; name: string }>>([])
  const [counties, setCounties] = useState<Array<{ id: number; name: string }>>([])
  const [firmTypesData, setFirmTypesData] = useState<{
    ro: Array<{ value: string; label: string; description: string }>
    en: Array<{ value: string; label: string; description: string }>
  } | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step !== 4) {
      return
    }

    setLoading(true)
    clearError()

    try {
      await apiClient.firm.create(formData)

      toast({
        title: t("common.success"),
        description: t("firm.createSuccess"),
      })

      router.push("/firm/manage")
    } catch (error: any) {
      setError(error)

      if (error.response?.data && !error.response.data.validationErrors) {
        toast({
          title: t("common.error"),
          description: error.response.data.detail || error.response.data.title,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
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
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-all ${
                    s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {apiError && !apiError.isValidationError && <ErrorAlert />}

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
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t("firm.step4Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("firm.step4Desc")}</p>
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

            {step < 4 ? (
              <Button type="button" onClick={nextStep} disabled={!canProceed() || loading}>
                {t("common.next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
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
