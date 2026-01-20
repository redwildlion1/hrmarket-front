"use client"

import React, { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/client"
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
  Plus,
  Briefcase,
  CalendarPlus,
  Upload,
  MapPin,
  Pencil,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  ShieldCheck,
  Check,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  useMyFirm,
  useUpdateFirmMedia,
  useUpdateFirmLocation,
  useUpdateFirmContact,
  useUpdateFirmLinks,
  useUpdateFirmDescription,
  useUpdateFirmType,
  useFirmTypes,
  useSubmitFirmForVerification,
  useUpdateUniversalAnswers,
} from "@/lib/hooks/use-firms"
import { useCountries, useCounties, useCities } from "@/lib/hooks/use-location"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { FormInput } from "@/components/ui/form-input"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"

function FirmManageContent() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const { data: firm, isLoading: firmLoading, error: firmError } = useMyFirm()
  const { mutate: updateMedia, isPending: isUploading } = useUpdateFirmMedia()
  const { mutate: updateLocation, isPending: isUpdatingLocation } = useUpdateFirmLocation()
  const { mutate: updateContact, isPending: isUpdatingContact } = useUpdateFirmContact()
  const { mutate: updateLinks, isPending: isUpdatingLinks } = useUpdateFirmLinks()
  const { mutate: updateDescription, isPending: isUpdatingDescription } = useUpdateFirmDescription()
  const { mutate: updateType, isPending: isUpdatingType } = useUpdateFirmType()
  const { mutate: submitForVerification, isPending: isSubmittingVerification } = useSubmitFirmForVerification()
  const { mutate: updateUniversalAnswers, isPending: isUpdatingUniversalAnswers } = useUpdateUniversalAnswers()
  const { data: firmTypesData } = useFirmTypes()

  const { data: countries = [] } = useCountries()
  const { data: counties = [] } = useCounties(firm?.location?.countryId || "")
  const { data: cities = [] } = useCities(firm?.location?.countyId || "")

  const { setError, clearError } = useFormErrors()

  // State for edit dialogs
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isLinksDialogOpen, setIsLinksDialogOpen] = useState(false)
  const [isBasicInfoDialogOpen, setIsBasicInfoDialogOpen] = useState(false)
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [isUniversalAnswersDialogOpen, setIsUniversalAnswersDialogOpen] = useState(false)
  const [isSubmitVerificationDialogOpen, setIsSubmitVerificationDialogOpen] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  // State for form data
  const [locationForm, setLocationForm] = useState({
    address: "",
    countryId: "",
    countyId: "",
    cityId: "",
    postalCode: "",
  })
  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
  })
  const [linksForm, setLinksForm] = useState({
    website: "",
    linkedIn: "",
    facebook: "",
    twitter: "",
    instagram: "",
  })
  const [basicInfoForm, setBasicInfoForm] = useState({
    type: "",
  })
  const [descriptionForm, setDescriptionForm] = useState({
    description: "",
  })
  const [universalAnswersForm, setUniversalAnswersForm] = useState<Record<string, string>>({})

  // Image Upload States
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageType, setImageType] = useState<"logo" | "banner">("logo")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  // Location hooks for the edit form
  const { data: editCounties = [] } = useCounties(locationForm.countryId)
  const { data: editCities = [] } = useCities(locationForm.countyId)

  const firmTypes = firmTypesData?.[language === "ro" ? "ro" : "en"] || firmTypesData?.["ro"] || []

  useEffect(() => {
    if (authLoading) return

    if (!userInfo) {
      router.push("/login")
      return
    }

    if (!userInfo?.hasFirm || !userInfo?.firmId) {
      router.push("/profile")
      return
    }
  }, [authLoading, userInfo, router])

  useEffect(() => {
    if (firmError) {
      console.error("[v0] Error loading firm:", firmError)
      setError(firmError)
      toast({
        title: t("common.error"),
        description: t("firm.loadError"),
        variant: "destructive",
      })
    }
  }, [firmError, setError, t, toast])

  // Initialize forms when firm data is loaded
  useEffect(() => {
    if (firm) {
      setLocationForm({
        address: firm.location?.address || "",
        countryId: firm.location?.countryId || "",
        countyId: firm.location?.countyId || "",
        cityId: firm.location?.cityId || "",
        postalCode: firm.location?.postalCode || "",
      })
      setContactForm({
        phone: firm.contact?.phone || "",
        email: firm.contact?.email || "",
      })
      setLinksForm({
        website: firm.links?.website || "",
        linkedIn: firm.links?.linkedIn || "",
        facebook: firm.links?.facebook || "",
        twitter: firm.links?.twitter || "",
        instagram: firm.links?.instagram || "",
      })
      setBasicInfoForm({
        type: firm.type || "",
      })
      setDescriptionForm({
        description: firm.description || "",
      })
      
      // Initialize universal answers form
      const answers: Record<string, string> = {}
      firm.universalAnswers?.forEach((answer: any) => {
        if (answer.universalQuestion?.id && answer.selectedOptionId) {
          answers[answer.universalQuestion.id] = answer.selectedOptionId
        }
      })
      setUniversalAnswersForm(answers)
    }
  }, [firm])

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

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => setImageSrc(reader.result as string))
      reader.readAsDataURL(e.target.files[0])
      setImageType(type)
      setImageDialogOpen(true)
      // Reset input value so the same file can be selected again if needed
      e.target.value = ""
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

  const handleSaveImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !firm) return

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([croppedImageBlob], `${imageType}.jpg`, { type: "image/jpeg" })

      updateMedia(
        { type: imageType, file },
        {
          onSuccess: () => {
            setImageDialogOpen(false)
            setImageSrc(null)
            toast({
              title: t("common.success"),
              description: `${imageType === "logo" ? "Logo" : "Banner"} uploaded successfully.`,
            })
          },
          onError: (error: any) => {
            console.error(`Error uploading ${imageType}:`, error)
            toast({
              title: t("common.error"),
              description: `Failed to upload ${imageType}.`,
              variant: "destructive",
            })
          },
        },
      )
    } catch (error: any) {
      console.error(error)
      toast({
        title: t("common.error"),
        description: `Failed to process ${imageType}.`,
        variant: "destructive",
      })
    }
  }

  const handleUpdateLocation = () => {
    clearError()
    updateLocation(locationForm, {
      onSuccess: () => {
        setIsLocationDialogOpen(false)
        toast({
          title: t("common.success"),
          description: "Location updated successfully.",
        })
      },
      onError: (error: any) => {
        console.error("Error updating location:", error)
        setError(error)
        if (error.detail) {
            toast({
                title: t("common.error"),
                description: error.detail,
                variant: "destructive",
            })
        } else {
            toast({
                title: t("common.error"),
                description: "Failed to update location.",
                variant: "destructive",
            })
        }
      },
    })
  }

  const handleUpdateContact = () => {
    clearError()
    updateContact(contactForm, {
      onSuccess: () => {
        setIsContactDialogOpen(false)
        toast({
          title: t("common.success"),
          description: "Contact updated successfully.",
        })
      },
      onError: (error: any) => {
        console.error("Error updating contact:", error)
        setError(error)
        if (error.detail) {
            toast({
                title: t("common.error"),
                description: error.detail,
                variant: "destructive",
            })
        } else {
            toast({
                title: t("common.error"),
                description: "Failed to update contact.",
                variant: "destructive",
            })
        }
      },
    })
  }

  const handleUpdateLinks = () => {
    clearError()
    updateLinks(linksForm, {
      onSuccess: () => {
        setIsLinksDialogOpen(false)
        toast({
          title: t("common.success"),
          description: "Links updated successfully.",
        })
      },
      onError: (error: any) => {
        console.error("Error updating links:", error)
        setError(error)
        if (error.detail) {
            toast({
                title: t("common.error"),
                description: error.detail,
                variant: "destructive",
            })
        } else {
            toast({
                title: t("common.error"),
                description: "Failed to update links.",
                variant: "destructive",
            })
        }
      },
    })
  }

  const handleUpdateBasicInfo = () => {
    clearError()
    if (basicInfoForm.type !== firm?.type) {
      updateType(
        { type: basicInfoForm.type },
        {
          onSuccess: () => {
            setIsBasicInfoDialogOpen(false)
            toast({
              title: t("common.success"),
              description: "Type updated successfully.",
            })
          },
          onError: (error: any) => {
            console.error("Error updating type:", error)
            setError(error)
            if (error.detail) {
                toast({
                    title: t("common.error"),
                    description: error.detail,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: t("common.error"),
                    description: "Failed to update type.",
                    variant: "destructive",
                })
            }
          },
        },
      )
    } else {
        setIsBasicInfoDialogOpen(false)
    }
  }

  const handleUpdateDescription = () => {
    clearError()
    if (descriptionForm.description !== firm?.description) {
      updateDescription(
        { description: descriptionForm.description },
        {
          onSuccess: () => {
            setIsDescriptionDialogOpen(false)
            toast({
              title: t("common.success"),
              description: "Description updated successfully.",
            })
          },
          onError: (error: any) => {
            console.error("Error updating description:", error)
            setError(error)
            if (error.detail) {
                toast({
                    title: t("common.error"),
                    description: error.detail,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: t("common.error"),
                    description: "Failed to update description.",
                    variant: "destructive",
                })
            }
          },
        },
      )
    } else {
        setIsDescriptionDialogOpen(false)
    }
  }

  const handleUpdateUniversalAnswers = () => {
    clearError()
    
    // Check if all questions are answered
    const allQuestions = firm?.universalAnswers || []
    const answeredQuestions = Object.keys(universalAnswersForm)
    
    // We need to check if all questions that are available in the firm object are answered
    // Note: firm.universalAnswers contains the questions associated with the firm
    const unansweredQuestions = allQuestions.filter(q => 
        q.universalQuestion?.id && !universalAnswersForm[q.universalQuestion.id]
    )

    if (unansweredQuestions.length > 0) {
        toast({
            title: t("common.validationError"),
            description: "Please answer all questions before saving.",
            variant: "destructive",
        })
        return
    }

    const answers = Object.entries(universalAnswersForm).map(([questionId, optionId]) => ({
        universalQuestionId: questionId,
        selectedOptionId: optionId
    }))

    updateUniversalAnswers(
        { answers },
        {
            onSuccess: () => {
                setIsUniversalAnswersDialogOpen(false)
                toast({
                    title: t("common.success"),
                    description: "Company profile updated successfully.",
                })
            },
            onError: (error: any) => {
                console.error("Error updating universal answers:", error)
                setError(error)
                if (error.detail) {
                    toast({
                        title: t("common.error"),
                        description: error.detail,
                        variant: "destructive",
                    })
                } else {
                    toast({
                        title: t("common.error"),
                        description: "Failed to update company profile.",
                        variant: "destructive",
                    })
                }
            },
        }
    )
  }

  const handleSubmitForVerification = () => {
    submitForVerification(undefined, {
      onSuccess: () => {
        setShowSuccessAnimation(true)
        setTimeout(() => {
            setShowSuccessAnimation(false)
            setIsSubmitVerificationDialogOpen(false)
            toast({
                title: t("common.success"),
                description: t("firm.submittedForVerification"),
            })
        }, 2000)
      },
      onError: (error: any) => {
        console.error("Error submitting for verification:", error)
        toast({
          title: t("common.error"),
          description: error.detail || t("firm.submitError"),
          variant: "destructive",
        })
      },
    })
  }

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

  const getStatusKey = (status: string | number) => {
    if (typeof status === "number") {
      switch (status) {
        case 0:
          return "Draft"
        case 1:
          return "AwaitingReview"
        case 2:
          return "Approved"
        case 3:
          return "Rejected"
        case 4:
          return "Suspended"
        case 5:
          return "Trusted"
        default:
          return String(status)
      }
    }
    return status
  }

  const getStatusBadge = (status: string | number) => {
    const statusKey = getStatusKey(status)

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
        return (
          <Badge variant="outline" className="flex-shrink-0">
            {statusKey}
          </Badge>
        )
    }
  }

  const handleActionClick = (action: () => void) => {
    const statusKey = getStatusKey(firm.status)

    if (statusKey === "Approved" || statusKey === "Trusted") {
      action()
      return
    }

    if (statusKey === "Draft") {
      setIsVerificationDialogOpen(true)
      return
    }

    let message = t("firm.actionRestricted.default")
    if (statusKey === "AwaitingReview") {
      message = t("firm.actionRestricted.awaitingReview")
    } else if (statusKey === "Rejected") {
      message = t("firm.actionRestricted.rejected")
    } else if (statusKey === "Suspended") {
      message = t("firm.actionRestricted.suspended")
    }

    toast({
      title: t("common.info"),
      description: message,
    })
  }

  if (authLoading || (firmLoading && !firm)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!firm && !firmLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{t("firm.loadError")}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // If firm is null here, it means it's loading or errored, handled above.
  // But TypeScript needs assurance.
  if (!firm) return null

  // Determine if we should show the submit button
  // We check for both string "Draft" and numeric 0
  const isDraft = getStatusKey(firm.status) === "Draft"

  return (
    <div className="container mx-auto max-w-6xl py-12 space-y-8">
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
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" onClick={() => bannerInputRef.current?.click()}>
            <Camera className="mr-2 h-4 w-4" />
            {t("common.edit")} Banner
          </Button>
        </div>
        <input
          type="file"
          ref={bannerInputRef}
          onChange={(e) => onSelectFile(e, "banner")}
          className="hidden"
          accept="image/*"
          disabled={isUploading}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start -mt-16 px-6 relative z-10 gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full bg-white shadow-lg overflow-hidden flex-shrink-0 cursor-pointer border-4 border-white"
              onClick={() => logoInputRef.current?.click()}
            >
              <img
                src={getLogoImage()}
                alt="Logo"
                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {isUploading && imageType === "logo" ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              ) : (
                <Camera className="h-8 w-8 text-white" />
              )}
            </div>
            <input
              type="file"
              ref={logoInputRef}
              onChange={(e) => onSelectFile(e, "logo")}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
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
              {/* Status badge moved to button area */}
            </div>
            
            <div className="flex items-center gap-2 justify-center md:justify-start">
                <p className="text-muted-foreground text-lg">{firm.description || t("firm.manageSubtitle")}</p>
                <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{t("firm.editDescription")}</DialogTitle>
                            <DialogDescription>{t("firm.editDescriptionDesc")}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="description">{t("firm.description")}</Label>
                                <Textarea
                                    id="description"
                                    value={descriptionForm.description}
                                    onChange={(e) => setDescriptionForm({ ...descriptionForm, description: e.target.value })}
                                    className="min-h-[200px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDescriptionDialogOpen(false)}>
                                {t("common.cancel")}
                            </Button>
                            <Button onClick={handleUpdateDescription} disabled={isUpdatingDescription}>
                                {isUpdatingDescription ? t("common.saving") : t("common.save")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="pt-2 flex items-center gap-2 justify-center md:justify-start">
              {isDraft ? (
                <Button 
                  onClick={() => setIsSubmitVerificationDialogOpen(true)} 
                  disabled={isSubmittingVerification}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmittingVerification ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t("common.processing")}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {t("firm.submitForVerification")}
                    </>
                  )}
                </Button>
              ) : (
                getStatusBadge(firm.status)
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-start gap-2 mt-4 md:mt-16">
          <Button 
            size="sm" 
            variant="outline" 
            className="relative group bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary"
            onClick={() => handleActionClick(() => {
                // Logic for posting a job
                console.log("Post a job clicked")
            })}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            {t("firm.postJob")}
            <Badge className="absolute -top-2 -right-2 scale-90 group-hover:scale-100 transition-transform">
              {firm.availableResources.totalAvailableJobPosts}
            </Badge>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="relative group bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary"
            onClick={() => handleActionClick(() => {
                // Logic for adding a category
                console.log("Add category clicked")
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("firm.addCategory")}
            <Badge className="absolute -top-2 -right-2 scale-90 group-hover:scale-100 transition-transform">
              {firm.availableResources.totalAvailableCategories}
            </Badge>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="relative group bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary"
            onClick={() => handleActionClick(() => {
                // Logic for posting an event
                console.log("Post event clicked")
            })}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {t("firm.postEvent")}
            <Badge className="absolute -top-2 -right-2 scale-90 group-hover:scale-100 transition-transform">
              {firm.availableResources.totalAvailableEvents}
            </Badge>
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
              <Button onClick={() => router.push("/pricing")}>{t("firm.viewPlans")}</Button>
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
              <Dialog open={isBasicInfoDialogOpen} onOpenChange={setIsBasicInfoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{t("firm.editBasicInfo")}</DialogTitle>
                    <DialogDescription>{t("firm.editBasicInfoDesc")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">{t("firm.type")}</Label>
                      <Select
                        value={basicInfoForm.type}
                        onValueChange={(value) => setBasicInfoForm({ ...basicInfoForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("firm.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          {firmTypes.map((type: any) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBasicInfoDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleUpdateBasicInfo} disabled={isUpdatingType}>
                      {isUpdatingType ? t("common.saving") : t("common.save")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                    {firmTypes.find((t: any) => t.value === firm.type)?.label || firm.type}
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
              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{t("firm.editContact")}</DialogTitle>
                    <DialogDescription>{t("firm.editContactDesc")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t("firm.email")}</Label>
                      <FormInput
                        id="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">{t("firm.phone")}</Label>
                      <FormInput
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleUpdateContact} disabled={isUpdatingContact}>
                      {isUpdatingContact ? t("common.saving") : t("common.save")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{t("firm.editLocation")}</DialogTitle>
                    <DialogDescription>{t("firm.editLocationDesc")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="country">{t("firm.country")}</Label>
                      <Select
                        value={locationForm.countryId}
                        onValueChange={(value) => {
                          setLocationForm({ ...locationForm, countryId: value, countyId: "", cityId: "" })
                        }}
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
                    <div className="grid gap-2">
                      <Label htmlFor="county">{t("firm.county")}</Label>
                      <Select
                        value={locationForm.countyId}
                        onValueChange={(value) => {
                          setLocationForm({ ...locationForm, countyId: value, cityId: "" })
                        }}
                        disabled={!locationForm.countryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("firm.selectCounty")} />
                        </SelectTrigger>
                        <SelectContent>
                          {editCounties.map((county: any) => (
                            <SelectItem key={county.id} value={county.id}>
                              {county.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">{t("firm.city")}</Label>
                      <Select
                        value={locationForm.cityId}
                        onValueChange={(value) => setLocationForm({ ...locationForm, cityId: value })}
                        disabled={!locationForm.countyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("firm.selectCity")} />
                        </SelectTrigger>
                        <SelectContent>
                          {editCities.map((city: any) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">{t("firm.address")}</Label>
                      <FormInput
                        id="address"
                        value={locationForm.address}
                        onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postalCode">{t("firm.postalCode")}</Label>
                      <FormInput
                        id="postalCode"
                        value={locationForm.postalCode}
                        onChange={(e) => setLocationForm({ ...locationForm, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleUpdateLocation} disabled={isUpdatingLocation}>
                      {isUpdatingLocation ? t("common.saving") : t("common.save")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            <Dialog open={isLinksDialogOpen} onOpenChange={setIsLinksDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t("firm.editLinks")}</DialogTitle>
                  <DialogDescription>{t("firm.editLinksDesc")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="website">{t("firm.website")}</Label>
                    <FormInput
                      id="website"
                      value={linksForm.website}
                      onChange={(e) => setLinksForm({ ...linksForm, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <FormInput
                      id="linkedin"
                      value={linksForm.linkedIn}
                      onChange={(e) => setLinksForm({ ...linksForm, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <FormInput
                      id="facebook"
                      value={linksForm.facebook}
                      onChange={(e) => setLinksForm({ ...linksForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <FormInput
                      id="twitter"
                      value={linksForm.twitter}
                      onChange={(e) => setLinksForm({ ...linksForm, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <FormInput
                      id="instagram"
                      value={linksForm.instagram}
                      onChange={(e) => setLinksForm({ ...linksForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLinksDialogOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleUpdateLinks} disabled={isUpdatingLinks}>
                    {isUpdatingLinks ? t("common.saving") : t("common.save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              {firm.links?.linkedIn && (
                <a
                  href={firm.links.linkedIn}
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
              <Dialog open={isUniversalAnswersDialogOpen} onOpenChange={setIsUniversalAnswersDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("firm.companyProfile")}</DialogTitle>
                    <DialogDescription>{t("firm.universalAnswers")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {firm.universalAnswers
                      .sort((a, b) => a.order - b.order)
                      .map((answer) => {
                        const question = answer.universalQuestion
                        if (!question) return null
                        
                        const questionText = getTranslation(question.translations || [], "title")
                        
                        return (
                          <div key={question.id} className="grid gap-2">
                            <Label htmlFor={`question-${question.id}`}>{questionText}</Label>
                            <Select
                              value={universalAnswersForm[question.id] || ""}
                              onValueChange={(value) => 
                                setUniversalAnswersForm(prev => ({ ...prev, [question.id]: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t("firm.selectOption")} />
                              </SelectTrigger>
                              <SelectContent>
                                {question.options?.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {getTranslation(option.translations || [], "label")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUniversalAnswersDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleUpdateUniversalAnswers} disabled={isUpdatingUniversalAnswers}>
                      {isUpdatingUniversalAnswers ? t("common.saving") : t("common.save")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                        const questionText = getTranslation(question.translations, "text")
                        const answer = qa.categoryAnswer
                        const answerText = answer ? getTranslation(answer.translations, "text") : null

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

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t("common.addImage")}</DialogTitle>
          </DialogHeader>
          <div className="relative h-[500px] w-full bg-black/5 rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={imageType === "logo" ? 1 : 16 / 9}
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
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveImage} disabled={isUploading}>
                {t("common.save")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Required Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("firm.verificationRequired")}</DialogTitle>
            <DialogDescription>
              {t("firm.verificationRequiredDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsVerificationDialogOpen(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit for Verification Dialog */}
      <Dialog open={isSubmitVerificationDialogOpen} onOpenChange={setIsSubmitVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("firm.submitForVerification")}</DialogTitle>
            <DialogDescription>
              {t("firm.reviewNote")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <ShieldCheck className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSubmitVerificationDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleSubmitForVerification} 
              disabled={isSubmittingVerification || showSuccessAnimation}
              className={`transition-all duration-500 ${showSuccessAnimation ? "bg-green-500 hover:bg-green-600" : ""}`}
            >
              <AnimatePresence mode="wait">
                {showSuccessAnimation ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {t("common.sent")}
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center"
                  >
                    {isSubmittingVerification ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t("common.processing")}
                      </>
                    ) : (
                      <>
                        {t("common.submit")}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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