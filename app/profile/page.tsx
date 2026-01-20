"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/lib/errors/form-input"
import { FormErrorProvider, useFormErrors } from "@/lib/errors/form-error-context"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Code,
  Languages,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Phone,
  Linkedin,
  LinkIcon,
  Calendar,
  Clock,
  Camera,
  FileText,
  Upload,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"
import {
  useProfile,
  useUpdateBasicInfo,
  useUpdateLocation,
  useUpdateSummary,
  useUpdatePreferences,
  useUpdateSkills,
  useUpdateLanguages,
  useAddWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  useAddCertification,
  useUpdateCertification,
  useDeleteCertification,
  useUploadCv,
  useUploadAvatar,
} from "@/lib/hooks/use-person"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"

// Types based on the DTOs provided
interface WorkExperience {
  id?: string
  jobTitle: string
  companyName: string
  startDate: string
  endDate?: string | null
  isCurrentRole: boolean
  description: string
}

interface Education {
  id?: string
  institution: string
  degree: string
  startDate: string
  graduationDate?: string | null
  description: string
}

interface Certification {
  id?: string
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string | null
  credentialId: string
  credentialUrl: string
}

function ProfileContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  
  // React Query Hooks
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()
  
  const updateBasicInfo = useUpdateBasicInfo()
  const updateLocation = useUpdateLocation()
  const updateSummary = useUpdateSummary()
  const updatePreferences = useUpdatePreferences()
  const updateSkills = useUpdateSkills()
  const updateLanguages = useUpdateLanguages()
  
  const addWorkExperience = useAddWorkExperience()
  const updateWorkExperience = useUpdateWorkExperience()
  const deleteWorkExperience = useDeleteWorkExperience()
  
  const addEducation = useAddEducation()
  const updateEducation = useUpdateEducation()
  const deleteEducation = useDeleteEducation()
  
  const addCertification = useAddCertification()
  const updateCertification = useUpdateCertification()
  const deleteCertification = useDeleteCertification()
  
  const uploadCv = useUploadCv()
  const uploadAvatar = useUploadAvatar()

  // Edit states
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false)
  const [isEditingSummary, setIsEditingSummary] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [isEditingLanguages, setIsEditingLanguages] = useState(false)

  // Form states
  const [basicInfoForm, setBasicInfoForm] = useState({
    firstName: "",
    lastName: "",
    contactEmail: "",
    phoneNumber: "",
    headline: "",
    portfolioUrl: "",
    linkedInUrl: "",
  })

  const [summaryForm, setSummaryForm] = useState("")

  const [preferencesForm, setPreferencesForm] = useState({
    isOpenToRemote: false,
    availabilityTimeSpanInDays: 0,
  })

  const [skillsForm, setSkillsForm] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const [languagesForm, setLanguagesForm] = useState<string[]>([])
  const [newLanguage, setNewLanguage] = useState("")

  // Location data
  const [locationForm, setLocationForm] = useState({
    countryId: "",
    countyId: "",
    cityId: "",
  })
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  
  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(locationForm.countryId)
  const { data: cities = [] } = useCities(locationForm.countyId)

  // Dialog states for adding/editing items
  const [workExperienceDialogOpen, setWorkExperienceDialogOpen] = useState(false)
  const [currentWorkExperience, setCurrentWorkExperience] = useState<WorkExperience | null>(null)

  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null)

  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false)
  const [currentCertification, setCurrentCertification] = useState<Certification | null>(null)

  // Avatar Upload
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const [cvUploadDisabled, setCvUploadDisabled] = useState(false)

  const { setError, clearError } = useFormErrors()

  useEffect(() => {
    if (authLoading) return

    if (!userInfo) {
      router.push("/login")
      return
    }

    if (userInfo.hasFirm) {
      if (userInfo.firmId) {
        router.push("/firm/manage")
      } else {
        router.push("/firm/create")
      }
      return
    }

    if (!userInfo.personId) {
      router.push("/person/create")
      return
    }
  }, [authLoading, userInfo, router])

  useEffect(() => {
    if (profile) {
      // Initialize forms
      setBasicInfoForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        contactEmail: profile.contactEmail || "",
        phoneNumber: profile.phoneNumber || "",
        headline: profile.headline || "",
        portfolioUrl: profile.portfolioUrl || "",
        linkedInUrl: profile.linkedInUrl || "",
      })

      setSummaryForm(profile.summary || "")

      setPreferencesForm({
        isOpenToRemote: profile.isOpenToRemote || false,
        availabilityTimeSpanInDays: profile.availabilityTimeSpanInDays || 0,
      })

      setSkillsForm(profile.skills || [])
      setLanguagesForm(profile.languages || [])

      if (profile.location) {
        setLocationForm({
          countryId: profile.location.countryId || "",
          countyId: profile.location.countyId || "",
          cityId: profile.location.cityId || "",
        })
      }
    }
  }, [profile])

  useEffect(() => {
      if (profileError) {
          toast({
            title: t("common.error"),
            description: t("profile.loadError"),
            variant: "destructive",
          })
      }
  }, [profileError, t, toast])

  // --- Update Handlers ---

  const handleUpdateBasicInfo = () => {
    clearError()
    updateBasicInfo.mutate(basicInfoForm, {
        onSuccess: () => {
            setIsEditingBasicInfo(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  const handleUpdateLocation = () => {
    clearError()
    updateLocation.mutate(locationForm, {
        onSuccess: () => {
            setIsEditingLocation(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  const handleUpdateSummary = () => {
    clearError()
    updateSummary.mutate({ summary: summaryForm }, {
        onSuccess: () => {
            setIsEditingSummary(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  const handleUpdatePreferences = () => {
    clearError()
    updatePreferences.mutate(preferencesForm, {
        onSuccess: () => {
            setIsEditingPreferences(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  const handleUpdateSkills = () => {
    clearError()
    updateSkills.mutate(skillsForm, {
        onSuccess: () => {
            setIsEditingSkills(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  const handleUpdateLanguages = () => {
    clearError()
    updateLanguages.mutate(languagesForm, {
        onSuccess: () => {
            setIsEditingLanguages(false)
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            setError(error)
            if (error.detail) {
                toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
            } else {
                toast({ title: t("common.error"), description: error.message, variant: "destructive" })
            }
        }
    })
  }

  // --- Work Experience Handlers ---

  const handleSaveWorkExperience = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWorkExperience) return
    clearError()

    if (currentWorkExperience.id) {
        updateWorkExperience.mutate(currentWorkExperience, {
            onSuccess: () => {
                setWorkExperienceDialogOpen(false)
                setCurrentWorkExperience(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    } else {
        addWorkExperience.mutate(currentWorkExperience, {
            onSuccess: () => {
                setWorkExperienceDialogOpen(false)
                setCurrentWorkExperience(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    }
  }

  const handleDeleteWorkExperience = (id: string) => {
    deleteWorkExperience.mutate(id, {
        onSuccess: () => {
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            toast({ title: t("common.error"), description: error.message, variant: "destructive" })
        }
    })
  }

  // --- Education Handlers ---

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEducation) return
    clearError()

    if (currentEducation.id) {
        updateEducation.mutate(currentEducation, {
            onSuccess: () => {
                setEducationDialogOpen(false)
                setCurrentEducation(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    } else {
        addEducation.mutate(currentEducation, {
            onSuccess: () => {
                setEducationDialogOpen(false)
                setCurrentEducation(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    }
  }

  const handleDeleteEducation = (id: string) => {
    deleteEducation.mutate(id, {
        onSuccess: () => {
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            toast({ title: t("common.error"), description: error.message, variant: "destructive" })
        }
    })
  }

  // --- Certification Handlers ---

  const handleSaveCertification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCertification) return
    clearError()

    if (currentCertification.id) {
        updateCertification.mutate(currentCertification, {
            onSuccess: () => {
                setCertificationDialogOpen(false)
                setCurrentCertification(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    } else {
        addCertification.mutate(currentCertification, {
            onSuccess: () => {
                setCertificationDialogOpen(false)
                setCurrentCertification(null)
                toast({ title: t("common.success"), description: t("profile.updateSuccess") })
            },
            onError: (error: any) => {
                setError(error)
                if (error.detail) {
                    toast({ title: t("common.error"), description: error.detail, variant: "destructive" })
                } else {
                    toast({ title: t("common.error"), description: error.message, variant: "destructive" })
                }
            }
        })
    }
  }

  const handleDeleteCertification = (id: string) => {
    deleteCertification.mutate(id, {
        onSuccess: () => {
            toast({ title: t("common.success"), description: t("profile.updateSuccess") })
        },
        onError: (error: any) => {
            toast({ title: t("common.error"), description: error.message, variant: "destructive" })
        }
    })
  }

  // --- Avatar Handlers ---

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => setAvatarImage(reader.result as string))
      reader.readAsDataURL(e.target.files[0])
      setAvatarDialogOpen(true)
    }
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        resolve(blob)
      }, "image/jpeg")
    })
  }

  const handleSaveAvatar = async () => {
    if (!avatarImage || !croppedAreaPixels) return

    try {
      const croppedImageBlob = await getCroppedImg(avatarImage, croppedAreaPixels)
      const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" })

      uploadAvatar.mutate(file, {
          onSuccess: () => {
              setAvatarDialogOpen(false)
              setAvatarImage(null)
              toast({ title: t("common.success"), description: t("profile.updateSuccess") })
          },
          onError: (error: any) => {
              console.error(error)
              toast({ title: t("common.error"), description: error.message || "Failed to upload avatar", variant: "destructive" })
          }
      })
    } catch (error: any) {
      console.error(error)
      toast({ title: t("common.error"), description: error.message || "Failed to upload avatar", variant: "destructive" })
    }
  }

  // --- CV Handlers ---

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cvUploadDisabled) {
        toast({
            title: t("common.info"),
            description: t("profile.cvWait"),
        })
        return
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      uploadCv.mutate(file, {
          onSuccess: (data: any) => {
              // Check for both string "Scanning" and enum value 0
              if (data.status === "Scanning" || data.status === 0) {
                toast({
                  title: t("common.info"),
                  description: t("profile.cvScanning"),
                })
                
                // Disable upload for 30 seconds
                setCvUploadDisabled(true)
                setTimeout(() => setCvUploadDisabled(false), 30000)
              } else {
                toast({
                  title: t("common.success"),
                  description: t("profile.cvUploadSuccess"),
                })
              }
          },
          onError: (error: any) => {
              console.error(error)
              toast({
                title: t("common.error"),
                description: error.message || "Failed to upload CV",
                variant: "destructive",
              })
          }
      })
    }
  }

  if (authLoading || profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-t-3xl" />
        <Card className="border-0 shadow-xl -mt-24 mx-4 sm:mx-8 relative overflow-hidden backdrop-blur-sm bg-white/95">
          <CardContent className="pt-6 sm:pt-8 pb-8 px-6 sm:px-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    {uploadAvatar.isPending ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    ) : (
                        <Camera className="h-8 w-8 text-white" />
                    )}
                  </div>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onSelectFile}
                  accept="image/png, image/jpeg"
                  className="hidden"
                  disabled={uploadAvatar.isPending}
                />
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    {isEditingBasicInfo ? (
                      <div className="space-y-4 w-full max-w-md">
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            id="firstName"
                            label={t("profile.firstName")}
                            value={basicInfoForm.firstName}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, firstName: e.target.value })}
                          />
                          <FormInput
                            id="lastName"
                            label={t("profile.lastName")}
                            value={basicInfoForm.lastName}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, lastName: e.target.value })}
                          />
                        </div>
                        <FormInput
                          id="headline"
                          label={t("profile.headline")}
                          value={basicInfoForm.headline}
                          onChange={(e) => setBasicInfoForm({ ...basicInfoForm, headline: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            id="contactEmail"
                            label={t("profile.contactEmail")}
                            value={basicInfoForm.contactEmail}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, contactEmail: e.target.value })}
                          />
                          <FormInput
                            id="phoneNumber"
                            label={t("profile.phone")}
                            value={basicInfoForm.phoneNumber}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, phoneNumber: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            id="linkedInUrl"
                            label={t("person.linkedInUrl")}
                            value={basicInfoForm.linkedInUrl}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, linkedInUrl: e.target.value })}
                          />
                          <FormInput
                            id="portfolioUrl"
                            label={t("person.portfolioUrl")}
                            value={basicInfoForm.portfolioUrl}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, portfolioUrl: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateBasicInfo} disabled={updateBasicInfo.isPending}>
                            <Save className="h-4 w-4 mr-2" />
                            {t("common.save")}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsEditingBasicInfo(false)}>
                            <X className="h-4 w-4 mr-2" />
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        <p className="text-xl text-primary font-medium mt-1">{profile.headline}</p>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                          {profile.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {isEditingLocation ? (
                                <div className="flex gap-2 items-center">
                                  <Select
                                    value={locationForm.countryId}
                                    onValueChange={(val) => {
                                      setLocationForm({ ...locationForm, countryId: val, countyId: "", cityId: "" })
                                    }}
                                  >
                                    <SelectTrigger className="w-[120px] h-8">
                                      <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {countries.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                          {c.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={locationForm.countyId}
                                    onValueChange={(val) => {
                                      setLocationForm({ ...locationForm, countyId: val, cityId: "" })
                                    }}
                                    disabled={!locationForm.countryId}
                                  >
                                    <SelectTrigger className="w-[120px] h-8">
                                      <SelectValue placeholder="County" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {counties.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                          {c.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={locationForm.cityId}
                                    onValueChange={(val) => setLocationForm({ ...locationForm, cityId: val })}
                                    disabled={!locationForm.countyId}
                                  >
                                    <SelectTrigger className="w-[120px] h-8">
                                      <SelectValue placeholder="City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {cities.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                          {c.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleUpdateLocation} disabled={updateLocation.isPending}>
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => setIsEditingLocation(false)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span
                                  className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                                  onClick={() => setIsEditingLocation(true)}
                                >
                                  {cities.find((c: any) => c.id === profile.location.cityId)?.name || "City"},{" "}
                                  {countries.find((c: any) => c.id === profile.location.countryId)?.name || "Country"}
                                  <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                              )}
                            </div>
                          )}
                          {profile.contactEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {profile.contactEmail}
                            </div>
                          )}
                          {profile.phoneNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {profile.phoneNumber}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {!isEditingBasicInfo && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingBasicInfo(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t("common.edit")}
                    </Button>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {profile.linkedInUrl && (
                    <a
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-primary" />
                  {t("profile.about")}
                </CardTitle>
                {!isEditingSummary && (
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingSummary(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditingSummary ? (
                  <div className="space-y-4">
                    <Textarea
                      value={summaryForm}
                      onChange={(e) => setSummaryForm(e.target.value)}
                      className="min-h-[150px]"
                      placeholder={t("profile.summaryPlaceholder")}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingSummary(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={handleUpdateSummary} disabled={updateSummary.isPending}>
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {profile.summary || t("profile.noSummary")}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t("profile.experience")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentWorkExperience({
                      jobTitle: "",
                      companyName: "",
                      startDate: "",
                      endDate: "",
                      isCurrentRole: false,
                      description: "",
                    })
                    setWorkExperienceDialogOpen(true)
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                {profile.workHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t("profile.noExperience")}</p>
                ) : (
                  <div className="flex flex-col">
                    {profile.workHistory.map((job, index) => (
                      <div key={job.id || index} className="relative pl-6 pb-8 last:pb-0">
                        {index !== profile.workHistory.length - 1 && (
                          <div className="absolute left-0 top-[22px] -bottom-[6px] w-[2px] bg-primary/20 -translate-x-1/2" />
                        )}
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary/20 border-2 border-primary -translate-x-1/2" />
                        <div className="flex justify-between items-start group">
                          <div>
                            <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                            <div className="text-primary font-medium">{job.companyName}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(job.startDate).toLocaleDateString()} -{" "}
                              {job.isCurrentRole ? t("common.present") : new Date(job.endDate!).toLocaleDateString()}
                            </div>
                            <p className="mt-2 text-muted-foreground text-sm whitespace-pre-wrap">{job.description}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setCurrentWorkExperience(job)
                                setWorkExperienceDialogOpen(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteWorkExperience(job.id!)}
                              disabled={deleteWorkExperience.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {t("profile.education")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentEducation({
                      institution: "",
                      degree: "",
                      startDate: "",
                      graduationDate: "",
                      description: "",
                    })
                    setEducationDialogOpen(true)
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                {profile.educationHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t("profile.noEducation")}</p>
                ) : (
                  <div className="flex flex-col">
                    {profile.educationHistory.map((edu, index) => (
                      <div key={edu.id || index} className="relative pl-6 pb-8 last:pb-0">
                        {index !== profile.educationHistory.length - 1 && (
                          <div className="absolute left-0 top-[22px] -bottom-[6px] w-[2px] bg-primary/20 -translate-x-1/2" />
                        )}
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary/20 border-2 border-primary -translate-x-1/2" />
                        <div className="flex justify-between items-start group">
                          <div>
                            <h3 className="font-semibold text-lg">{edu.institution}</h3>
                            <div className="text-primary font-medium">{edu.degree}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(edu.startDate).toLocaleDateString()} -{" "}
                              {edu.graduationDate ? new Date(edu.graduationDate).toLocaleDateString() : t("common.present")}
                            </div>
                            <p className="mt-2 text-muted-foreground text-sm whitespace-pre-wrap">{edu.description}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setCurrentEducation(edu)
                                setEducationDialogOpen(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteEducation(edu.id!)}
                              disabled={deleteEducation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* CV Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  CV
                </CardTitle>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => cvInputRef.current?.click()} disabled={cvUploadDisabled || uploadCv.isPending}>
                    {uploadCv.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" /> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input
                    type="file"
                    ref={cvInputRef}
                    onChange={handleCvUpload}
                    accept=".pdf"
                    className="hidden"
                    disabled={cvUploadDisabled || uploadCv.isPending}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {profile.resumeUrl || profile.cvUrl ? (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm truncate">{t("profile.myCv")}</span>
                    </div>
                    <a
                      href={profile.resumeUrl || profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline whitespace-nowrap ml-2"
                    >
                      {t("common.view")}
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed rounded-lg border-muted-foreground/25">
                    <p className="text-sm text-muted-foreground mb-2">{t("profile.noCv")}</p>
                    <Button variant="outline" size="sm" onClick={() => cvInputRef.current?.click()} disabled={cvUploadDisabled || uploadCv.isPending}>
                      {t("profile.uploadCv")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  {t("profile.preferences")}
                </CardTitle>
                {!isEditingPreferences && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingPreferences(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditingPreferences ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="remote">{t("profile.openToRemote")}</Label>
                      <Switch
                        id="remote"
                        checked={preferencesForm.isOpenToRemote}
                        onCheckedChange={(checked) =>
                          setPreferencesForm({ ...preferencesForm, isOpenToRemote: checked })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">{t("profile.availability")}</Label>
                      <Select
                        value={preferencesForm.availabilityTimeSpanInDays.toString()}
                        onValueChange={(val) =>
                          setPreferencesForm({ ...preferencesForm, availabilityTimeSpanInDays: Number.parseInt(val) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">{t("profile.immediate")}</SelectItem>
                          <SelectItem value="14">2 {t("common.weeks")}</SelectItem>
                          <SelectItem value="30">1 {t("common.month")}</SelectItem>
                          <SelectItem value="60">2 {t("common.months")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingPreferences(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={handleUpdatePreferences} disabled={updatePreferences.isPending}>
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("profile.openToRemote")}</span>
                      <Badge variant={profile.isOpenToRemote ? "default" : "secondary"}>
                        {profile.isOpenToRemote ? t("common.yes") : t("common.no")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("profile.availability")}</span>
                      <span className="font-medium">
                        {profile.availabilityTimeSpanInDays === 0
                          ? t("profile.immediate")
                          : `${profile.availabilityTimeSpanInDays} ${t("common.days")}`}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5 text-primary" />
                  {t("profile.skills")}
                </CardTitle>
                {!isEditingSkills && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingSkills(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditingSkills ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <FormInput
                        id="newSkill"
                        label=""
                        placeholder={t("profile.addSkill")}
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (newSkill.trim()) {
                              setSkillsForm([...skillsForm, newSkill.trim()])
                              setNewSkill("")
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          if (newSkill.trim()) {
                            setSkillsForm([...skillsForm, newSkill.trim()])
                            setNewSkill("")
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsForm.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => setSkillsForm(skillsForm.filter((_, i) => i !== index))}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingSkills(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={handleUpdateSkills} disabled={updateSkills.isPending}>
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("profile.noSkills")}</p>
                    ) : (
                      profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {skill}
                        </Badge>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Languages className="h-5 w-5 text-primary" />
                  {t("profile.languages")}
                </CardTitle>
                {!isEditingLanguages && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingLanguages(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditingLanguages ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <FormInput
                        id="newLanguage"
                        label=""
                        placeholder={t("profile.addLanguage")}
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (newLanguage.trim()) {
                              setLanguagesForm([...languagesForm, newLanguage.trim()])
                              setNewLanguage("")
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          if (newLanguage.trim()) {
                            setLanguagesForm([...languagesForm, newLanguage.trim()])
                            setNewLanguage("")
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {languagesForm.map((lang, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {lang}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => setLanguagesForm(languagesForm.filter((_, i) => i !== index))}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingLanguages(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={handleUpdateLanguages} disabled={updateLanguages.isPending}>
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("profile.noLanguages")}</p>
                    ) : (
                      profile.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  {t("profile.certifications")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setCurrentCertification({
                      name: "",
                      issuingOrganization: "",
                      issueDate: "",
                      expirationDate: "",
                      credentialId: "",
                      credentialUrl: "",
                    })
                    setCertificationDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.certifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("profile.noCertifications")}</p>
                ) : (
                  profile.certifications.map((cert, index) => (
                    <div key={cert.id || index} className="group relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("common.issued")}: {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setCurrentCertification(cert)
                              setCertificationDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteCertification(cert.id!)}
                            disabled={deleteCertification.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          {t("profile.viewCredential")}
                        </a>
                      )}
                      {index < profile.certifications.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={workExperienceDialogOpen} onOpenChange={setWorkExperienceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentWorkExperience?.id ? t("profile.editExperience") : t("profile.addExperience")}
            </DialogTitle>
          </DialogHeader>
          {currentWorkExperience && (
            <form onSubmit={handleSaveWorkExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="jobTitle"
                  label={t("profile.jobTitle")}
                  value={currentWorkExperience.jobTitle}
                  onChange={(e) => setCurrentWorkExperience({ ...currentWorkExperience, jobTitle: e.target.value })}
                  required
                />
                <FormInput
                  id="companyName"
                  label={t("profile.company")}
                  value={currentWorkExperience.companyName}
                  onChange={(e) => setCurrentWorkExperience({ ...currentWorkExperience, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="startDate"
                  label={t("profile.startDate")}
                  type="date"
                  value={currentWorkExperience.startDate}
                  onChange={(e) => setCurrentWorkExperience({ ...currentWorkExperience, startDate: e.target.value })}
                  required
                />
                <div className="space-y-2">
                  <FormInput
                    id="endDate"
                    label={t("profile.endDate")}
                    type="date"
                    value={currentWorkExperience.endDate || ""}
                    onChange={(e) => setCurrentWorkExperience({ ...currentWorkExperience, endDate: e.target.value })}
                    disabled={currentWorkExperience.isCurrentRole}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="currentRole"
                      checked={currentWorkExperience.isCurrentRole}
                      onCheckedChange={(checked) =>
                        setCurrentWorkExperience({
                          ...currentWorkExperience,
                          isCurrentRole: checked,
                          endDate: checked ? null : currentWorkExperience.endDate,
                        })
                      }
                    />
                    <Label htmlFor="currentRole">{t("profile.currentRole")}</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("profile.description")}</Label>
                <Textarea
                  id="description"
                  value={currentWorkExperience.description || ""}
                  onChange={(e) => setCurrentWorkExperience({ ...currentWorkExperience, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setWorkExperienceDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={addWorkExperience.isPending || updateWorkExperience.isPending}>{t("common.save")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentEducation?.id ? t("profile.editEducation") : t("profile.addEducation")}</DialogTitle>
          </DialogHeader>
          {currentEducation && (
            <form onSubmit={handleSaveEducation} className="space-y-4">
              <FormInput
                id="institution"
                label={t("profile.institution")}
                value={currentEducation.institution}
                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                required
              />
              <FormInput
                id="degree"
                label={t("profile.degree")}
                value={currentEducation.degree}
                onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="eduStartDate"
                  label={t("profile.startDate")}
                  type="date"
                  value={currentEducation.startDate}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, startDate: e.target.value })}
                  required
                />
                <FormInput
                  id="graduationDate"
                  label={t("profile.graduationDate")}
                  type="date"
                  value={currentEducation.graduationDate || ""}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, graduationDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eduDescription">{t("profile.description")}</Label>
                <Textarea
                  id="eduDescription"
                  value={currentEducation.description || ""}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEducationDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={addEducation.isPending || updateEducation.isPending}>{t("common.save")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentCertification?.id ? t("profile.editCertification") : t("profile.addCertification")}
            </DialogTitle>
          </DialogHeader>
          {currentCertification && (
            <form onSubmit={handleSaveCertification} className="space-y-4">
              <FormInput
                id="certName"
                label={t("profile.certificationName")}
                value={currentCertification.name}
                onChange={(e) => setCurrentCertification({ ...currentCertification, name: e.target.value })}
                required
              />
              <FormInput
                id="issuingOrg"
                label={t("profile.issuingOrganization")}
                value={currentCertification.issuingOrganization}
                onChange={(e) =>
                  setCurrentCertification({ ...currentCertification, issuingOrganization: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="issueDate"
                  label={t("profile.issueDate")}
                  type="date"
                  value={currentCertification.issueDate}
                  onChange={(e) => setCurrentCertification({ ...currentCertification, issueDate: e.target.value })}
                  required
                />
                <FormInput
                  id="expirationDate"
                  label={t("profile.expirationDate")}
                  type="date"
                  value={currentCertification.expirationDate || ""}
                  onChange={(e) => setCurrentCertification({ ...currentCertification, expirationDate: e.target.value })}
                />
              </div>
              <FormInput
                id="credentialId"
                label={t("profile.credentialId")}
                value={currentCertification.credentialId || ""}
                onChange={(e) => setCurrentCertification({ ...currentCertification, credentialId: e.target.value })}
              />
              <FormInput
                id="credentialUrl"
                label={t("profile.credentialUrl")}
                value={currentCertification.credentialUrl || ""}
                onChange={(e) => setCurrentCertification({ ...currentCertification, credentialUrl: e.target.value })}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCertificationDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={addCertification.isPending || updateCertification.isPending}>{t("common.save")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t("common.addImage")}</DialogTitle>
          </DialogHeader>
          <div className="relative h-[500px] w-full bg-black/5 rounded-lg overflow-hidden">
            {avatarImage && (
              <Cropper
                image={avatarImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                className="flex-1"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveAvatar} disabled={uploadAvatar.isPending}>{t("common.save")}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <FormErrorProvider>
      <ProfileContent />
    </FormErrorProvider>
  )
}
