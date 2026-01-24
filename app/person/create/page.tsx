"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, Check, User, MapPin, Briefcase, GraduationCap, Award, Settings, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"
import { FormInput } from "@/components/ui/form-input"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types matching the DTO
interface WorkExperience {
  jobTitle: string
  companyName: string
  startDate: string
  endDate?: string
  isCurrentRole: boolean
  description: string
}

interface Education {
  institution: string
  degree: string
  description: string
  startDate: string
  graduationDate?: string
}

interface Certification {
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
  credentialUrl?: string
  credentialId?: string
}

interface PersonFormData {
  firstName: string
  lastName: string
  contactEmail: string
  contactPhone?: string
  headline: string
  location: {
    countryId: string
    countyId: string
    cityId: string
  }
  summary: string
  workHistory: WorkExperience[]
  educationHistory: Education[]
  certifications: Certification[]
  skills: string[]
  languages: string[]
  portfolioUrl: string
  linkedInUrl: string
  isOpenToRemote: boolean
  availabilityTimeSpanInDays: number
}

const initialFormData: PersonFormData = {
  firstName: "",
  lastName: "",
  contactEmail: "",
  contactPhone: "",
  headline: "",
  location: {
    countryId: "",
    countyId: "",
    cityId: "",
  },
  summary: "",
  workHistory: [],
  educationHistory: [],
  certifications: [],
  skills: [],
  languages: [],
  portfolioUrl: "",
  linkedInUrl: "",
  isOpenToRemote: false,
  availabilityTimeSpanInDays: 0,
}

type ErrorState = {
  [key in keyof PersonFormData]?: string
} & {
  location?: {
    countryId?: string
    countyId?: string
    cityId?: string
  }
}

const capitalizeFirstLetter = (string: string) => {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Helper components moved outside
const WorkHistoryForm = ({ 
  workHistory, 
  setFormData, 
  t 
}: { 
  workHistory: WorkExperience[], 
  setFormData: React.Dispatch<React.SetStateAction<PersonFormData>>, 
  t: any 
}) => {
  const addWork = () => {
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, {
        jobTitle: "",
        companyName: "",
        startDate: "",
        isCurrentRole: false,
        description: ""
      }]
    }))
  }

  const removeWork = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }))
  }

  const updateWork = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.map((item, i) => {
        if (i !== index) return item;
        
        let newValue = value;
        if (typeof value === 'string' && (field === "jobTitle" || field === "companyName" || field === "description")) {
            newValue = capitalizeFirstLetter(value);
        }

        if (field === "isCurrentRole" && value === true) {
            return { ...item, [field]: value, endDate: "" }
        }
        return { ...item, [field]: newValue }
      })
    }))
  }

  return (
    <div className="space-y-6">
      {workHistory.map((work, index) => (
        <Card key={index} className="relative border-2 border-dashed">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            onClick={() => removeWork(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("person.jobTitle")}</Label>
                <Input 
                  value={work.jobTitle} 
                  onChange={(e) => updateWork(index, "jobTitle", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>{t("person.companyName")}</Label>
                <Input 
                  value={work.companyName} 
                  onChange={(e) => updateWork(index, "companyName", e.target.value)} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("person.startDate")}</Label>
                <Input 
                  type="date" 
                  value={work.startDate} 
                  max={work.endDate || undefined}
                  onChange={(e) => updateWork(index, "startDate", e.target.value)} 
                />
                {work.startDate && work.endDate && new Date(work.startDate) > new Date(work.endDate) && (
                    <p className="text-sm text-destructive">Start date cannot be after end date</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("person.endDate")}</Label>
                <Input 
                  type="date" 
                  value={work.endDate || ""} 
                  min={work.startDate}
                  onChange={(e) => updateWork(index, "endDate", e.target.value)} 
                  disabled={work.isCurrentRole}
                />
                {work.startDate && work.endDate && new Date(work.endDate) < new Date(work.startDate) && (
                    <p className="text-sm text-destructive">End date cannot be before start date</p>
                )}
              </div>
            </div>
            
            <div 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => updateWork(index, "isCurrentRole", !work.isCurrentRole)}
            >
              <Checkbox 
                id={`current-${index}`}
                checked={work.isCurrentRole}
                onCheckedChange={(checked) => updateWork(index, "isCurrentRole", checked)}
              />
              <div className="space-y-1">
                <Label 
                  htmlFor={`current-${index}`} 
                  className="cursor-pointer font-medium"
                >
                  {t("person.currentRole")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("person.currentRoleDesc")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("person.description")}</Label>
              <Textarea 
                value={work.description} 
                onChange={(e) => updateWork(index, "description", e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addWork} variant="outline" className="w-full border-dashed h-12">
        <Plus className="mr-2 h-4 w-4" /> {t("person.addWork")}
      </Button>
    </div>
  )
}

const EducationForm = ({ 
  educationHistory, 
  setFormData, 
  t 
}: { 
  educationHistory: Education[], 
  setFormData: React.Dispatch<React.SetStateAction<PersonFormData>>, 
  t: any 
}) => {
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationHistory: [...prev.educationHistory, {
        institution: "",
        degree: "",
        description: "",
        startDate: ""
      }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationHistory: prev.educationHistory.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setFormData(prev => ({
      ...prev,
      educationHistory: prev.educationHistory.map((item, i) => {
        if (i !== index) return item;

        let newValue = value;
        if (typeof value === 'string' && (field === "institution" || field === "degree" || field === "description")) {
            newValue = capitalizeFirstLetter(value);
        }

        return { ...item, [field]: newValue }
      })
    }))
  }

  return (
    <div className="space-y-6">
      {educationHistory.map((edu, index) => (
        <Card key={index} className="relative border-2 border-dashed">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            onClick={() => removeEducation(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("person.institution")}</Label>
                <Input 
                  value={edu.institution} 
                  onChange={(e) => updateEducation(index, "institution", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>{t("person.degree")}</Label>
                <Input 
                  value={edu.degree} 
                  onChange={(e) => updateEducation(index, "degree", e.target.value)} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("person.startDate")}</Label>
                <Input 
                  type="date" 
                  value={edu.startDate} 
                  max={edu.graduationDate || undefined}
                  onChange={(e) => updateEducation(index, "startDate", e.target.value)} 
                />
                {edu.startDate && edu.graduationDate && new Date(edu.startDate) > new Date(edu.graduationDate) && (
                    <p className="text-sm text-destructive">Start date cannot be after graduation date</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("person.graduationDate")}</Label>
                <Input 
                  type="date" 
                  value={edu.graduationDate || ""} 
                  min={edu.startDate}
                  onChange={(e) => updateEducation(index, "graduationDate", e.target.value)} 
                />
                {edu.startDate && edu.graduationDate && new Date(edu.graduationDate) < new Date(edu.startDate) && (
                    <p className="text-sm text-destructive">Graduation date cannot be before start date</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("person.description")}</Label>
              <Textarea 
                value={edu.description} 
                onChange={(e) => updateEducation(index, "description", e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full border-dashed h-12">
        <Plus className="mr-2 h-4 w-4" /> {t("person.addEducation")}
      </Button>
    </div>
  )
}

const CertificationsForm = ({ 
  certifications, 
  skills, 
  languages, 
  setFormData, 
  t 
}: { 
  certifications: Certification[], 
  skills: string[], 
  languages: string[], 
  setFormData: React.Dispatch<React.SetStateAction<PersonFormData>>, 
  t: any 
}) => {
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: "",
        issuingOrganization: "",
        issueDate: ""
      }]
    }))
  }

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((item, i) => {
        if (i !== index) return item;

        let newValue = value;
        if (typeof value === 'string' && (field === "name" || field === "issuingOrganization")) {
            newValue = capitalizeFirstLetter(value);
        }

        return { ...item, [field]: newValue }
      })
    }))
  }

  const [skillInput, setSkillInput] = useState("")
  const [langInput, setLangInput] = useState("")

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!skills.includes(skillInput.trim())) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const addLanguage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && langInput.trim()) {
      e.preventDefault()
      if (!languages.includes(langInput.trim())) {
        setFormData(prev => ({ ...prev, languages: [...prev.languages, langInput.trim()] }))
      }
      setLangInput("")
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("person.skills")}</h3>
        <Input 
          placeholder={t("person.skillsPlaceholder")}
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={addSkill}
        />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("person.languages")}</h3>
        <Input 
          placeholder={t("person.languagesPlaceholder")}
          value={langInput}
          onChange={(e) => setLangInput(e.target.value)}
          onKeyDown={addLanguage}
        />
        <div className="flex flex-wrap gap-2">
          {languages.map((lang, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {lang}
              <button onClick={() => removeLanguage(lang)} className="ml-2 hover:text-destructive">
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("person.addCertification")}</h3>
        {certifications.map((cert, index) => (
          <Card key={index} className="relative border-2 border-dashed">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
              onClick={() => removeCertification(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("person.certificationName")}</Label>
                  <Input 
                    value={cert.name} 
                    onChange={(e) => updateCertification(index, "name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("person.issuingOrganization")}</Label>
                  <Input 
                    value={cert.issuingOrganization} 
                    onChange={(e) => updateCertification(index, "issuingOrganization", e.target.value)} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("person.issueDate")}</Label>
                  <Input 
                    type="date" 
                    value={cert.issueDate} 
                    max={cert.expirationDate || undefined}
                    onChange={(e) => updateCertification(index, "issueDate", e.target.value)} 
                  />
                  {cert.issueDate && cert.expirationDate && new Date(cert.issueDate) > new Date(cert.expirationDate) && (
                    <p className="text-sm text-destructive">Issue date cannot be after expiration date</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("person.expirationDate")}</Label>
                  <Input 
                    type="date" 
                    value={cert.expirationDate || ""} 
                    min={cert.issueDate}
                    onChange={(e) => updateCertification(index, "expirationDate", e.target.value)} 
                  />
                  {cert.issueDate && cert.expirationDate && new Date(cert.expirationDate) < new Date(cert.issueDate) && (
                    <p className="text-sm text-destructive">Expiration date cannot be before issue date</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("person.credentialUrl")}</Label>
                  <Input 
                    value={cert.credentialUrl || ""} 
                    onChange={(e) => updateCertification(index, "credentialUrl", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("person.credentialId")}</Label>
                  <Input 
                    value={cert.credentialId || ""} 
                    onChange={(e) => updateCertification(index, "credentialId", e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addCertification} variant="outline" className="w-full border-dashed h-12">
          <Plus className="mr-2 h-4 w-4" /> {t("person.addCertification")}
        </Button>
      </div>
    </div>
  )
}

const STORAGE_KEY = "person_create_form_data"

function CreatePersonForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, updateUserInfo } = useAuth()
  const { setError, clearError } = useFormErrors()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PersonFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ErrorState>({})
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Location state
  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(formData.location.countryId)
  const { data: cities = [] } = useCities(formData.location.countyId)

  // Map fields to steps
  const fieldStepMap: Record<string, number> = {
    firstName: 1,
    lastName: 1,
    contactEmail: 1,
    contactPhone: 1,
    headline: 1,
    "location.countryId": 1,
    "location.countyId": 1,
    "location.cityId": 1,
    summary: 1,
    portfolioUrl: 1,
    linkedInUrl: 1,
    workHistory: 2,
    educationHistory: 3,
    certifications: 4,
    skills: 4,
    languages: 4,
    isOpenToRemote: 5,
    availabilityTimeSpanInDays: 5
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
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep)
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
        currentStep
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [formData, currentStep, isLoaded])

  useEffect(() => {
    if (userInfo?.email) {
      setFormData(prev => {
        if (!prev.contactEmail) {
          return { ...prev, contactEmail: userInfo.email }
        }
        return prev
      })
    }
  }, [userInfo])

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, countryId: value, countyId: "", cityId: "" }
    }))
    setErrors(prev => ({ ...prev, location: { ...prev.location, countryId: undefined } }))
  }

  const handleCountyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, countyId: value, cityId: "" }
    }))
    setErrors(prev => ({ ...prev, location: { ...prev.location, countyId: undefined } }))
  }

  const handleCityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, cityId: value }
    }))
    setErrors(prev => ({ ...prev, location: { ...prev.location, cityId: undefined } }))
  }

  const updateFormData = (field: keyof PersonFormData, value: any) => {
    let newValue = value;
    if (field === "firstName" || field === "lastName" || field === "headline" || field === "summary") {
        newValue = capitalizeFirstLetter(value);
    }
    setFormData(prev => ({ ...prev, [field]: newValue }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
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
    let urlToValidate = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        urlToValidate = "https://" + url
    }
    
    if (!urlToValidate.includes(".")) {
        return t("firm.validation.invalidUrl")
    }

    try {
      new URL(urlToValidate)
      return ""
    } catch {
      return t("firm.validation.invalidUrl")
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: ErrorState = {}
    let isValid = true

    if (step === 1) {
      if (!formData.firstName) {
        newErrors.firstName = t("firm.validation.fieldRequired")
        isValid = false
      }
      if (!formData.lastName) {
        newErrors.lastName = t("firm.validation.fieldRequired")
        isValid = false
      }
      if (!formData.headline) {
        newErrors.headline = t("firm.validation.fieldRequired")
        isValid = false
      }
      if (!formData.contactEmail) {
        newErrors.contactEmail = t("firm.validation.fieldRequired")
        isValid = false
      } else {
        const emailError = validateEmail(formData.contactEmail)
        if (emailError) {
            newErrors.contactEmail = emailError
            isValid = false
        }
      }
      
      if (formData.contactPhone) {
        const phoneError = validatePhone(formData.contactPhone)
        if (phoneError) {
            newErrors.contactPhone = phoneError
            isValid = false
        }
      }

      if (!formData.location.countryId) {
        newErrors.location = { ...newErrors.location, countryId: t("firm.validation.fieldRequired") }
        isValid = false
      }
      if (!formData.location.countyId) {
        newErrors.location = { ...newErrors.location, countyId: t("firm.validation.fieldRequired") }
        isValid = false
      }
      if (!formData.location.cityId) {
        newErrors.location = { ...newErrors.location, cityId: t("firm.validation.fieldRequired") }
        isValid = false
      }

      if (formData.portfolioUrl) {
        const urlError = validateUrl(formData.portfolioUrl)
        if (urlError) {
            newErrors.portfolioUrl = urlError
            isValid = false
        }
      }

      if (formData.linkedInUrl) {
        const urlError = validateUrl(formData.linkedInUrl)
        if (urlError) {
            newErrors.linkedInUrl = urlError
            isValid = false
        } else if (!formData.linkedInUrl.toLowerCase().includes("linkedin.com")) {
             newErrors.linkedInUrl = t("firm.validation.invalidUrl")
             isValid = false
        }
      }
    }

    if (step === 2) {
      const invalidWork = formData.workHistory.some(work => 
        work.startDate && work.endDate && new Date(work.endDate) < new Date(work.startDate)
      )
      if (invalidWork) {
        toast({
          title: t("firm.validationErrors"),
          description: "End date cannot be before start date in work history.",
          variant: "destructive",
        })
        isValid = false
      }
    }

    if (step === 3) {
      const invalidEdu = formData.educationHistory.some(edu => 
        edu.startDate && edu.graduationDate && new Date(edu.graduationDate) < new Date(edu.startDate)
      )
      if (invalidEdu) {
        toast({
          title: t("firm.validationErrors"),
          description: "Graduation date cannot be before start date in education.",
          variant: "destructive",
        })
        isValid = false
      }
    }

    if (step === 4) {
      const invalidCert = formData.certifications.some(cert => 
        cert.issueDate && cert.expirationDate && new Date(cert.expirationDate) < new Date(cert.issueDate)
      )
      if (invalidCert) {
        toast({
          title: t("firm.validationErrors"),
          description: "Expiration date cannot be before issue date in certifications.",
          variant: "destructive",
        })
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    clearError()
    setStepErrors({})
    setErrors({})

    try {
      const response: any = await apiClient.person.create(formData)
      
      // Update user info with new person details
      updateUserInfo({
        personId: response.personId,
        personName: response.personName
      })

      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: t("common.success"),
        description: t("person.createSuccess"),
      })
      router.push("/profile")
    } catch (error: any) {
      console.error("Failed to create person profile", error)
      setError(error)
      if (error.validationErrors) {
        const newValidationErrors: ErrorState = {}
        const newStepErrors: Record<number, boolean> = {}

        Object.entries(error.validationErrors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : (messages as string)
            const normalizedField = field.charAt(0).toLowerCase() + field.slice(1)
            
            if (normalizedField.startsWith("location.")) {
                const locationField = normalizedField.split(".")[1]
                newValidationErrors.location = { ...newValidationErrors.location, [locationField]: message }
            } else {
                (newValidationErrors as any)[normalizedField] = message
            }

            const stepNumber = fieldStepMap[normalizedField] || fieldStepMap[normalizedField.split('.')[0]]
            if (stepNumber) {
                newStepErrors[stepNumber] = true
            }
        })

        setErrors(newValidationErrors)
        setStepErrors(newStepErrors)

        const firstErrorStep = Object.keys(newStepErrors).map(Number).sort((a, b) => a - b)[0]
        if (firstErrorStep) {
            setCurrentStep(firstErrorStep)
        }

        const firstErrorMessage = Object.values(newValidationErrors)[0]
        toast({
            title: t("firm.validationErrors"),
            description: typeof firstErrorMessage === 'string' ? firstErrorMessage : t("firm.validationErrorDesc"),
            variant: "destructive",
        })
      } else if (error.detail) {
          toast({
              title: t("common.error"),
              description: error.detail,
              variant: "destructive",
          })
      } else {
          toast({
            title: t("common.error"),
            description: error.message || t("firm.updateError"),
            variant: "destructive"
          })
      }
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: t("person.step1Title"), icon: User },
    { number: 2, title: t("person.step3Title"), icon: Briefcase },
    { number: 3, title: t("person.step4Title"), icon: GraduationCap },
    { number: 4, title: t("person.step5Title"), icon: Award },
    { number: 5, title: t("person.step6Title"), icon: Settings },
  ]

  const ErrorMessage = ({ field }: { field?: string }) => 
    field ? <p className="text-sm text-destructive mt-1">{field}</p> : null

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{t("person.createTitle")}</h1>
              <p className="text-muted-foreground">{t("person.createSubtitle")}</p>
            </div>

            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.number === currentStep
                      ? "bg-primary/10 text-primary"
                      : step.number < currentStep
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  } ${stepErrors[step.number] ? "bg-destructive/10 text-destructive" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step.number <= currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-current"
                    } ${stepErrors[step.number] ? "border-destructive bg-destructive text-destructive-foreground" : ""}`}
                  >
                    {stepErrors[step.number] ? <AlertCircle className="h-4 w-4" /> : (step.number < currentStep ? <Check className="h-4 w-4" /> : step.number)}
                  </div>
                  <div className="font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Form */}
          <div className="lg:col-span-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {React.createElement(steps[currentStep - 1].icon, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <CardTitle>{t(`person.step${currentStep === 1 ? 1 : currentStep + 1}Title` as any)}</CardTitle>
                    <CardDescription>{t(`person.step${currentStep === 1 ? 1 : currentStep + 1}Desc` as any)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {Object.keys(stepErrors).length > 0 && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t("firm.validationErrorDesc")}
                    </AlertDescription>
                  </Alert>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t("person.firstName")} <span className="text-destructive">*</span></Label>
                            <FormInput 
                              id="firstName"
                              value={formData.firstName} 
                              onChange={(e) => updateFormData("firstName", e.target.value)} 
                              error={errors.firstName}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("person.lastName")} <span className="text-destructive">*</span></Label>
                            <FormInput 
                              id="lastName"
                              value={formData.lastName} 
                              onChange={(e) => updateFormData("lastName", e.target.value)} 
                              error={errors.lastName}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>{t("person.headline")} <span className="text-destructive">*</span></Label>
                          <FormInput 
                            id="headline"
                            placeholder={t("person.headlinePlaceholder")}
                            value={formData.headline} 
                            onChange={(e) => updateFormData("headline", e.target.value)} 
                            error={errors.headline}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t("person.contactEmail")} <span className="text-destructive">*</span></Label>
                            <FormInput 
                              id="contactEmail"
                              type="email"
                              value={formData.contactEmail} 
                              onChange={(e) => updateFormData("contactEmail", e.target.value)} 
                              error={errors.contactEmail}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("person.contactPhone")}</Label>
                            <FormInput 
                              id="contactPhone"
                              type="tel"
                              value={formData.contactPhone} 
                              onChange={(e) => updateFormData("contactPhone", e.target.value)} 
                              error={errors.contactPhone}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>{t("firm.country")} <span className="text-destructive">*</span></Label>
                            <Select value={formData.location.countryId} onValueChange={handleCountryChange}>
                              <SelectTrigger className={errors.location?.countryId ? "border-destructive" : ""}>
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
                            <ErrorMessage field={errors.location?.countryId} />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("firm.county")} <span className="text-destructive">*</span></Label>
                            <Select 
                              value={formData.location.countyId} 
                              onValueChange={handleCountyChange}
                              disabled={!formData.location.countryId}
                            >
                              <SelectTrigger className={errors.location?.countyId ? "border-destructive" : ""}>
                                <SelectValue placeholder={t("firm.selectCounty")} />
                              </SelectTrigger>
                              <SelectContent>
                                {counties.map((county: any) => (
                                  <SelectItem key={county.id} value={county.id}>
                                    {county.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <ErrorMessage field={errors.location?.countyId} />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("firm.city")} <span className="text-destructive">*</span></Label>
                            <Select 
                              value={formData.location.cityId} 
                              onValueChange={handleCityChange}
                              disabled={!formData.location.countyId}
                            >
                              <SelectTrigger className={errors.location?.cityId ? "border-destructive" : ""}>
                                <SelectValue placeholder={t("firm.selectCity")} />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city: any) => (
                                  <SelectItem key={city.id} value={city.id}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <ErrorMessage field={errors.location?.cityId} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>{t("person.summary")}</Label>
                          <Textarea 
                            placeholder={t("person.summaryPlaceholder")}
                            value={formData.summary} 
                            onChange={(e) => updateFormData("summary", e.target.value)} 
                            className="h-32"
                          />
                          <ErrorMessage field={errors.summary} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t("person.portfolioUrl")}</Label>
                            <FormInput 
                              id="portfolioUrl"
                              value={formData.portfolioUrl} 
                              onChange={(e) => updateFormData("portfolioUrl", e.target.value)} 
                              error={errors.portfolioUrl}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("person.linkedInUrl")}</Label>
                            <FormInput 
                              id="linkedInUrl"
                              value={formData.linkedInUrl} 
                              onChange={(e) => updateFormData("linkedInUrl", e.target.value)} 
                              error={errors.linkedInUrl}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <WorkHistoryForm 
                        workHistory={formData.workHistory} 
                        setFormData={setFormData} 
                        t={t} 
                      />
                    )}

                    {currentStep === 3 && (
                      <EducationForm 
                        educationHistory={formData.educationHistory} 
                        setFormData={setFormData} 
                        t={t} 
                      />
                    )}

                    {currentStep === 4 && (
                      <CertificationsForm 
                        certifications={formData.certifications} 
                        skills={formData.skills} 
                        languages={formData.languages} 
                        setFormData={setFormData} 
                        t={t} 
                      />
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <Checkbox 
                            id="remote"
                            checked={formData.isOpenToRemote}
                            onCheckedChange={(checked) => updateFormData("isOpenToRemote", checked)}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="remote">{t("person.isOpenToRemote")}</Label>
                            <p className="text-sm text-muted-foreground">
                              {t("person.remoteWorkDesc")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{t("person.availability")}</Label>
                          <FormInput 
                            id="availabilityTimeSpanInDays"
                            type="number"
                            min="0"
                            max="60"
                            value={formData.availabilityTimeSpanInDays.toString()}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Remove leading zeros unless it is just "0"
                                const cleanVal = val.replace(/^0+(?=\d)/, '');
                                let numVal = parseInt(cleanVal) || 0;
                                if (numVal > 60) numVal = 60;
                                updateFormData("availabilityTimeSpanInDays", numVal)
                            }}
                            error={errors.availabilityTimeSpanInDays}
                          />
                          <p className="text-sm text-muted-foreground">
                            {t("person.availabilityDesc")}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || loading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> {t("common.back")}
                </Button>
                
                {currentStep < 5 ? (
                  <Button onClick={handleNext}>
                    {t("common.next")} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("common.submit")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePersonPage() {
  return (
    <FormErrorProvider>
      <CreatePersonForm />
    </FormErrorProvider>
  )
}