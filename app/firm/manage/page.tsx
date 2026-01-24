"use client"

import React, { useRef, useEffect, useState, useMemo } from "react"
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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
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
  useUniversalQuestions,
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
import { adminApi, Category, Cluster } from "@/lib/api/admin"
import { questionsApi, QuestionsByCategory, QuestionType, CategoryFormDto, SubmitAnswerDto } from "@/lib/api/questions"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { renderIcon } from "@/lib/utils/icons"
import { useQuery } from "@tanstack/react-query"
import { locationCache } from "@/lib/utils/location-cache"

function FirmManageContent() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { userInfo, loading: authLoading } = useAuth()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const { data: firmData, isLoading: isFirmLoading, error: firmError } = useMyFirm()
  const { data: universalQuestions, isLoading: isUniversalLoading } = useUniversalQuestions()

  const categoryIds = useMemo(() => firmData?.forms?.map((f: any) => f.categoryId) || [], [firmData])

  const { data: categoryQuestionsData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category-questions", categoryIds],
    queryFn: () => questionsApi.getQuestionsByCategory(categoryIds),
    enabled: categoryIds.length > 0
  })

  const firm = useMemo(() => {
    if (!firmData) return null

    // Combine Universal Answers
    const combinedUniversalAnswers = firmData.universalAnswers?.map((answer: any) => {
        const question = universalQuestions?.find((q: any) => q.id === answer.universalQuestionId)
        return {
            ...answer,
            universalQuestion: question
        }
    }) || []

    // Combine Forms
    const combinedForms = firmData.forms?.map((form: any) => {
        const categoryQData = categoryQuestionsData?.find((cq: any) => cq.categoryId === form.categoryId)
        
        const questionsWithAnswers = categoryQData?.questions.map((question: any) => {
            const answer = form.answers?.find((a: any) => a.categoryQuestionId === question.id)
            return {
                categoryQuestion: question,
                categoryAnswer: answer
            }
        }) || []
        
        return {
            ...form,
            questionsWithAnswers
        }
    }) || []

    return {
        ...firmData,
        universalAnswers: combinedUniversalAnswers,
        forms: combinedForms
    }
  }, [firmData, universalQuestions, categoryQuestionsData])

  const firmLoading = isFirmLoading || isUniversalLoading || (categoryIds.length > 0 && isCategoryLoading)

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

  // Add Category States
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryQuestions, setCategoryQuestions] = useState<QuestionsByCategory | null>(null)
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [formStep, setFormStep] = useState<"select" | "form">("select")

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

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

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
    if (firmData) {
      setLocationForm({
        address: firmData.location?.address || "",
        countryId: firmData.location?.countryId || "",
        countyId: firmData.location?.countyId || "",
        cityId: firmData.location?.cityId || "",
        postalCode: firmData.location?.postalCode || "",
      })
      setContactForm({
        phone: firmData.contact?.phone || "",
        email: firmData.contact?.email || "",
      })
      setLinksForm({
        website: firmData.links?.website || "",
        linkedIn: firmData.links?.linkedIn || "",
        facebook: firmData.links?.facebook || "",
        twitter: firmData.links?.twitter || "",
        instagram: firmData.links?.instagram || "",
      })
      setBasicInfoForm({
        type: firmData.type || "",
      })
      setDescriptionForm({
        description: firmData.description || "",
      })
      
      // Initialize universal answers form
      const answers: Record<string, string> = {}
      firmData.universalAnswers?.forEach((answer: any) => {
        if (answer.universalQuestionId && answer.selectedOptionId) {
          answers[answer.universalQuestionId] = answer.selectedOptionId
        }
      })
      setUniversalAnswersForm(answers)
    }
  }, [firmData])

  // Fetch clusters when add category dialog opens
  useEffect(() => {
    if (isAddCategoryDialogOpen && clusters.length === 0) {
        adminApi.getClusters().then(setClusters).catch(console.error)
    }
  }, [isAddCategoryDialogOpen])

  // Fetch clusters if firm has forms to display category names
  useEffect(() => {
    if (firmData?.forms?.length && clusters.length === 0) {
        adminApi.getClusters().then(setClusters).catch(console.error)
    }
  }, [firmData, clusters.length])

  const getLocationNames = () => {
    if (!firm || !firm.location) return { country: "", county: "", city: "" }

    const cachedNames = locationCache.getLocationNames(
        firm.location.countryId,
        firm.location.countyId,
        firm.location.cityId
    )

    // Fallback to fetched data if not found in cache
    let countryName = cachedNames.country
    let countyName = cachedNames.county
    let cityName = cachedNames.city

    if (!countryName) {
        const country = countries.find((c: any) => c.id === firm.location.countryId)
        countryName = country?.name || ""
    }
    if (!countyName) {
        const county = counties.find((c: any) => c.id === firm.location.countyId)
        countyName = county?.name || ""
    }
    if (!cityName) {
        const city = cities.find((c: any) => c.id === firm.location.cityId)
        cityName = city?.name || ""
    }

    return {
      country: countryName,
      county: countyName,
      city: cityName,
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
              description: imageType === "logo" ? t("firm.logoUploaded") : t("firm.bannerUploaded"),
            })
          },
          onError: (error: any) => {
            console.error(`Error uploading ${imageType}:`, error)
            toast({
              title: t("common.error"),
              description: imageType === "logo" ? t("firm.logoUploadError") : t("firm.bannerUploadError"),
              variant: "destructive",
            })
          },
        },
      )
    } catch (error: any) {
      console.error(error)
      toast({
        title: t("common.error"),
        description: imageType === "logo" ? t("firm.logoProcessError") : t("firm.bannerProcessError"),
        variant: "destructive",
      })
    }
  }

  // Validation functions
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

  const fixUrl = (url: string): string => {
    if (!url) return ""
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url
    }
    return url
  }

  const resetLocationForm = () => {
    if (firm) {
        setLocationForm({
            address: firm.location?.address || "",
            countryId: firm.location?.countryId || "",
            countyId: firm.location?.countyId || "",
            cityId: firm.location?.cityId || "",
            postalCode: firm.location?.postalCode || "",
        })
    }
    setValidationErrors({})
  }

  const resetContactForm = () => {
    if (firm) {
        setContactForm({
            phone: firm.contact?.phone || "",
            email: firm.contact?.email || "",
        })
    }
    setValidationErrors({})
  }

  const resetLinksForm = () => {
    if (firm) {
        setLinksForm({
            website: firm.links?.website || "",
            linkedIn: firm.links?.linkedIn || "",
            facebook: firm.links?.facebook || "",
            twitter: firm.links?.twitter || "",
            instagram: firm.links?.instagram || "",
        })
    }
    setValidationErrors({})
  }

  const resetBasicInfoForm = () => {
    if (firm) {
      setBasicInfoForm({
        type: firm.type || "",
      })
    }
  }

  const resetDescriptionForm = () => {
    if (firm) {
      setDescriptionForm({
        description: firm.description || "",
      })
    }
  }

  const resetUniversalAnswersForm = () => {
    if (firm) {
      const answers: Record<string, string> = {}
      firm.universalAnswers?.forEach((answer: any) => {
        if (answer.universalQuestion?.id && answer.selectedOptionId) {
          answers[answer.universalQuestion.id] = answer.selectedOptionId
        }
      })
      setUniversalAnswersForm(answers)
    }
  }

  const handleUpdateLocation = () => {
    clearError()
    setValidationErrors({})
    
    const errors: Record<string, string> = {}
    if (!locationForm.countryId) errors.countryId = t("firm.validationError")
    if (!locationForm.countyId) errors.countyId = t("firm.validationError")
    if (!locationForm.cityId) errors.cityId = t("firm.validationError")
    
    if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
    }

    updateLocation(locationForm, {
      onSuccess: () => {
        setIsLocationDialogOpen(false)
        toast({
          title: t("common.success"),
          description: t("firm.locationUpdated"),
        })
      },
      onError: (error: any) => {
        console.error("Error updating location:", error)
        setError(error)
        if (error.validationErrors) {
            const newValidationErrors: Record<string, string> = {}
            Object.entries(error.validationErrors).forEach(([field, messages]) => {
                const message = Array.isArray(messages) ? messages[0] : (messages as string)
                const fieldName = field.split('.').pop() || field
                const frontendField = fieldName.charAt(0).toLowerCase() + fieldName.slice(1)
                newValidationErrors[frontendField] = message
            })
            setValidationErrors(newValidationErrors)
            
            const firstErrorMessage = Object.values(newValidationErrors)[0]
            toast({
                title: t("firm.validationErrors"),
                description: firstErrorMessage || t("firm.validationErrorDesc"),
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
                description: t("firm.locationUpdateError"),
                variant: "destructive",
            })
        }
      },
    })
  }

  const handleUpdateContact = () => {
    clearError()
    setValidationErrors({})
    
    const errors: Record<string, string> = {}
    if (!contactForm.email) {
        errors.email = t("firm.validationError")
    } else {
        const emailError = validateEmail(contactForm.email)
        if (emailError) errors.email = emailError
    }
    
    if (contactForm.phone) {
        const phoneError = validatePhone(contactForm.phone)
        if (phoneError) errors.phone = phoneError
    }

    if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
    }

    updateContact(contactForm, {
      onSuccess: () => {
        setIsContactDialogOpen(false)
        toast({
          title: t("common.success"),
          description: t("firm.contactUpdated"),
        })
      },
      onError: (error: any) => {
        console.error("Error updating contact:", error)
        setError(error)
        if (error.validationErrors) {
            const newValidationErrors: Record<string, string> = {}
            Object.entries(error.validationErrors).forEach(([field, messages]) => {
                const message = Array.isArray(messages) ? messages[0] : (messages as string)
                const fieldName = field.toLowerCase()
                newValidationErrors[fieldName] = message
            })
            setValidationErrors(newValidationErrors)
            
            const firstErrorMessage = Object.values(newValidationErrors)[0]
            toast({
                title: t("firm.validationErrors"),
                description: firstErrorMessage || t("firm.validationErrorDesc"),
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
                description: t("firm.contactUpdateError"),
                variant: "destructive",
            })
        }
      },
    })
  }

  const handleUpdateLinks = () => {
    clearError()
    setValidationErrors({})
    
    const errors: Record<string, string> = {}
    const fixedLinks = { ...linksForm }

    if (linksForm.website) {
        const err = validateUrl(linksForm.website)
        if (err) errors.website = err
        else fixedLinks.website = fixUrl(linksForm.website)
    }
    if (linksForm.linkedIn) {
        const err = validateUrl(linksForm.linkedIn)
        if (err) errors.linkedIn = err
        else fixedLinks.linkedIn = fixUrl(linksForm.linkedIn)
    }
    if (linksForm.facebook) {
        const err = validateUrl(linksForm.facebook)
        if (err) errors.facebook = err
        else fixedLinks.facebook = fixUrl(linksForm.facebook)
    }
    if (linksForm.twitter) {
        const err = validateUrl(linksForm.twitter)
        if (err) errors.twitter = err
        else fixedLinks.twitter = fixUrl(linksForm.twitter)
    }
    if (linksForm.instagram) {
        const err = validateUrl(linksForm.instagram)
        if (err) errors.instagram = err
        else fixedLinks.instagram = fixUrl(linksForm.instagram)
    }

    if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
    }

    updateLinks(fixedLinks, {
      onSuccess: () => {
        setIsLinksDialogOpen(false)
        toast({
          title: t("common.success"),
          description: t("firm.linksUpdated"),
        })
      },
      onError: (error: any) => {
        console.error("Error updating links:", error)
        setError(error)
        if (error.validationErrors) {
            const newValidationErrors: Record<string, string> = {}
            Object.entries(error.validationErrors).forEach(([field, messages]) => {
                const message = Array.isArray(messages) ? messages[0] : (messages as string)
                // Map backend field names like 'links.Website' to 'website'
                const fieldName = field.split('.').pop()?.toLowerCase() || field.toLowerCase()
                newValidationErrors[fieldName] = message
            })
            setValidationErrors(newValidationErrors)
            
            const firstErrorMessage = Object.values(newValidationErrors)[0]
            toast({
                title: t("firm.validationErrors"),
                description: firstErrorMessage || t("firm.validationErrorDesc"),
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
                description: t("firm.linksUpdateError"),
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
              description: t("firm.typeUpdated"),
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
                    description: t("firm.typeUpdateError"),
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
              description: t("firm.descriptionUpdated"),
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
                    description: t("firm.descriptionUpdateError"),
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
            description: t("firm.answerAllQuestions"),
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
                    description: t("firm.universalAnswersUpdated"),
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
                        description: t("firm.universalAnswersUpdateError"),
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

  const getCategoryName = (categoryId: string) => {
    if (!clusters.length) return null
    for (const cluster of clusters) {
        const category = cluster.categories?.find((c: any) => c.id === categoryId)
        if (category) {
            return getTranslation(category.translations, "name")
        }
    }
    return null
  }

  const hasAnswer = (answer: any) => {
    if (!answer) return false
    if (answer.translations && answer.translations.length > 0) return true
    if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) return true
    if (answer.value !== null && answer.value !== undefined && answer.value !== "") return true
    return false
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

  const handleEditCategory = async (categoryId: string) => {
    let category: Category | undefined
    
    // Try to find in existing clusters
    for (const cluster of clusters) {
        const found = cluster.categories?.find(c => c.id === categoryId)
        if (found) {
            category = found
            break
        }
    }

    // If not found, fetch clusters
    if (!category) {
        try {
            const fetchedClusters = await adminApi.getClusters()
            setClusters(fetchedClusters)
            for (const cluster of fetchedClusters) {
                const found = cluster.categories?.find(c => c.id === categoryId)
                if (found) {
                    category = found
                    break
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (!category) {
        toast({ title: t("common.error"), description: t("firm.categoryNotFound"), variant: "destructive" })
        return
    }

    setSelectedCategory(category)
    
    try {
        const questionsData = await questionsApi.getQuestionsByCategory([categoryId])
        if (questionsData && questionsData.length > 0) {
            const qbc = questionsData[0]
            setCategoryQuestions(qbc)
            
            const form = firm.forms.find((f: any) => f.categoryId === categoryId)
            const newAnswers: Record<string, any> = {}
            
            if (form) {
                // Handle both old structure (questionsWithAnswers) and new structure (answers)
                if (form.answers) {
                    form.answers.forEach((a: any) => {
                        const q = qbc.questions.find(q => q.id === a.categoryQuestionId)
                        if (!q) return

                        let value: any = null
                        if (q.type === QuestionType.String || q.type === QuestionType.Text) {
                            const roText = a.translations?.find((t: any) => t.languageCode === "ro")?.text || ""
                            const enText = a.translations?.find((t: any) => t.languageCode === "en")?.text || ""
                            value = { ro: roText, en: enText }
                        } else if (q.type === QuestionType.Number || q.type === QuestionType.Date) {
                            value = a.value
                        } else if (q.type === QuestionType.SingleSelect) {
                            value = a.selectedOptionIds?.[0] || ""
                        } else if (q.type === QuestionType.MultiSelect) {
                            value = a.selectedOptionIds || []
                        }
                        newAnswers[q.id] = { value, type: q.type }
                    })
                } else if (form.questionsWithAnswers) {
                    form.questionsWithAnswers.forEach((qa: any) => {
                        const q = qa.categoryQuestion
                        const a = qa.categoryAnswer
                        if (!a) return

                        let value: any = null
                        
                        if (q.type === QuestionType.String || q.type === QuestionType.Text) {
                            const roText = a.translations?.find((t: any) => t.languageCode === "ro")?.text || ""
                            const enText = a.translations?.find((t: any) => t.languageCode === "en")?.text || ""
                            value = { ro: roText, en: enText }
                        } else if (q.type === QuestionType.Number || q.type === QuestionType.Date) {
                            value = a.value
                        } else if (q.type === QuestionType.SingleSelect) {
                            value = a.selectedOptionIds?.[0] || ""
                        } else if (q.type === QuestionType.MultiSelect) {
                            value = a.selectedOptionIds || []
                        }

                        newAnswers[q.id] = { value, type: q.type }
                    })
                }
            }
            
            setFormAnswers(newAnswers)
            setFormStep("form")
            setIsAddCategoryDialogOpen(true)
        }
    } catch (error) {
        console.error("Error fetching questions:", error)
        toast({
            title: t("common.error"),
            description: t("firm.categoryQuestionsLoadError"),
            variant: "destructive"
        })
    }
  }

  // Add Category Handlers
  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category)
    try {
        const questions = await questionsApi.getQuestionsByCategory([category.id])
        if (questions && questions.length > 0) {
            setCategoryQuestions(questions[0])
            setFormStep("form")
        } else {
            // No questions, just submit empty answers
            await handleSubmitCategoryForm([])
        }
    } catch (error) {
        console.error("Error fetching questions:", error)
        toast({
            title: t("common.error"),
            description: t("firm.categoryQuestionsLoadError"),
            variant: "destructive"
        })
    }
  }

  const handleFormAnswerChange = (questionId: string, value: any, type: QuestionType) => {
    setFormAnswers(prev => ({
        ...prev,
        [questionId]: { value, type }
    }))
  }

  const handleSubmitCategoryForm = async (answersOverride?: SubmitAnswerDto[]) => {
    if (!selectedCategory) return

    setIsSubmittingForm(true)
    try {
        let answers: SubmitAnswerDto[] = []

        if (answersOverride) {
            answers = answersOverride
        } else if (categoryQuestions) {
            answers = categoryQuestions.questions.map(q => {
                const answer = formAnswers[q.id]
                if (!answer) return null

                const dto: any = { questionId: q.id }

                if (q.type === QuestionType.String || q.type === QuestionType.Text) {
                    dto.translations = [
                        { languageCode: "ro", text: answer.value.ro || "" },
                        { languageCode: "en", text: answer.value.en || "" }
                    ]
                    dto.value = null
                    dto.selectedOptionIds = null
                } else if (q.type === QuestionType.Number || q.type === QuestionType.Date) {
                    dto.value = answer.value
                    dto.translations = null
                    dto.selectedOptionIds = null
                } else if (q.type === QuestionType.SingleSelect) {
                    dto.selectedOptionIds = [answer.value]
                    dto.value = null
                    dto.translations = null
                } else if (q.type === QuestionType.MultiSelect) {
                    dto.selectedOptionIds = answer.value
                    dto.value = null
                    dto.translations = null
                }

                return dto as SubmitAnswerDto
            }).filter(Boolean) as SubmitAnswerDto[]
        }

        const formDto: CategoryFormDto = {
            categoryId: selectedCategory.id,
            answers
        }

        await questionsApi.submitCategoryForm(formDto)
        
        toast({
            title: t("common.success"),
            description: t("firm.categoryAdded")
        })
        setIsAddCategoryDialogOpen(false)
        setFormStep("select")
        setSelectedCategory(null)
        setCategoryQuestions(null)
        setFormAnswers({})
        // Refresh firm data
        window.location.reload()
    } catch (error) {
        console.error("Error submitting form:", error)
        toast({
            title: t("common.error"),
            description: t("firm.categoryFormSubmitError"),
            variant: "destructive"
        })
    } finally {
        setIsSubmittingForm(false)
    }
  }

  const getSelectedCategoryLabel = () => {
    if (!selectedCategory) return t("firm.addCategory")
    return getTranslation(selectedCategory.translations || [], "name") || selectedCategory.name
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
                <Dialog open={isDescriptionDialogOpen} onOpenChange={(open) => {
                    if (!open) resetDescriptionForm()
                    setIsDescriptionDialogOpen(open)
                }}>
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
                            <Button variant="outline" onClick={() => {
                                resetDescriptionForm()
                                setIsDescriptionDialogOpen(false)
                            }}>
                                {t("common.cancel")}
                            </Button>
                            <Button onClick={handleUpdateDescription} disabled={isUpdatingDescription}>
                                {isUpdatingDescription ? t("common.saving") : t("common.save")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="pt-2 flex items-center gap-2 justify-center md:justify-start flex-wrap">
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
              {firm.status === 3 && firm.rejectionReasonNote && (
                  <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {firm.rejectionReasonNote}
                  </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3 mt-4 md:mt-16">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="relative group bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary"
              onClick={() => handleActionClick(() => {
                  if (firm.availableResources && firm.availableResources.totalAvailableJobPosts > 0) {
                      router.push("/firm/manage/jobs/create")
                  } else {
                      router.push("/partner")
                  }
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
              onClick={() => setIsAddCategoryDialogOpen(true)}
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
          
          <div className="flex items-center justify-center gap-2 w-full">
            <Button 
                size="sm" 
                className="bg-red-600 text-white hover:bg-white hover:text-red-600 border border-red-600 transition-colors"
                onClick={() => router.push("/firm/manage/jobs")}
            >
                <Briefcase className="h-4 w-4 mr-2" />
                {t("firm.manageJobs") || "Manage Jobs"}
            </Button>
            <Button 
                size="sm" 
                className="bg-red-600 text-white hover:bg-white hover:text-red-600 border border-red-600 transition-colors"
                onClick={() => router.push("/firm/manage/events")}
            >
                <CalendarPlus className="h-4 w-4 mr-2" />
                {t("firm.manageEvents") || "Manage Events"}
            </Button>
          </div>
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
              <Dialog open={isBasicInfoDialogOpen} onOpenChange={(open) => {
                  if (!open) resetBasicInfoForm()
                  setIsBasicInfoDialogOpen(open)
              }}>
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
                    <Button variant="outline" onClick={() => {
                        resetBasicInfoForm()
                        setIsBasicInfoDialogOpen(false)
                    }}>
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
              <Dialog open={isContactDialogOpen} onOpenChange={(open) => {
                  if (!open) resetContactForm()
                  setIsContactDialogOpen(open)
              }}>
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
                        error={validationErrors.email}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">{t("firm.phone")}</Label>
                      <FormInput
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        error={validationErrors.phone}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      resetContactForm()
                      setIsContactDialogOpen(false)
                    }}>
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
              <Dialog open={isLocationDialogOpen} onOpenChange={(open) => {
                  if (!open) resetLocationForm()
                  setIsLocationDialogOpen(open)
              }}>
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
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="country">{t("firm.country")}</Label>
                        <Select
                          value={locationForm.countryId}
                          onValueChange={(value) => {
                            setLocationForm({ ...locationForm, countryId: value, countyId: "", cityId: "" })
                          }}
                        >
                          <SelectTrigger error={validationErrors.countryId}>
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
                        {validationErrors.countryId && (
                            <p className="text-sm text-destructive">{validationErrors.countryId}</p>
                        )}
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
                          <SelectTrigger error={validationErrors.countyId}>
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
                        {validationErrors.countyId && (
                            <p className="text-sm text-destructive">{validationErrors.countyId}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="city">{t("firm.city")}</Label>
                        <Select
                          value={locationForm.cityId}
                          onValueChange={(value) => setLocationForm({ ...locationForm, cityId: value })}
                          disabled={!locationForm.countyId}
                        >
                          <SelectTrigger error={validationErrors.cityId}>
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
                        {validationErrors.cityId && (
                            <p className="text-sm text-destructive">{validationErrors.cityId}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">{t("firm.address")}</Label>
                      <FormInput
                        id="address"
                        value={locationForm.address}
                        onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                        error={validationErrors.address}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postalCode">{t("firm.postalCode")}</Label>
                      <FormInput
                        id="postalCode"
                        value={locationForm.postalCode}
                        onChange={(e) => setLocationForm({ ...locationForm, postalCode: e.target.value })}
                        error={validationErrors.postalCode}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      resetLocationForm()
                      setIsLocationDialogOpen(false)
                    }}>
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
            <Dialog open={isLinksDialogOpen} onOpenChange={(open) => {
                if (!open) resetLinksForm()
                setIsLinksDialogOpen(open)
            }}>
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
                      error={validationErrors.website}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <FormInput
                      id="linkedin"
                      value={linksForm.linkedIn}
                      onChange={(e) => setLinksForm({ ...linksForm, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/..."
                      error={validationErrors.linkedIn}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <FormInput
                      id="facebook"
                      value={linksForm.facebook}
                      onChange={(e) => setLinksForm({ ...linksForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      error={validationErrors.facebook}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <FormInput
                      id="twitter"
                      value={linksForm.twitter}
                      onChange={(e) => setLinksForm({ ...linksForm, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                      error={validationErrors.twitter}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <FormInput
                      id="instagram"
                      value={linksForm.instagram}
                      onChange={(e) => setLinksForm({ ...linksForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      error={validationErrors.instagram}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    resetLinksForm()
                    setIsLinksDialogOpen(false)
                  }}>
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
              <Dialog open={isUniversalAnswersDialogOpen} onOpenChange={(open) => {
                  if (!open) resetUniversalAnswersForm()
                  setIsUniversalAnswersDialogOpen(open)
              }}>
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
                      .sort((a: any, b: any) => (a.universalQuestion?.order || 0) - (b.universalQuestion?.order || 0))
                      .map((answer: any) => {
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
                                {question.options?.map((option: any) => (
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
                    <Button variant="outline" onClick={() => {
                        resetUniversalAnswersForm()
                        setIsUniversalAnswersDialogOpen(false)
                    }}>
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
                  .sort((a: any, b: any) => (a.universalQuestion?.order || 0) - (b.universalQuestion?.order || 0))
                  .map((answer: any) => {
                    const question = answer.universalQuestion
                    const questionText = getTranslation(question?.translations || [], "title")
                    const selectedOption = question?.options?.find((opt: any) => opt.id === answer.selectedOptionId)
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
              {firm.forms.map((form: any) => {
                const categoryName = getCategoryName(form.categoryId)
                const answeredQuestions = form.questionsWithAnswers.filter((qa: any) => hasAnswer(qa.categoryAnswer))
                
                if (answeredQuestions.length === 0) return null

                return (
                <div key={form.categoryId} className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">
                            {categoryName || t("firm.category")}
                        </h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditCategory(form.categoryId)}>
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                    {form.updatedAt && (
                        <span className="text-xs text-muted-foreground">
                            {new Date(form.updatedAt).toLocaleDateString()}
                        </span>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {answeredQuestions.map((qa: any) => {
                        const question = qa.categoryQuestion
                        const questionText = getTranslation(question.translations, "title")
                        const answer = qa.categoryAnswer
                        const isText = question.type === QuestionType.Text || question.type === QuestionType.String
                        
                        let answerContent = null
                        if (answer.translations && answer.translations.length > 0) {
                            answerContent = <span className="whitespace-pre-wrap">{getTranslation(answer.translations, "text")}</span>
                        } else if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
                            const selectedOptions = question.options?.filter((opt: any) => 
                                answer.selectedOptionIds.includes(opt.id)
                            ) || []
                            answerContent = (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedOptions.map((opt: any) => (
                                        <Badge key={opt.id} variant="secondary" className="bg-background/60 hover:bg-background/80 border-0 font-normal text-xs px-2 py-0.5 h-auto">
                                            {getTranslation(opt.translations, "label")}
                                        </Badge>
                                    ))}
                                </div>
                            )
                        } else if (answer.value !== null && answer.value !== undefined) {
                            answerContent = <span>{String(answer.value)}</span>
                        }

                        return (
                          <div key={question.id} className={`space-y-1 ${isText ? "md:col-span-2" : ""}`}>
                            <p className="text-xs font-medium text-muted-foreground">{questionText}</p>
                            {answerContent && (
                              <div className="text-sm p-2 bg-muted/40 rounded-md break-words border border-border/50">
                                {answerContent}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              )})}
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

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={(open) => {
        setIsAddCategoryDialogOpen(open)
        if (!open) {
            setFormStep("select")
            setSelectedCategory(null)
            setCategoryQuestions(null)
            setFormAnswers({})
        }
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{t("firm.addCategory")}</DialogTitle>
                <DialogDescription>
                    {formStep === "select" ? t("firm.selectCategoryDesc") : t("firm.completeCategoryForm")}
                </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
                {formStep === "select" ? (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid gap-6 py-4"
                    >
                        <div className="space-y-2">
                            <Label>{t("home.clusters.categories")}</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between font-normal">
                                        <span className="truncate">{getSelectedCategoryLabel()}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
                                    {clusters.map((cluster: any) => {
                                        const existingCategoryIds = firmData?.forms?.map((f: any) => f.categoryId) || []
                                        const availableCategories = cluster.categories?.filter((c: any) => !existingCategoryIds.includes(c.id)) || []

                                        if (availableCategories.length === 0) return null

                                        return (
                                        <DropdownMenuSub key={cluster.id}>
                                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                                {renderIcon(cluster.icon, { className: "h-4 w-4 shrink-0" })}
                                                <span className="truncate">{getTranslation(cluster.translations, "name")}</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                                    {availableCategories.map((category: any) => (
                                                        <DropdownMenuItem 
                                                            key={category.id}
                                                            onSelect={() => handleCategorySelect(category)}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span className="truncate">{getTranslation(category.translations, "name")}</span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    )})}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 py-4"
                    >
                        <Button variant="ghost" size="sm" onClick={() => setFormStep("select")} className="mb-2">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {t("firm.backToSelection")}
                        </Button>

                        <div className="space-y-6">
                            {categoryQuestions?.questions.map((question) => {
                                const translation = question.translations.find(t => t.languageCode === language) || question.translations[0]
                                
                                return (
                                    <div key={question.id} className="space-y-2">
                                        <Label>
                                            {translation.title}
                                            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                        <p className="text-sm text-muted-foreground mb-2">{translation.description}</p>

                                        {/* Render input based on type */}
                                        {(question.type === QuestionType.String || question.type === QuestionType.Text) && (
                                            <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Romanian</Label>
                                                    {question.type === QuestionType.Text ? (
                                                        <Textarea 
                                                            value={formAnswers[question.id]?.value?.ro || ""}
                                                            onChange={(e) => handleFormAnswerChange(question.id, { ...formAnswers[question.id]?.value, ro: e.target.value }, question.type)}
                                                            placeholder="Răspuns în română..."
                                                        />
                                                    ) : (
                                                        <Input 
                                                            value={formAnswers[question.id]?.value?.ro || ""}
                                                            onChange={(e) => handleFormAnswerChange(question.id, { ...formAnswers[question.id]?.value, ro: e.target.value }, question.type)}
                                                            placeholder="Răspuns în română..."
                                                        />
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">English</Label>
                                                    {question.type === QuestionType.Text ? (
                                                        <Textarea 
                                                            value={formAnswers[question.id]?.value?.en || ""}
                                                            onChange={(e) => handleFormAnswerChange(question.id, { ...formAnswers[question.id]?.value, en: e.target.value }, question.type)}
                                                            placeholder="Answer in English..."
                                                        />
                                                    ) : (
                                                        <Input 
                                                            value={formAnswers[question.id]?.value?.en || ""}
                                                            onChange={(e) => handleFormAnswerChange(question.id, { ...formAnswers[question.id]?.value, en: e.target.value }, question.type)}
                                                            placeholder="Answer in English..."
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {(question.type === QuestionType.Number) && (
                                            <Input 
                                                type="number"
                                                value={formAnswers[question.id]?.value || ""}
                                                onChange={(e) => handleFormAnswerChange(question.id, e.target.value, question.type)}
                                            />
                                        )}

                                        {(question.type === QuestionType.Date) && (
                                            <Input 
                                                type="date"
                                                value={formAnswers[question.id]?.value || ""}
                                                onChange={(e) => handleFormAnswerChange(question.id, e.target.value, question.type)}
                                            />
                                        )}

                                        {(question.type === QuestionType.SingleSelect) && (
                                            <Select 
                                                value={formAnswers[question.id]?.value || ""} 
                                                onValueChange={(val) => handleFormAnswerChange(question.id, val, question.type)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("firm.selectOption")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {question.options.map(option => {
                                                        const optTrans = option.translations.find(t => t.languageCode === language) || option.translations[0]
                                                        return (
                                                            <SelectItem key={option.id} value={option.id}>
                                                                {optTrans.label}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        )}

                                        {(question.type === QuestionType.MultiSelect) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border p-4 rounded-md">
                                                {question.options.map(option => {
                                                    const optTrans = option.translations.find(t => t.languageCode === language) || option.translations[0]
                                                    const currentValues = formAnswers[question.id]?.value || []
                                                    const isChecked = currentValues.includes(option.id)
                                                    
                                                    return (
                                                        <div key={option.id} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`opt-${option.id}`} 
                                                                checked={isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    const newValues = checked 
                                                                        ? [...currentValues, option.id]
                                                                        : currentValues.filter((id: string) => id !== option.id)
                                                                    handleFormAnswerChange(question.id, newValues, question.type)
                                                                }}
                                                            />
                                                            <Label htmlFor={`opt-${option.id}`} className="cursor-pointer font-normal">
                                                                {optTrans.label}
                                                            </Label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <DialogFooter>
                <Button variant="outline" onClick={() => {
                    setFormStep("select")
                    setSelectedCategory(null)
                    setCategoryQuestions(null)
                    setFormAnswers({})
                    setIsAddCategoryDialogOpen(false)
                }}>
                    {t("common.cancel")}
                </Button>
                {formStep === "form" && (
                    <Button onClick={() => handleSubmitCategoryForm()} disabled={isSubmittingForm}>
                        {isSubmittingForm ? t("common.processing") : t("common.submit")}
                    </Button>
                )}
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