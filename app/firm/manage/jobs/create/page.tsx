"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Plus } from "lucide-react"
import { useCreateJobPost } from "@/lib/hooks/use-jobs"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Badge } from "@/components/ui/badge"

// Enums mapping (same as in other files)
enum HrSpecialization {
  Generalist = 0,
  Recruiter = 1,
  TalentAcquisition = 2,
  Manager = 3,
  CompensationAndBenefits = 4,
  EmployeeRelations = 5,
  TrainingAndDevelopment = 6,
  OrganizationalDevelopment = 7,
  LaborRelations = 8,
  DiversityAndInclusion = 9,
  Compliance = 10,
  WellnessCoordinator = 11,
  Consultant = 12
}

enum EmploymentType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Temporary = 3,
  Internship = 4,
  Volunteer = 5,
  Freelance = 6
}

enum JobSeniority {
  Intern = 0,
  Junior = 1,
  MidLevel = 2,
  Senior = 3,
  Lead = 4,
  Manager = 5,
  Director = 6,
  Executive = 7
}

enum WorkLocationType {
  OnSite = 0,
  Hybrid = 1,
  Remote = 2
}

export default function CreateJobPostPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  
  const { mutate: createJobPost, isPending: isCreating } = useCreateJobPost()

  const [formData, setFormData] = useState<any>({
    title: "",
    specialization: HrSpecialization.Generalist,
    seniority: JobSeniority.Junior,
    location: {
        countryId: "",
        countyId: "",
        cityId: "",
        address: "",
        workLocationType: WorkLocationType.OnSite
    },
    compensation: {
        minimumSalary: 0,
        maximumSalary: 0,
        currency: "EUR",
        isNegotiable: false
    },
    employmentType: EmploymentType.FullTime,
    requiredCertifications: [],
    requiredSoftSkills: [],
    requiredTechStack: [],
    applicationLink: "",
    richDescription: ""
  })
  
  // Location data
  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(formData.location.countryId || "")
  const { data: cities = [] } = useCities(formData.location.countyId || "")

  // Input states for lists
  const [techStackInput, setTechStackInput] = useState("")
  const [softSkillInput, setSoftSkillInput] = useState("")
  const [certificationInput, setCertificationInput] = useState("")

  const techStackSuggestions = [
    "suggestions.techStack.linkedin",
    "suggestions.techStack.workday",
    "suggestions.techStack.bamboohr",
    "suggestions.techStack.sap",
    "suggestions.techStack.oracle",
    "suggestions.techStack.greenhouse",
    "suggestions.techStack.lever",
    "suggestions.techStack.taleo",
  ]

  const softSkillsSuggestions = [
    "suggestions.softSkills.communication",
    "suggestions.softSkills.teamwork",
    "suggestions.softSkills.problemSolving",
    "suggestions.softSkills.leadership",
    "suggestions.softSkills.timeManagement",
    "suggestions.softSkills.adaptability",
    "suggestions.softSkills.creativity",
    "suggestions.softSkills.workEthic",
  ]

  const certificationsSuggestions = [
    "suggestions.certifications.pmp",
    "suggestions.certifications.shrm",
    "suggestions.certifications.phr",
    "suggestions.certifications.cipd",
  ]

  const handleSave = () => {
    // Basic validation
    if (!formData.title || !formData.richDescription) {
        toast({
            title: t("common.validationError"),
            description: t("jobs.manage.validationError"),
            variant: "destructive",
        })
        return
    }

    if (!formData.location.countryId || !formData.location.countyId || !formData.location.cityId) {
        toast({
            title: t("common.validationError"),
            description: t("jobs.manage.locationError"),
            variant: "destructive",
        })
        return
    }

    createJobPost(formData, {
        onSuccess: () => {
            toast({
                title: t("common.success"),
                description: t("jobs.manage.createSuccess"),
            })
            router.push("/firm/manage")
        },
        onError: (error: any) => {
            toast({
                title: t("common.error"),
                description: error.message || t("jobs.manage.createError"),
                variant: "destructive",
            })
        }
    })
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateLocation = (field: string, value: any) => {
    setFormData((prev: any) => ({
        ...prev,
        location: { ...prev.location, [field]: value }
    }))
  }

  const updateCompensation = (field: string, value: any) => {
    setFormData((prev: any) => ({
        ...prev,
        compensation: { ...prev.compensation, [field]: value }
    }))
  }

  // Helper for list fields
  const addToList = (field: string, value: string, setInput: (val: string) => void) => {
      if (!value.trim()) return
      if (!formData[field].includes(value.trim())) {
          setFormData((prev: any) => ({
              ...prev,
              [field]: [...(prev[field] || []), value.trim()]
          }))
      }
      setInput("")
  }

  const removeFromList = (field: string, index: number) => {
      setFormData((prev: any) => ({
          ...prev,
          [field]: prev[field].filter((_: any, i: number) => i !== index)
      }))
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("jobs.manage.createTitle")}</h1>
        <Button onClick={handleSave} disabled={isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("common.create")}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>{t("jobs.manage.title")}</Label>
                    <Input value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder={t("jobs.manage.placeholder.title")} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.specialization")}</Label>
                        <Select 
                            value={formData.specialization.toString()} 
                            onValueChange={(val) => updateField("specialization", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(HrSpecialization).filter(k => isNaN(Number(k))).map((key) => (
                                    <SelectItem key={key} value={HrSpecialization[key as keyof typeof HrSpecialization].toString()}>
                                        {t(`enums.hrSpecialization.${key}` as any)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.seniority")}</Label>
                        <Select 
                            value={formData.seniority.toString()} 
                            onValueChange={(val) => updateField("seniority", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(JobSeniority).filter(k => isNaN(Number(k))).map((key) => (
                                    <SelectItem key={key} value={JobSeniority[key as keyof typeof JobSeniority].toString()}>
                                        {t(`enums.jobSeniority.${key}` as any)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.employmentType")}</Label>
                        <Select 
                            value={formData.employmentType.toString()} 
                            onValueChange={(val) => updateField("employmentType", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(EmploymentType).filter(k => isNaN(Number(k))).map((key) => (
                                    <SelectItem key={key} value={EmploymentType[key as keyof typeof EmploymentType].toString()}>
                                        {t(`enums.employmentType.${key}` as any)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.workLocationType")}</Label>
                        <Select 
                            value={formData.location.workLocationType.toString()} 
                            onValueChange={(val) => updateLocation("workLocationType", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(WorkLocationType).filter(k => isNaN(Number(k))).map((key) => (
                                    <SelectItem key={key} value={WorkLocationType[key as keyof typeof WorkLocationType].toString()}>
                                        {t(`enums.workLocationType.${key}` as any)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.location")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.country")}</Label>
                        <Select 
                            value={formData.location.countryId || ""} 
                            onValueChange={(val) => {
                                updateLocation("countryId", val)
                                updateLocation("countyId", "")
                                updateLocation("cityId", "")
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("jobs.manage.country")} />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.county")}</Label>
                        <Select 
                            value={formData.location.countyId || ""} 
                            onValueChange={(val) => {
                                updateLocation("countyId", val)
                                updateLocation("cityId", "")
                            }}
                            disabled={!formData.location.countryId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("jobs.manage.county")} />
                            </SelectTrigger>
                            <SelectContent>
                                {counties.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.city")}</Label>
                        <Select 
                            value={formData.location.cityId || ""} 
                            onValueChange={(val) => updateLocation("cityId", val)}
                            disabled={!formData.location.countyId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("jobs.manage.city")} />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>{t("jobs.manage.address")}</Label>
                    <Input value={formData.location.address || ""} onChange={(e) => updateLocation("address", e.target.value)} placeholder={t("jobs.manage.placeholder.address")} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.compensation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.minSalary")}</Label>
                        <Input type="number" value={formData.compensation.minimumSalary} onChange={(e) => updateCompensation("minimumSalary", parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.maxSalary")}</Label>
                        <Input type="number" value={formData.compensation.maximumSalary} onChange={(e) => updateCompensation("maximumSalary", parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.currency")}</Label>
                        <Select 
                            value={formData.compensation.currency} 
                            onValueChange={(val) => updateCompensation("currency", val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="RON">RON</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="negotiable" 
                        checked={formData.compensation.isNegotiable}
                        onCheckedChange={(checked) => updateCompensation("isNegotiable", checked)}
                    />
                    <Label htmlFor="negotiable">{t("jobs.manage.negotiable")}</Label>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.description")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>{t("jobs.manage.richDescription")}</Label>
                    <RichTextEditor 
                        value={formData.richDescription} 
                        onChange={(value) => updateField("richDescription", value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t("jobs.manage.applicationLink")}</Label>
                    <Input value={formData.applicationLink || ""} onChange={(e) => updateField("applicationLink", e.target.value)} placeholder="https://..." />
                    <p className="text-sm text-muted-foreground">
                        {t("jobs.manage.applicationLinkDesc")}
                    </p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.requirements")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>{t("jobs.manage.techStack")}</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder={t("jobs.manage.placeholder.techStack")}
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToList("requiredTechStack", techStackInput, setTechStackInput)
                                }
                            }}
                        />
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addToList("requiredTechStack", techStackInput, setTechStackInput)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {techStackSuggestions.map((key) => {
                            const label = t(key as any)
                            if (formData.requiredTechStack.includes(label)) return null
                            return (
                                <Badge 
                                    key={key} 
                                    variant="outline" 
                                    className="cursor-pointer hover:bg-secondary"
                                    onClick={() => addToList("requiredTechStack", label, setTechStackInput)}
                                >
                                    + {label}
                                </Badge>
                            )
                        })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredTechStack.map((item: string, i: number) => (
                            <Badge key={i} variant="secondary">
                                {item}
                                <button onClick={() => removeFromList("requiredTechStack", i)} className="ml-2 hover:text-destructive">×</button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{t("jobs.manage.softSkills")}</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder={t("jobs.manage.placeholder.softSkills")}
                            value={softSkillInput}
                            onChange={(e) => setSoftSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToList("requiredSoftSkills", softSkillInput, setSoftSkillInput)
                                }
                            }}
                        />
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addToList("requiredSoftSkills", softSkillInput, setSoftSkillInput)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {softSkillsSuggestions.map((key) => {
                            const label = t(key as any)
                            if (formData.requiredSoftSkills.includes(label)) return null
                            return (
                                <Badge 
                                    key={key} 
                                    variant="outline" 
                                    className="cursor-pointer hover:bg-secondary"
                                    onClick={() => addToList("requiredSoftSkills", label, setSoftSkillInput)}
                                >
                                    + {label}
                                </Badge>
                            )
                        })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredSoftSkills.map((item: string, i: number) => (
                            <Badge key={i} variant="secondary">
                                {item}
                                <button onClick={() => removeFromList("requiredSoftSkills", i)} className="ml-2 hover:text-destructive">×</button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{t("jobs.manage.certifications")}</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder={t("jobs.manage.placeholder.certifications")}
                            value={certificationInput}
                            onChange={(e) => setCertificationInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToList("requiredCertifications", certificationInput, setCertificationInput)
                                }
                            }}
                        />
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addToList("requiredCertifications", certificationInput, setCertificationInput)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {certificationsSuggestions.map((key) => {
                            const label = t(key as any)
                            if (formData.requiredCertifications.includes(label)) return null
                            return (
                                <Badge 
                                    key={key} 
                                    variant="outline" 
                                    className="cursor-pointer hover:bg-secondary"
                                    onClick={() => addToList("requiredCertifications", label, setCertificationInput)}
                                >
                                    + {label}
                                </Badge>
                            )
                        })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredCertifications.map((item: string, i: number) => (
                            <Badge key={i} variant="secondary">
                                {item}
                                <button onClick={() => removeFromList("requiredCertifications", i)} className="ml-2 hover:text-destructive">×</button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
