"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { apiClient, FirmDetailsForDisplayDto } from "@/lib/api/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, Globe, Mail, Phone, Facebook, Linkedin, Twitter, Instagram, Briefcase, Calendar, Star, Clock, Banknote, CheckCircle, ChevronDown, MessageSquare, Edit, Trash2, User, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { renderIcon } from "@/lib/utils/icons"
import { useFirmDetails, useUniversalQuestions, useFirmReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/lib/hooks/use-firms"
import { useFirmJobs } from "@/lib/hooks/use-jobs"
import { useClusters } from "@/lib/hooks/use-categories"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

// Enums matching backend (copied from jobs page for consistency)
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

enum QuestionType {
    String = 1,
    Text = 2,
    Number = 3,
    Date = 4,
    SingleSelect = 5,
    MultiSelect = 6
}

enum ReviewSortingOption {
    MostRecent = 0,
    LeastRecent = 1,
    HighestRating = 2,
    LowestRating = 3
}

export default function FirmDetailsPage() {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const { userInfo } = useAuth()
  const router = useRouter()

  const { data: firm, isLoading: loading } = useFirmDetails(id as string)
  const { data: jobsResult, isLoading: jobsLoading } = useFirmJobs(id as string)
  const { data: clusters = [] } = useClusters()
  const { data: universalQuestions = [] } = useUniversalQuestions()
  
  // Reviews
  const [sortingOption, setSortingOption] = useState<ReviewSortingOption>(ReviewSortingOption.MostRecent)
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false)
  const [reviewPage, setReviewPage] = useState(1)
  
  // Determine page size based on expanded state
  const pageSize = isReviewsExpanded ? 21 : 10
  
  const { data: reviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useFirmReviews({ 
      firmId: id as string, 
      pageNumber: reviewPage,
      pageSize: pageSize,
      sortingOption: sortingOption,
      currentPersonId: userInfo?.personId || undefined
  })
  
  const createReviewMutation = useCreateReview()
  const updateReviewMutation = useUpdateReview()
  const deleteReviewMutation = useDeleteReview()

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [editingReview, setEditingReview] = useState<any>(null)

  const jobs = jobsResult?.documents || []
  
  // Flatten categories from clusters for easier lookup
  const categories = clusters.flatMap((c: any) => c.categories)

  // State for location data
  const [locationString, setLocationString] = useState<string>("")

  // Scroll container ref for horizontal scrolling
  const reviewsScrollRef = useRef<HTMLDivElement>(null)
  
  // State to track scroll position for arrow visibility
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
      const fetchLocation = async () => {
          if (!firm || !firm.location) return

          let countryName = ""
          let countyName = ""
          let cityName = ""

          // Try to get country
          if (firm.location.countryId) {
              const cachedCountry = localStorage.getItem(`country_${firm.location.countryId}`)
              if (cachedCountry) {
                  const countryData = JSON.parse(cachedCountry)
                  countryName = countryData.name
                  
                  // Try to get county from cached country
                  if (firm.location.countyId) {
                      const county = countryData.counties?.find((c: any) => c.id === firm.location.countyId)
                      if (county) {
                          countyName = county.name
                          
                          // Try to get city from county
                          if (firm.location.cityId) {
                              const city = county.cities?.find((c: any) => c.id === firm.location.cityId)
                              if (city) cityName = city.name
                          }
                      }
                  }
              } else {
                  // If not cached, we might want to fetch it, but for now let's rely on what we have or just show address
                  // Or we can try to fetch the country list if we don't have the specific country cached
                  try {
                      const countries = await apiClient.location.getCountries()
                      const country = countries.find((c: any) => c.id === firm.location.countryId)
                      if (country) countryName = country.name
                  } catch (e) {}
              }
          }

          const parts = []
          if (firm.location.address) parts.push(firm.location.address)
          if (cityName) parts.push(cityName)
          if (countyName) parts.push(countyName)
          if (countryName) parts.push(countryName)
          
          setLocationString(parts.join(", "))
      }

      fetchLocation()
  }, [firm])

  // Check scroll position to update arrow visibility
  const checkScrollPosition = () => {
      if (reviewsScrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = reviewsScrollRef.current
          setCanScrollLeft(scrollLeft > 0)
          // Allow a small buffer for float precision issues
          setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      }
  }

  useEffect(() => {
      const scrollContainer = reviewsScrollRef.current
      if (scrollContainer) {
          scrollContainer.addEventListener('scroll', checkScrollPosition)
          // Initial check
          checkScrollPosition()
          
          return () => {
              scrollContainer.removeEventListener('scroll', checkScrollPosition)
          }
      }
  }, [reviews, isReviewsExpanded])

  // Update scroll arrows when reviews change
  useEffect(() => {
      checkScrollPosition()
  }, [reviews])

  // Reset page when toggling expanded view
  useEffect(() => {
      setReviewPage(1)
  }, [isReviewsExpanded])

  const handleReviewSubmit = async () => {
      if (reviewRating === 0) {
          toast({
              title: t("common.error"),
              description: t("firm.reviews.validation.rating"),
              variant: "destructive"
          })
          return
      }
      if (!reviewComment.trim()) {
          toast({
              title: t("common.error"),
              description: t("firm.reviews.validation.comment"),
              variant: "destructive"
          })
          return
      }

      try {
          if (editingReview) {
              await updateReviewMutation.mutateAsync({
                  firmId: id as string,
                  data: { rating: reviewRating, comment: reviewComment }
              })
              toast({
                  title: t("common.success"),
                  description: t("firm.reviews.successUpdate")
              })
          } else {
              await createReviewMutation.mutateAsync({
                  firmId: id as string,
                  data: { rating: reviewRating, comment: reviewComment }
              })
              toast({
                  title: t("common.success"),
                  description: t("firm.reviews.successPost")
              })
          }
          setIsReviewDialogOpen(false)
          setReviewRating(0)
          setReviewComment("")
          setEditingReview(null)
          refetchReviews()
      } catch (error) {
          toast({
              title: t("common.error"),
              description: t("firm.reviews.errorPost"),
              variant: "destructive"
          })
      }
  }

  const handleDeleteReview = async () => {
      if (confirm(t("firm.reviews.deleteConfirm"))) {
          try {
              await deleteReviewMutation.mutateAsync({ firmId: id as string })
              toast({
                  title: t("common.success"),
                  description: t("firm.reviews.successDelete")
              })
              refetchReviews()
          } catch (error) {
              toast({
                  title: t("common.error"),
                  description: t("firm.reviews.errorDelete"),
                  variant: "destructive"
              })
          }
      }
  }

  const openReviewDialog = (review?: any) => {
      if (!userInfo) {
          router.push("/login")
          return
      }
      
      if (review) {
          setEditingReview(review)
          setReviewRating(review.rating)
          setReviewComment(review.comment)
      } else {
          setEditingReview(null)
          setReviewRating(0)
          setReviewComment("")
      }
      setIsReviewDialogOpen(true)
  }

  const scrollReviews = (direction: 'left' | 'right') => {
      if (reviewsScrollRef.current) {
          const scrollAmount = 350 + 24; // Card width + gap
          reviewsScrollRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
          // Check scroll position after scrolling
          setTimeout(checkScrollPosition, 300);
      }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <div className="h-32 sm:h-48 bg-muted animate-pulse rounded-t-lg" />
            <div className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-16 mb-4">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl bg-muted animate-pulse border-4 border-background" />
                    <div className="flex-1 space-y-2 mt-2">
                        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="space-y-2 mt-6">
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-6">
                <div className="h-48 w-full bg-muted animate-pulse rounded" />
            </div>
        </div>
      </div>
    )
  }

  if (!firm) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <p>{t("companies.noResults")}</p>
      </div>
    )
  }

  const getTranslation = (items: any[], field: string) => {
    if (!items || !Array.isArray(items)) return ""
    const item = items.find(i => i.languageCode === language) || items.find(i => i.languageCode === "en")
    return item?.[field] || ""
  }

  const getCategoryName = (categoryId: string) => {
      const category = categories.find((c: any) => c.id === categoryId)
      if (!category) return t("firm.details.categoryInfo")
      return getTranslation(category.translations, "name")
  }

  const getCategoryIcon = (categoryId: string) => {
      const category = categories.find((c: any) => c.id === categoryId)
      if (!category) return null
      return category.icon
  }

  const formatCompensation = (comp: any) => {
      if (!comp) return null
      return `${comp.minimumSalary} - ${comp.maximumSalary} ${comp.currency}`
  }

  const formatLocation = (job: any) => {
      if (!job.countryId) return t("jobs.remote")
      return "Romania" 
  }

  const renderAnswer = (qa: any) => {
      const questionType = qa.categoryQuestion.type
      const answer = qa.categoryAnswer

      if (!answer) return <span className="text-muted-foreground italic">{t("firm.details.noAnswer")}</span>

      if (questionType === QuestionType.SingleSelect || questionType === QuestionType.MultiSelect) {
          if (!answer.selectedOptionIds || answer.selectedOptionIds.length === 0) return <span className="text-muted-foreground italic">{t("firm.details.noAnswer")}</span>
          
          const selectedOptions = qa.categoryQuestion.options.filter((opt: any) => answer.selectedOptionIds.includes(opt.id))
          return (
              <div className="flex flex-wrap gap-2">
                  {selectedOptions.map((opt: any) => (
                      <Badge key={opt.id} variant="secondary" className="font-normal">
                          {getTranslation(opt.translations, "label")}
                      </Badge>
                  ))}
              </div>
          )
      }

      // For text based answers (String, Text, Number, Date)
      // Check if there are translations for the answer itself (e.g. for Text type)
      if (answer.translations && answer.translations.length > 0) {
          return <p className="whitespace-pre-line">{getTranslation(answer.translations, "text")}</p>
      }

      // Fallback to value if no translations (e.g. Number, Date, or simple String)
      return <p>{answer.value || <span className="text-muted-foreground italic">{t("firm.details.noAnswer")}</span>}</p>
  }

  const hasUserReview = reviews.some((r: any) => r.isCurrentPersonReview)
  const isFirmAccount = userInfo?.hasFirm
  const totalReviews = firm.reviewsCount || 0
  const totalPages = Math.ceil(totalReviews / pageSize)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/10 to-accent/10 relative">
             {/* Cover Image placeholder or actual image if available */}
             {firm.bannerUrl && (
                <Image 
                    src={firm.bannerUrl}
                    alt="Cover" 
                    fill 
                    className="object-cover"
                />
             )}
          </div>
          <CardContent className="relative pt-0 pb-6 px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-16 mb-4">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl border-4 border-background bg-white shadow-md overflow-hidden flex items-center justify-center relative">
                {firm.logoUrl ? (
                  <Image
                    src={firm.logoUrl}
                    alt={firm.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">{firm.name}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  {firm.links.website && (
                    <a href={firm.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                 {/* Social Links */}
                 {firm.links.linkedIn && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={firm.links.linkedIn} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </Button>
                 )}
                 {firm.links.facebook && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={firm.links.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                        </a>
                    </Button>
                 )}
                 {firm.links.twitter && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={firm.links.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                        </a>
                    </Button>
                 )}
                 {firm.links.instagram && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={firm.links.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                        </a>
                    </Button>
                 )}
              </div>
            </div>
            
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">{t("firm.details.description")}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{firm.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                        {t("firm.details.about")}
                    </TabsTrigger>
                    <TabsTrigger value="jobs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                        {t("firm.details.jobs")} ({jobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                        {t("firm.details.events")}
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="mt-6 space-y-6">
                    {/* Dynamic Forms/Categories */}
                    {firm.forms.map((form) => {
                        // Sort questions: Type 2 (Text) questions go last
                        const sortedQuestions = [...form.questionsWithAnswers].sort((a, b) => {
                            const aIsType2 = a.categoryQuestion.type === QuestionType.Text;
                            const bIsType2 = b.categoryQuestion.type === QuestionType.Text;
                            
                            if (aIsType2 && !bIsType2) return 1;
                            if (!aIsType2 && bIsType2) return -1;
                            return 0;
                        });

                        const categoryIcon = getCategoryIcon(form.categoryId);

                        return (
                            <Accordion type="single" collapsible className="w-full" key={form.categoryId}>
                                <AccordionItem value={form.categoryId} className="border rounded-lg px-4 bg-card">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                {categoryIcon ? renderIcon(categoryIcon, { className: "h-5 w-5" }) : <Briefcase className="h-5 w-5" />}
                                            </div>
                                            <span className="text-lg font-semibold">{getCategoryName(form.categoryId)}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            {sortedQuestions.map((qa, idx) => {
                                                const isFullWidth = qa.categoryQuestion.type === QuestionType.Text;
                                                return (
                                                    <div key={idx} className={`${isFullWidth ? "md:col-span-2" : ""} space-y-2`}>
                                                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                                            {getTranslation(qa.categoryQuestion.translations, "description")}
                                                        </h4>
                                                        <div className="text-base bg-muted/30 p-3 rounded-md border border-border/50">
                                                            {renderAnswer(qa)}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )
                    })}
                </TabsContent>

                <TabsContent value="jobs" className="mt-6">
                    {jobsLoading ? (
                        <div className="text-center py-8">{t("common.loading")}</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">{t("jobs.noResults")}</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {jobs.map((job: any) => (
                                <motion.div
                                  key={job.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                    <div className="p-4 sm:p-6 flex-1">
                                      <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg sm:text-xl line-clamp-1">{job.title}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mt-1">
                                              <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{formatLocation(job)}</span>
                                              </div>
                                            </div>
                                        </div>
                                        <Badge variant={job.externalApplication ? "secondary" : "default"} className="text-[10px] sm:text-xs shrink-0">
                                          {job.externalApplication ? t("jobs.external") : t("jobs.easyApply")}
                                        </Badge>
                                      </div>

                                      <div className="flex flex-wrap gap-y-2 gap-x-3 sm:gap-x-4 text-xs sm:text-sm text-muted-foreground mb-6">
                                        <div className="flex items-center gap-1">
                                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                          <span>{t(`enums.hrSpecialization.${HrSpecialization[job.specialization]}` as any)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                          <span>{t(`enums.employmentType.${EmploymentType[job.employmentType]}` as any)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                          <span>{t(`enums.jobSeniority.${JobSeniority[job.seniority]}` as any)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                          <span>{t(`enums.workLocationType.${WorkLocationType[job.workLocationType]}` as any)}</span>
                                        </div>
                                        {job.compensation && (
                                          <div className="flex items-center gap-1">
                                            <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span>{formatCompensation(job.compensation)}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                          {t("jobs.postedOn")} {new Date(job.postedDate).toLocaleDateString()}
                                        </span>
                                        {job.appliedByCurrentUser ? (
                                          <Button disabled size="sm" className="h-8 sm:h-9 text-xs sm:text-sm gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            {t("jobs.applied")}
                                          </Button>
                                        ) : (
                                          <Button asChild size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                                            <Link href={`/jobpost/${job.id}`}>
                                              {t("jobs.apply")}
                                            </Link>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="events" className="mt-6">
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">{t("events.noResults")}</p>
                    </div>
                </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {firm.universalAnswers && firm.universalAnswers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("firm.generalInfo")}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {firm.universalAnswers.map((ua: any, idx: number) => {
                                const question = universalQuestions.find((q: any) => q.id === ua.universalQuestionId)
                                if (!question) return null

                                const option = question.options.find((o: any) => o.id === ua.selectedOptionId)
                                if (!option) return null
                                
                                return (
                                    <Badge key={idx} variant="secondary" className="font-normal gap-1 text-sm py-1 px-3">
                                        {question.icon && renderIcon(question.icon, { className: "h-3.5 w-3.5" })}
                                        {getTranslation(option.translations, "label")}
                                    </Badge>
                                )
                            })}
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("contact.info")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {firm.contact.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${firm.contact.email}`} className="text-sm hover:underline">{firm.contact.email}</a>
                            </div>
                        )}
                        {firm.contact.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${firm.contact.phone}`} className="text-sm hover:underline">{firm.contact.phone}</a>
                            </div>
                        )}
                        {firm.location && (
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="text-sm">
                                    {locationString || <p>{firm.location.address}</p>}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Reviews Section */}
        <TabsContent value="about" className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    {t("firm.reviews.title")}
                    <span className="text-muted-foreground text-lg font-normal ml-1">({totalReviews})</span>
                </h2>
                <div className="flex items-center gap-4">
                    <Select
                        value={sortingOption.toString()}
                        onValueChange={(value) => setSortingOption(parseInt(value) as ReviewSortingOption)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t("jobs.filters.sortBy")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ReviewSortingOption.MostRecent.toString()}>{t("firm.reviews.sort.mostRecent")}</SelectItem>
                            <SelectItem value={ReviewSortingOption.LeastRecent.toString()}>{t("firm.reviews.sort.leastRecent")}</SelectItem>
                            <SelectItem value={ReviewSortingOption.HighestRating.toString()}>{t("firm.reviews.sort.highestRating")}</SelectItem>
                            <SelectItem value={ReviewSortingOption.LowestRating.toString()}>{t("firm.reviews.sort.lowestRating")}</SelectItem>
                        </SelectContent>
                    </Select>

                    {totalReviews > 10 && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                            title={isReviewsExpanded ? "Collapse" : "Expand"}
                        >
                            {isReviewsExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    )}

                    {!hasUserReview && !isFirmAccount && (
                        <Button onClick={() => openReviewDialog()}>
                            <Star className="h-4 w-4 mr-2" />
                            {t("firm.reviews.write")}
                        </Button>
                    )}
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium text-muted-foreground">{t("firm.reviews.noReviews")}</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">{t("firm.reviews.beFirst")}</p>
                </div>
            ) : (
                <div className="relative group">
                    {!isReviewsExpanded && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 hidden md:flex rounded-full shadow-md border-none",
                                    // Default state: White background, Dark text
                                    "bg-background text-foreground",
                                    // Hover state: Red background, White text
                                    "hover:bg-red-600 hover:text-white",
                                    !canScrollLeft && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => scrollReviews('left')}
                                disabled={!canScrollLeft}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 hidden md:flex rounded-full shadow-md border-none",
                                    // Default state: White background, Dark text
                                    "bg-background text-foreground",
                                    // Hover state: Red background, White text
                                    "hover:bg-red-600 hover:text-white",
                                    !canScrollRight && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => scrollReviews('right')}
                                disabled={!canScrollRight}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}

                    <div
                        ref={reviewsScrollRef}
                        className={`${isReviewsExpanded 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                            : "flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide"}`}
                    >
                        <AnimatePresence>
                            {reviews.map((review: any) => (
                                <motion.div
                                    key={review.personId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`p-6 rounded-xl border flex-shrink-0 w-full md:w-[350px] snap-center flex flex-col ${isReviewsExpanded ? 'w-auto' : ''} ${review.isCurrentPersonReview ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card'}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                <AvatarImage src={review.personAvatarUrl} />
                                                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-sm line-clamp-1">{review.personFullName || "Anonymous"}</h4>
                                                    {review.isCurrentPersonReview && (
                                                        <Badge variant="secondary" className="text-[10px] px-1 h-5">{t("firm.reviews.you")}</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.isCurrentPersonReview && (
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openReviewDialog(review)}>
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleDeleteReview}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                                        {review.comment}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {isReviewsExpanded && totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                                            className={reviewPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {/* Simple pagination logic for now */}
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        // Show first, last, current, and adjacent pages
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= reviewPage - 1 && page <= reviewPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        isActive={reviewPage === page}
                                                        onClick={() => setReviewPage(page)}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            page === reviewPage - 2 ||
                                            page === reviewPage + 2
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))}
                                            className={reviewPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>{editingReview ? t("firm.reviews.edit") : t("firm.reviews.write")}</DialogTitle>
                <DialogDescription>
                    {t("firm.reviews.shareExperience")} {firm.name}. {t("firm.reviews.feedbackHelp")}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                    <Label>{t("firm.reviews.rating")}</Label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    className={`h-8 w-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30 hover:text-yellow-400/50'}`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="comment">{t("firm.reviews.comment")}</Label>
                    <Textarea
                        id="comment"
                        placeholder={t("firm.reviews.placeholder")}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="min-h-[120px]"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>{t("firm.reviews.cancel")}</Button>
                <Button onClick={handleReviewSubmit}>
                    {editingReview ? t("firm.reviews.update") : t("firm.reviews.post")}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}