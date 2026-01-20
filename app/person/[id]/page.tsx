"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { apiClient } from "@/lib/api/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
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
  Phone,
  Linkedin,
  LinkIcon,
  Calendar,
  Clock,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

interface PersonProfile {
  id: string
  userId: string
  userEmail: string
  firstName: string
  lastName: string
  contactEmail?: string
  phoneNumber?: string
  headline: string
  avatarUrl?: string
  resumeUrl?: string
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
  portfolioUrl?: string
  linkedInUrl?: string
  isOpenToRemote: boolean
  availabilityTimeSpanInDays: number
}

export default function PersonProfilePage() {
  const { t } = useLanguage()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<PersonProfile | null>(null)
  const [countries, setCountries] = useState<any[]>([])
  const [counties, setCounties] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    if (params.id) {
      loadProfile(params.id as string)
      loadCountries()
    }
  }, [params.id])

  const loadProfile = async (id: string) => {
    setLoading(true)
    try {
      const data = await apiClient.person.getById(id)
      setProfile(data)

      if (data.location) {
        if (data.location.countryId) {
          loadCounties(data.location.countryId)
        }
        if (data.location.countyId) {
          loadCities(data.location.countyId)
        }
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: t("profile.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
      const data = await apiClient.location.getCountries()
      setCountries(data)
    } catch (error) {
      console.error("Failed to load countries", error)
    }
  }

  const loadCounties = async (countryId: string) => {
    try {
      const data = await apiClient.location.getCounties(countryId)
      setCounties(data)
    } catch (error) {
      console.error("Failed to load counties", error)
    }
  }

  const loadCities = async (countyId: string) => {
    try {
      const data = await apiClient.location.getCities(countyId)
      setCities(data)
    } catch (error) {
      console.error("Failed to load cities", error)
    }
  }

  if (loading || !profile) {
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
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-xl text-primary font-medium mt-1">{profile.headline}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {cities.find((c) => c.id === profile.location.cityId)?.name || "City"},{" "}
                            {countries.find((c) => c.id === profile.location.countryId)?.name || "Country"}
                          </span>
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
                  </div>
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
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.summary || t("profile.noSummary")}
                </p>
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
          {profile.resumeUrl && (
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
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm truncate">Resume</span>
                    </div>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline whitespace-nowrap ml-2"
                    >
                      {t("common.view")}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

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
              </CardHeader>
              <CardContent>
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
              </CardHeader>
              <CardContent>
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
              </CardHeader>
              <CardContent>
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
    </div>
  )
}
