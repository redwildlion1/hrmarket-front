"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Plus, Trash2, RefreshCw, Users, Eye } from "lucide-react"
import { 
    useJobPostForManagement, 
    useUpdateJobPost, 
    useReactivateExpiredJobPost,
    useJobApplications 
} from "@/lib/hooks/use-jobs"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function JobPostManagementPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const { data: jobPost, isLoading: loading, error } = useJobPostForManagement(params.id as string)
  const { mutate: updateJobPost, isPending: isUpdating } = useUpdateJobPost()
  const { mutate: renewJob, isPending: isRenewing } = useReactivateExpiredJobPost()
  const { data: applications, isLoading: loadingApplications } = useJobApplications(params.id as string)

  const [formData, setFormData] = useState<any>(null)
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false)
  
  // Location data
  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(formData?.location?.countryId || "")
  const { data: cities = [] } = useCities(formData?.location?.countyId || "")

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

  useEffect(() => {
    if (jobPost) {
      setFormData({
        id: jobPost.id,
        title: jobPost.title,
        specialization: jobPost.specialization,
        seniority: jobPost.seniority,
        location: {
            countryId: jobPost.location.countryId,
            countyId: jobPost.location.countyId,
            cityId: jobPost.location.cityId,
            address: jobPost.location.address,
            workLocationType: jobPost.location.workLocationType
        },
        compensation: jobPost.compensation ? { ...jobPost.compensation } : {
            minimumSalary: 0,
            maximumSalary: 0,
            currency: "EUR",
            isNegotiable: false
        },
        employmentType: jobPost.employmentType,
        requiredCertifications: jobPost.requiredCertifications || [],
        requiredSoftSkills: jobPost.requiredSoftSkills || [],
        requiredTechStack: jobPost.requiredTechStack || [],
        applicationLink: jobPost.applicationLink || "",
        richDescription: jobPost.richDescription
      })
    }
  }, [jobPost])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <p className="text-muted-foreground">{t("jobs.manage.loadError")}</p>
        <Button onClick={() => router.back()}>{t("common.back")}</Button>
      </div>
    )
  }

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSave = () => {
    // Validation
    if (!formData.title || formData.title.length < 5) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.titleLength"),
            variant: "destructive",
        })
        return
    }

    if (!formData.richDescription || formData.richDescription.length < 15) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.descriptionLength"),
            variant: "destructive",
        })
        return
    }

    if (formData.specialization === undefined || formData.specialization === null) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.specializationRequired"),
            variant: "destructive",
        })
        return
    }

    if (formData.seniority === undefined || formData.seniority === null) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.seniorityRequired"),
            variant: "destructive",
        })
        return
    }

    if (formData.employmentType === undefined || formData.employmentType === null) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.employmentTypeRequired"),
            variant: "destructive",
        })
        return
    }

    if (formData.location.workLocationType === undefined || formData.location.workLocationType === null) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.workLocationTypeRequired"),
            variant: "destructive",
        })
        return
    }

    if (!formData.location.countryId || !formData.location.countyId || !formData.location.cityId) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.locationRequired"),
            variant: "destructive",
        })
        return
    }

    if (formData.compensation.maximumSalary < formData.compensation.minimumSalary) {
        toast({
            title: t("common.error"),
            description: t("jobs.manage.validation.salaryRange"),
            variant: "destructive",
        })
        return
    }

    updateJobPost(formData, {
        onSuccess: () => {
            toast({
                title: t("common.success"),
                description: t("jobs.manage.success"),
            })
        },
        onError: (error: any) => {
            toast({
                title: t("common.error"),
                description: error.message || t("jobs.manage.error"),
                variant: "destructive",
            })
        }
    })
  }

  const handleRenew = () => {
    renewJob(jobPost.id, {
        onSuccess: () => {
            toast({
                title: t("common.success"),
                description: t("jobs.manage.renewSuccess"),
            })
        },
        onError: (error: any) => {
            toast({
                title: t("common.error"),
                description: t("jobs.manage.renewError"),
                variant: "destructive",
            })
        }
    })
  }

  const updateField = (field: string, value: any) => {
    if (typeof value === 'string' && value.length > 0) {
        value = capitalizeFirstLetter(value)
    }
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateLocation = (field: string, value: any) => {
    if (typeof value === 'string' && value.length > 0 && field === 'address') {
        value = capitalizeFirstLetter(value)
    }
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
      const capitalizedValue = capitalizeFirstLetter(value.trim())
      if (!formData[field].includes(capitalizedValue)) {
          setFormData((prev: any) => ({
              ...prev,
              [field]: [...(prev[field] || []), capitalizedValue]
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
        <div className="flex gap-2">
            {jobPost.canRenew && (
                <Button onClick={handleRenew} disabled={isRenewing} variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700">
                    {isRenewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {t("jobs.manage.renewJob")}
                </Button>
            )}
            <Button onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("common.save")}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("jobs.views")}</p>
                        <h3 className="text-2xl font-bold">{jobPost.views}</h3>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
            </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsApplicationsOpen(true)}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("jobs.applications")}</p>
                        <h3 className="text-2xl font-bold">{jobPost.applicationsCount}</h3>
                    </div>
                    <Users className="h-8 w-8 text-primary opacity-20" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("firm.status")}</p>
                        <div className="flex gap-2 mt-1">
                            {jobPost.isDeleted ? (
                                <Badge variant="destructive">{t("jobs.manage.status.deleted")}</Badge>
                            ) : jobPost.isExpired ? (
                                <Badge variant="secondary">{t("jobs.manage.status.expired")}</Badge>
                            ) : (
                                <Badge className="bg-green-500">{t("jobs.manage.status.active")}</Badge>
                            )}
                        </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                        <p>{t("jobs.manage.postedDate")}{new Date(jobPost.postedDate).toLocaleDateString()}</p>
                        <p>{t("jobs.manage.expirationDate")}{new Date(jobPost.expirationDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{t("jobs.manage.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>{t("jobs.manage.title")} <span className="text-red-500">*</span></Label>
                    <Input value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t("jobs.manage.specialization")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.seniority")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.employmentType")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.workLocationType")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.country")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.county")} <span className="text-red-500">*</span></Label>
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
                        <Label>{t("jobs.manage.city")} <span className="text-red-500">*</span></Label>
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
                    <Input value={formData.location.address || ""} onChange={(e) => updateLocation("address", e.target.value)} />
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
                    <Label>{t("jobs.manage.richDescription")} <span className="text-red-500">*</span></Label>
                    <RichTextEditor 
                        value={formData.richDescription} 
                        onChange={(value) => updateField("richDescription", value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t("jobs.manage.applicationLink")}</Label>
                    <Input value={formData.applicationLink || ""} onChange={(e) => updateField("applicationLink", e.target.value)} />
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
                            onChange={(e) => setTechStackInput(capitalizeFirstLetter(e.target.value))}
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
                            onChange={(e) => setSoftSkillInput(capitalizeFirstLetter(e.target.value))}
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
                            onChange={(e) => setCertificationInput(capitalizeFirstLetter(e.target.value))}
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

      <Dialog open={isApplicationsOpen} onOpenChange={setIsApplicationsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{t("jobs.manage.applications.title")} ({jobPost.applicationsCount})</DialogTitle>
                <DialogDescription>
                    {t("jobs.manage.applications.description")}
                </DialogDescription>
            </DialogHeader>
            
            {loadingApplications ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : applications && applications.length > 0 ? (
                <div className="space-y-4 mt-4">
                    {applications.map((app: any) => (
                        <div key={app.personId} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={app.personAvatarUrl} />
                                <AvatarFallback>{app.personName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold cursor-pointer hover:underline" onClick={() => router.push(`/person/${app.personId}`)}>
                                            {app.personName}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{app.personHeadline}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {app.personResumeUrl && (
                                    <Button variant="link" className="h-auto p-0 mt-2 text-sm" onClick={() => window.open(app.personResumeUrl, '_blank')}>
                                        {t("jobs.manage.applications.viewResume")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    {t("jobs.manage.applications.noApplications")}
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
