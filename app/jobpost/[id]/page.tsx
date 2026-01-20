"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Globe,
  Star,
  CheckCircle2,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Edit,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCachedCountries, getCachedCounties, getCachedCities } from "@/lib/api/location"
import confetti from "canvas-confetti"
import { useJobPost, useApplyJob } from "@/lib/hooks/use-jobs"

// Enums mapping
const JobSeniority = [
  "Intern",
  "Junior",
  "MidLevel",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "Executive",
]

const EmploymentType = [
  "FullTime",
  "PartTime",
  "Contract",
  "Temporary",
  "Internship",
  "Volunteer",
  "Freelance",
]

const WorkLocationType = ["OnSite", "Hybrid", "Remote"]

const HrSpecialization = [
  "Generalist",
  "Recruiter",
  "TalentAcquisition",
  "Manager",
  "CompensationAndBenefits",
  "EmployeeRelations",
  "TrainingAndDevelopment",
  "OrganizationalDevelopment",
  "LaborRelations",
  "DiversityAndInclusion",
  "Compliance",
  "WellnessCoordinator",
  "Consultant",
]

export default function JobPostPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [locationDetails, setLocationDetails] = useState<{
    city: string
    county: string
    country: string
  }>({ city: "", county: "", country: "" })
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: jobPost, isLoading: loading, error: jobError } = useJobPost(params.id as string)
  const { mutate: applyJob, isPending: isApplying } = useApplyJob()

  useEffect(() => {
    if (jobError) {
        toast({
            title: t("common.error"),
            description: "Failed to load job post",
            variant: "destructive",
        })
    }
  }, [jobError, t, toast])

  useEffect(() => {
    const fetchLocation = async () => {
        if (jobPost?.location) {
            let countryName = "Romania" // Default to Romania
            let countyName = ""
            let cityName = ""
    
            if (jobPost.location.countryId) {
                try {
                    const countries = await getCachedCountries()
                    const country = countries.find((c: any) => c.id === jobPost.location.countryId)
                    if (country) countryName = country.name
                } catch (e) {
                    console.error("Failed to load countries", e)
                }
            }
    
            if (jobPost.location.countryId && jobPost.location.countyId) {
                try {
                    const counties = await getCachedCounties(jobPost.location.countryId)
                    const county = counties.find((c: any) => c.id === jobPost.location.countyId)
                    if (county) countyName = county.name
                } catch (e) {
                    console.error("Failed to load counties", e)
                }
            }
    
            if (jobPost.location.countyId && jobPost.location.cityId) {
                try {
                    const cities = await getCachedCities(jobPost.location.countyId)
                    const city = cities.find((c: any) => c.id === jobPost.location.cityId)
                    if (city) cityName = city.name
                } catch (e) {
                    console.error("Failed to load cities", e)
                }
            }
    
            setLocationDetails({
                country: countryName,
                county: countyName,
                city: cityName
            })
        }
    }
    fetchLocation()
  }, [jobPost])

  const handleApply = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Check if user is a firm (optional, based on your requirement "if I am logged in as a person, not as a firm")
    // Assuming userInfo is stored in localStorage
    const userInfoStr = localStorage.getItem("userInfo")
    if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        if (userInfo.hasFirm) {
             toast({
                title: t("common.error"),
                description: "Firms cannot apply to jobs.", // You might want to add a translation for this
                variant: "destructive",
            })
            return
        }
    }

    applyJob(jobPost!.id, {
        onSuccess: () => {
            // Trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
    
            setShowSuccess(true)
            
            // Wait for animation before reloading (or just let React Query handle the update)
            // Since we invalidate queries, the UI should update automatically to show "Applied"
            // But we want to show the success animation first
            setTimeout(() => {
                // No need to reload, React Query will refetch the job post with appliedByCurrentUser = true
            }, 2000)
        },
        onError: (error: any) => {
            console.error("Failed to apply", error)
            toast({
                title: t("common.error"),
                description: error.message || "Failed to apply to job",
                variant: "destructive",
            })
        }
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: t("jobs.linkCopied"),
      description: t("jobs.linkCopiedDesc"),
    })
  }

  if (loading || !jobPost) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-24 w-24 rounded-xl border bg-white p-2 shadow-sm flex items-center justify-center shrink-0 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/companies/${jobPost.firm.id}`)}
              >
                {jobPost.firm.logoUrl ? (
                  <img
                    src={jobPost.firm.logoUrl}
                    alt={jobPost.firm.name}
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </motion.div>

              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {jobPost.title}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                >
                  <span
                    className="font-medium text-primary cursor-pointer hover:underline flex items-center gap-1"
                    onClick={() => router.push(`/companies/${jobPost.firm.id}`)}
                  >
                    <Building2 className="h-4 w-4" />
                    {jobPost.firm.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {locationDetails.city || "City"}, {locationDetails.country || "Country"} (
                    {t(`enums.workLocationType.${WorkLocationType[jobPost.location.workLocationType]}` as any)})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(jobPost.postedDate).toLocaleDateString()}
                  </span>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex gap-3 w-full md:w-auto"
            >
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              
              {jobPost.canEdit ? (
                <Button 
                  size="lg" 
                  className="flex-1 md:flex-none gap-2"
                  onClick={() => router.push(`/firm/manage/jobs/${jobPost.id}`)}
                >
                  <Edit className="h-4 w-4" />
                  {t("common.edit")}
                </Button>
              ) : jobPost.appliedByCurrentUser ? (
                <Button disabled size="lg" className="flex-1 md:flex-none gap-2 bg-green-600/10 text-green-600 hover:bg-green-600/20 border-green-600/20">
                  <CheckCircle className="h-4 w-4" />
                  {t("jobs.applied")}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className={`flex-1 md:flex-none transition-all duration-300 ${showSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    showSuccess ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {t("jobs.applied")}
                      </motion.div>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )
                  ) : (
                    t("jobs.apply")
                  )}
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{t("jobs.description")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: jobPost.richDescription }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-6"
            >
              {jobPost.requiredTechStack && jobPost.requiredTechStack.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("jobs.techStack")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {jobPost.requiredTechStack.map((tech: string, index: number) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {jobPost.requiredSoftSkills && jobPost.requiredSoftSkills.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("jobs.softSkills")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {jobPost.requiredSoftSkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {jobPost.requiredCertifications && jobPost.requiredCertifications.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("jobs.certifications")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPost.requiredCertifications.map((cert: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{t("jobs.overview")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.filters.employmentType")}</p>
                      <p className="font-medium">
                        {t(`enums.employmentType.${EmploymentType[jobPost.employmentType]}` as any)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.filters.seniority")}</p>
                      <p className="font-medium">
                        {t(`enums.jobSeniority.${JobSeniority[jobPost.seniority]}` as any)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.filters.specialization")}</p>
                      <p className="font-medium">
                        {t(`enums.hrSpecialization.${HrSpecialization[jobPost.specialization]}` as any)}
                      </p>
                    </div>
                  </div>

                  {jobPost.compensation && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("jobs.salary")}</p>
                        <p className="font-medium">
                          {jobPost.compensation.minimumSalary && jobPost.compensation.maximumSalary
                            ? `${jobPost.compensation.minimumSalary} - ${jobPost.compensation.maximumSalary} ${jobPost.compensation.currency}`
                            : t("jobs.competitive")}
                        </p>
                        {jobPost.compensation.isNegotiable && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {t("jobs.negotiable")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* About the Firm */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{t("jobs.aboutCompany")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={jobPost.firm.logoUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {jobPost.firm.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3
                        className="font-semibold hover:text-primary cursor-pointer transition-colors"
                        onClick={() => router.push(`/companies/${jobPost.firm.id}`)}
                      >
                        {jobPost.firm.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{jobPost.firm.averageRating.toFixed(1)}</span>
                        <span>({jobPost.firm.reviewsCount} {t("jobs.reviews")})</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/companies/${jobPost.firm.id}`)}
                  >
                    {t("jobs.viewCompany")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
