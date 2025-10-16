"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { RegistrationProgress } from "@/components/company/registration-progress"
import { Step1General } from "@/components/company/step1-general"
import { Step2Contact } from "@/components/company/step2-contact"
import { Step3Links } from "@/components/company/step3-links"
import { Step4Location } from "@/components/company/step4-location"
import type { CompanyFormData, CompanyType, Country } from "@/lib/types/company"
import { getCompanyTypes, getCountries, createCompany } from "@/lib/api/company"
import { ChevronLeft, ChevronRight } from "lucide-react"

const TOTAL_STEPS = 4

export default function CompanyRegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CompanyFormData>>({})
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const steps = [
    t("company.register.step1"),
    t("company.register.step2"),
    t("company.register.step3"),
    t("company.register.step4"),
  ]

  useEffect(() => {
    Promise.all([getCompanyTypes(), getCountries()])
      .then(([types, countriesData]) => {
        setCompanyTypes(types)
        setCountries(countriesData)
      })
      .catch((error) => {
        console.error("[v0] Failed to load data:", error)
        toast({
          title: t("auth.error"),
          description: "Failed to load form data",
          variant: "destructive",
        })
      })
      .finally(() => setInitialLoading(false))
  }, [])

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.cui && formData.name && formData.typeId && formData.description)
      case 2:
        return !!formData.contactEmail
      case 3:
        return true // All fields optional
      case 4:
        return !!(formData.locationCountryId && formData.locationCountyId && formData.locationCity)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: t("auth.error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      toast({
        title: t("auth.error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (!user) {
        router.push("/login")
        return
      }

      const company = await createCompany(formData as CompanyFormData)

      toast({
        title: t("auth.success"),
        description: "Company registered successfully!",
      })

      router.push(`/dashboard/company/${company.id}/media`)
    } catch (error: any) {
      console.error("[v0] Company registration error:", error)
      toast({
        title: t("auth.error"),
        description: error.message || "Failed to register company",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading || authLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{t("company.register.title")}</CardTitle>
          <CardDescription>
            {t("company.register.progress")
                .replace("{current}", currentStep.toString())
              .replace("{total}", TOTAL_STEPS.toString())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} steps={steps} />

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && <Step1General data={formData} onChange={setFormData} companyTypes={companyTypes} />}
            {currentStep === 2 && <Step2Contact data={formData} onChange={setFormData} />}
            {currentStep === 3 && <Step3Links data={formData} onChange={setFormData} />}
            {currentStep === 4 && <Step4Location data={formData} onChange={setFormData} countries={countries} />}

            <div className="mt-8 flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("common.previous")}
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button type="button" onClick={handleNext}>
                  {t("common.next")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? t("common.loading") : t("common.submit")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
