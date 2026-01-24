"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useAllJobPostsForManagement,
  useExpiredJobPostsForManagement,
  useDeletedJobPostsForManagement,
  useReactivateDeletedJobPost,
  useReactivateExpiredJobPost,
  useDeleteJobPost
} from "@/lib/hooks/use-jobs"
import { Loader2, Eye, Trash2, RefreshCw, ArrowLeft, Plus, Briefcase, Clock, Globe, MapPin, Banknote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getCachedCountries, getCachedCounties, getCachedCities } from "@/lib/api/location"

// Enums matching backend
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

type Compensation = {
  minimumSalary: number
  maximumSalary: number
  currency: string
  isNegotiable: boolean
}

export default function ManageJobsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  
  // Separate pagination state for each tab
  const [activePage, setActivePage] = useState(1)
  const [expiredPage, setExpiredPage] = useState(1)
  const [deletedPage, setDeletedPage] = useState(1)
  
  const pageSize = 10
  const [mounted, setMounted] = useState(false)
  const [locationMap, setLocationMap] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: allJobsData, isLoading: loadingAll } = useAllJobPostsForManagement({ page: activePage, pageSize })
  const { data: expiredJobsData, isLoading: loadingExpired } = useExpiredJobPostsForManagement({ page: expiredPage, pageSize })
  const { data: deletedJobsData, isLoading: loadingDeleted } = useDeletedJobPostsForManagement({ page: deletedPage, pageSize })

  const { mutate: deleteJob } = useDeleteJobPost()
  const { mutate: reactivateDeleted } = useReactivateDeletedJobPost()
  const { mutate: reactivateExpired } = useReactivateExpiredJobPost()

  // Fetch location names for the jobs
  useEffect(() => {
    const fetchLocations = async () => {
        const allJobs = [
            ...(allJobsData?.documents || []),
            ...(expiredJobsData?.documents || []),
            ...(deletedJobsData?.documents || [])
        ]

        if (!allJobs.length) return

        const newLocationMap = { ...locationMap }
        let mapChanged = false
        
        const uniqueCountryIds = new Set<string>()
        
        allJobs.forEach((job: any) => {
          if (job.countryId && !newLocationMap[job.countryId]) uniqueCountryIds.add(job.countryId)
        })
        
        if (uniqueCountryIds.size > 0 || Object.keys(newLocationMap).length === 0) {
            try {
              const countries = await getCachedCountries()
              countries.forEach(c => {
                  newLocationMap[c.id] = c.name
              })
              mapChanged = true
            } catch (e) {
                console.error("Failed to load countries", e)
            }
        }
        
        for (const job of allJobs) {
            if (job.countryId && job.countyId && !newLocationMap[job.countyId]) {
                try {
                    const counties = await getCachedCounties(job.countryId)
                    counties.forEach(c => newLocationMap[c.id] = c.name)
                    mapChanged = true
                } catch (e) {}
            }
            if (job.countyId && job.cityId && !newLocationMap[job.cityId]) {
                try {
                    const cities = await getCachedCities(job.countyId)
                    cities.forEach(c => newLocationMap[c.id] = c.name)
                    mapChanged = true
                } catch (e) {}
            }
        }
        
        if (mapChanged) {
            setLocationMap(newLocationMap)
        }
    }

    fetchLocations()
  }, [allJobsData, expiredJobsData, deletedJobsData])

  const formatLocation = (job: any) => {
      if (!job.countryId) return t("jobs.remote")
      
      const parts = []
      if (job.cityId && locationMap[job.cityId]) parts.push(locationMap[job.cityId])
      if (job.countyId && locationMap[job.countyId]) parts.push(locationMap[job.countyId])
      if (job.countryId && locationMap[job.countryId]) parts.push(locationMap[job.countryId])
      
      return parts.length > 0 ? parts.join(", ") : "Romania" // Fallback
  }

  const formatCompensation = (comp: Compensation | null) => {
      if (!comp) return null
      return `${comp.minimumSalary} - ${comp.maximumSalary} ${comp.currency}`
  }

  const handleDelete = (id: string) => {
    deleteJob(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.deleteSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.deleteError"),
          variant: "destructive",
        })
      }
    })
  }

  const handleReactivateDeleted = (id: string) => {
    reactivateDeleted(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.reactivateSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.reactivateError"),
          variant: "destructive",
        })
      }
    })
  }

  const handleReactivateExpired = (id: string) => {
    reactivateExpired(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.renewSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.renewError"),
          variant: "destructive",
        })
      }
    })
  }

  const PaginationComponent = ({ 
    currentPage, 
    totalCount, 
    onPageChange 
  }: { 
    currentPage: number, 
    totalCount: number, 
    onPageChange: (page: number) => void 
  }) => {
    const totalPages = Math.ceil(totalCount / pageSize)
    
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i)
          pages.push(-1) // Ellipsis
          pages.push(totalPages)
        } else if (currentPage >= totalPages - 2) {
          pages.push(1)
          pages.push(-1) // Ellipsis
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push(-1) // Ellipsis
          pages.push(currentPage - 1)
          pages.push(currentPage)
          pages.push(currentPage + 1)
          pages.push(-1) // Ellipsis
          pages.push(totalPages)
        }
      }
      return pages
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {getPageNumbers().map((pageNum, idx) => (
            <PaginationItem key={idx}>
              {pageNum === -1 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  const JobList = ({ 
    jobsData, 
    type, 
    currentPage, 
    onPageChange 
  }: { 
    jobsData: any, 
    type: 'all' | 'expired' | 'deleted',
    currentPage: number,
    onPageChange: (page: number) => void
  }) => {
    // Handle potential different response structures
    const jobList = Array.isArray(jobsData) ? jobsData : (jobsData?.documents || jobsData?.items || []);
    const totalCount = jobsData?.totalCount || 0;

    if (!jobList || jobList.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">{t("jobs.noResults")}</div>
    }

    return (
      <div className="space-y-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {jobList.map((job: any) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
            <CardContent className="p-6 flex flex-col h-full gap-4">
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2" title={job.title}>{job.title}</h3>
                        <Badge variant={job.externalApplication ? "secondary" : "default"} className="shrink-0 text-[10px]">
                            {job.externalApplication ? t("jobs.external") : t("jobs.easyApply")}
                        </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {job.isExpired && <Badge variant="secondary">{t("firm.status.expired") || "Expired"}</Badge>}
                        {job.isDeleted && <Badge variant="destructive">{t("firm.status.deleted") || "Deleted"}</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{t(`enums.hrSpecialization.${HrSpecialization[job.specialization]}` as any)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{t(`enums.employmentType.${EmploymentType[job.employmentType]}` as any)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{t(`enums.jobSeniority.${JobSeniority[job.seniority]}` as any)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{t(`enums.workLocationType.${WorkLocationType[job.workLocationType]}` as any)}</span>
                    </div>
                    {job.compensation && (
                        <div className="flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5" />
                        <span>{formatCompensation(job.compensation)}</span>
                        </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{formatLocation(job)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <p>{t("jobs.postedOn")}: {new Date(job.postedDate).toLocaleDateString()}</p>
                        <p>{t("jobs.views")}: {job.views} • {t("jobs.applications")}: {job.applicationsCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/firm/manage/jobs/management/${job.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("common.view")}
                  </Button>

                  {type === 'deleted' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReactivateDeleted(job.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("jobs.manage.reactivate")}
                    </Button>
                  )}

                  {type === 'expired' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReactivateExpired(job.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("jobs.manage.renew")}
                    </Button>
                  )}

                  {type !== 'deleted' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("admin.confirmDelete")}</DialogTitle>
                          <DialogDescription>
                            {t("jobs.manage.deleteDesc")}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">{t("common.cancel")}</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                                {t("common.delete")}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
            </CardContent>
          </Card>
        ))}
        </div>
        
        <PaginationComponent 
          currentPage={currentPage} 
          totalCount={totalCount} 
          onPageChange={onPageChange} 
        />
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/firm/manage")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("firm.manageJobs")}</h1>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">{t("jobs.manage.activeJobs")}</TabsTrigger>
          <TabsTrigger value="expired">{t("jobs.manage.expiredJobs")}</TabsTrigger>
          <TabsTrigger value="deleted">{t("jobs.manage.deletedJobs")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loadingAll ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList 
              jobsData={allJobsData} 
              type="all" 
              currentPage={activePage}
              onPageChange={setActivePage}
            />
          )}
        </TabsContent>

        <TabsContent value="expired">
          {loadingExpired ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList 
              jobsData={expiredJobsData} 
              type="expired" 
              currentPage={expiredPage}
              onPageChange={setExpiredPage}
            />
          )}
        </TabsContent>

        <TabsContent value="deleted">
          {loadingDeleted ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList 
              jobsData={deletedJobsData} 
              type="deleted" 
              currentPage={deletedPage}
              onPageChange={setDeletedPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
