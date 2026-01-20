"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Filter, X, Building2, Briefcase, Clock, Globe, ChevronLeft, ChevronRight, Star, Banknote, ChevronDown, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getCachedCountries, getCachedCounties, getCachedCities } from "@/lib/api/location"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSearchParams, useRouter } from "next/navigation"
import { useSearchJobs } from "@/lib/hooks/use-jobs"

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

enum TimeAgoPosted {
  Last24Hours = 0,
  Last3Days = 1,
  Last7Days = 2,
  Last14Days = 3,
  Last30Days = 4
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

type JobPost = {
  id: string
  title: string
  firmId: string
  specialization: HrSpecialization
  seniority: JobSeniority
  countryId: string | null
  countyId: string | null
  cityId: string | null
  compensation: Compensation | null
  employmentType: EmploymentType
  workLocationType: WorkLocationType
  applicationLink: string | null
  postedDate: string
  views: number
  applicationsCount: number
  externalApplication: boolean
  firmName: string
  firmLogoUrl: string | null
  firmAverageRating: number
  appliedByCurrentUser: boolean
}

export default function JobsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("") 
  const [openSpecializationSearch, setOpenSpecializationSearch] = useState(false)

  // Initialize state from URL params or defaults
  const [specialization, setSpecialization] = useState<string>(searchParams.get("specialization") || "all")
  const [seniorities, setSeniorities] = useState<string[]>(searchParams.get("seniorities")?.split(",") || [])
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(searchParams.get("employmentTypes")?.split(",") || [])
  const [workLocationTypes, setWorkLocationTypes] = useState<string[]>(searchParams.get("workLocationTypes")?.split(",") || [])
  const [postedTimeFrame, setPostedTimeFrame] = useState<string>(searchParams.get("postedTimeFrame") || "all")
  const [justFastApply, setJustFastApply] = useState(searchParams.get("justFastApply") === "true")
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "newest")
  
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(Number(searchParams.get("page")) || 1)
  
  // Location Cache
  const [locationMap, setLocationMap] = useState<Record<string, string>>({})

  // Ref to prevent initial double fetch
  const isInitialMount = useRef(true)

  // Helper to get enum keys
  const getEnumKeys = (e: any) => {
    return Object.keys(e).filter(k => isNaN(Number(k)))
  }

  // Update URL when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams()
    if (specialization !== "all") params.set("specialization", specialization)
    if (seniorities.length > 0) params.set("seniorities", seniorities.join(","))
    if (employmentTypes.length > 0) params.set("employmentTypes", employmentTypes.join(","))
    if (workLocationTypes.length > 0) params.set("workLocationTypes", workLocationTypes.join(","))
    if (postedTimeFrame !== "all") params.set("postedTimeFrame", postedTimeFrame)
    if (justFastApply) params.set("justFastApply", "true")
    if (sortBy !== "newest") params.set("sortBy", sortBy)
    if (pageNumber > 1) params.set("page", pageNumber.toString())

    router.replace(`/jobs?${params.toString()}`, { scroll: false })
  }, [specialization, seniorities, employmentTypes, workLocationTypes, postedTimeFrame, justFastApply, sortBy, pageNumber, router])

  // Construct search params for React Query
  const searchRequest = {
    page: pageNumber,
    pageSize: pageSize,
    justFastApply: justFastApply,
    sortByNewest: sortBy === "newest",
    sortByOldest: sortBy === "oldest",
    sortByMostViewed: sortBy === "mostViewed",
    sortByLeastViewed: sortBy === "leastViewed",
    sortByMostApplied: sortBy === "mostApplied",
    sortByLeastApplied: sortBy === "leastApplied",
    specialization: specialization !== "all" ? Number(specialization) : undefined,
    seniorities: seniorities.length > 0 ? seniorities.map(Number) : undefined,
    employmentTypes: employmentTypes.length > 0 ? employmentTypes.map(Number) : undefined,
    workLocationTypes: workLocationTypes.length > 0 ? workLocationTypes.map(Number) : undefined,
    postedTimeFrame: postedTimeFrame !== "all" ? Number(postedTimeFrame) : undefined,
  }

  const { data: searchResult, isLoading: loading } = useSearchJobs(searchRequest)
  const jobs = searchResult?.documents || []
  const totalCount = searchResult?.totalCount || 0

  // Fetch location names for the jobs
  useEffect(() => {
    const fetchLocations = async () => {
        if (!jobs.length) return

        const newLocationMap = { ...locationMap }
        let mapChanged = false
        
        const uniqueCountryIds = new Set<string>()
        const uniqueCountyIds = new Set<string>()
        const uniqueCityIds = new Set<string>()
        
        jobs.forEach((job: JobPost) => {
          if (job.countryId && !newLocationMap[job.countryId]) uniqueCountryIds.add(job.countryId)
          if (job.countyId && !newLocationMap[job.countyId]) uniqueCountyIds.add(job.countyId)
          if (job.cityId && !newLocationMap[job.cityId]) uniqueCityIds.add(job.cityId)
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
        
        for (const job of jobs) {
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
  }, [jobs])

  const handleApplyFilters = () => {
    if (pageNumber !== 1) {
      setPageNumber(1)
    }
  }

  const clearFilters = () => {
    setSpecialization("all")
    setSearchTerm("")
    setSeniorities([])
    setEmploymentTypes([])
    setWorkLocationTypes([])
    setPostedTimeFrame("all")
    setJustFastApply(false)
    setSortBy("newest")
    setPageNumber(1)
  }
  
  const formatLocation = (job: JobPost) => {
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

  const toggleSelection = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value))
    } else {
      setList([...list, value])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("jobs.title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("jobs.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Top Filter Bar */}
      <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Search */}
             <div className="relative flex-1 max-w-md">
                <Popover open={openSpecializationSearch} onOpenChange={setOpenSpecializationSearch}>
                  <PopoverTrigger asChild>
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("jobs.filters.specialization")}
                        className="pl-9 h-9 text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setOpenSpecializationSearch(true)
                        }}
                        onClick={() => setOpenSpecializationSearch(true)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading={t("jobs.search.specializationsGroup")}>
                          {getEnumKeys(HrSpecialization)
                            .filter(key => t(`enums.hrSpecialization.${key}` as any).toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((key) => (
                            <CommandItem
                              key={key}
                              onSelect={() => {
                                setSpecialization(HrSpecialization[key as keyof typeof HrSpecialization].toString())
                                setSearchTerm(t(`enums.hrSpecialization.${key}` as any))
                                setOpenSpecializationSearch(false)
                              }}
                            >
                              {t(`enums.hrSpecialization.${key}` as any)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* All Filters Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-9 rounded-full px-3 sm:px-4 border-dashed text-xs sm:text-sm">
                    <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("common.allFilters")}</span>
                    <span className="sm:hidden">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t("common.allFilters")}</SheetTitle>
                    <SheetDescription>
                      {t("companies.filter")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    
                    {/* Specialization */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.specialization")}</Label>
                      <Select value={specialization} onValueChange={setSpecialization}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("jobs.filters.anySpecialization")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("jobs.filters.anySpecialization")}</SelectItem>
                          {getEnumKeys(HrSpecialization).map((key) => (
                            <SelectItem key={key} value={HrSpecialization[key as keyof typeof HrSpecialization].toString()}>
                              {t(`enums.hrSpecialization.${key}` as any)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Seniority */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.seniority")}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {getEnumKeys(JobSeniority).map((key) => {
                          const value = JobSeniority[key as keyof typeof JobSeniority].toString()
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`sheet-seniority-${key}`}
                                checked={seniorities.includes(value)}
                                onCheckedChange={() => toggleSelection(seniorities, setSeniorities, value)}
                              />
                              <Label htmlFor={`sheet-seniority-${key}`}>{t(`enums.jobSeniority.${key}` as any)}</Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.employmentType")}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {getEnumKeys(EmploymentType).map((key) => {
                          const value = EmploymentType[key as keyof typeof EmploymentType].toString()
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`sheet-employment-${key}`}
                                checked={employmentTypes.includes(value)}
                                onCheckedChange={() => toggleSelection(employmentTypes, setEmploymentTypes, value)}
                              />
                              <Label htmlFor={`sheet-employment-${key}`}>{t(`enums.employmentType.${key}` as any)}</Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Work Location Type */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.workLocationType")}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {getEnumKeys(WorkLocationType).map((key) => {
                          const value = WorkLocationType[key as keyof typeof WorkLocationType].toString()
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`sheet-location-${key}`}
                                checked={workLocationTypes.includes(value)}
                                onCheckedChange={() => toggleSelection(workLocationTypes, setWorkLocationTypes, value)}
                              />
                              <Label htmlFor={`sheet-location-${key}`}>{t(`enums.workLocationType.${key}` as any)}</Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Posted Time */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.posted")}</Label>
                      <Select value={postedTimeFrame} onValueChange={setPostedTimeFrame}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("jobs.filters.anyTime")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("jobs.filters.anyTime")}</SelectItem>
                          {getEnumKeys(TimeAgoPosted).map((key) => (
                            <SelectItem key={key} value={TimeAgoPosted[key as keyof typeof TimeAgoPosted].toString()}>
                              {t(`enums.timeAgoPosted.${key}` as any)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Just Fast Apply */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sheet-fast-apply" 
                        checked={justFastApply}
                        onCheckedChange={(checked) => setJustFastApply(checked as boolean)}
                      />
                      <Label htmlFor="sheet-fast-apply">{t("jobs.filters.justFastApply")}</Label>
                    </div>

                    <Separator />

                    {/* Sort By */}
                    <div className="space-y-2">
                      <Label>{t("jobs.filters.sortBy")}</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">{t("jobs.sort.newest")}</SelectItem>
                          <SelectItem value="oldest">{t("jobs.sort.oldest")}</SelectItem>
                          <SelectItem value="mostViewed">{t("jobs.sort.mostViewed")}</SelectItem>
                          <SelectItem value="leastViewed">{t("jobs.sort.leastViewed")}</SelectItem>
                          <SelectItem value="mostApplied">{t("jobs.sort.mostApplied")}</SelectItem>
                          <SelectItem value="leastApplied">{t("jobs.sort.leastApplied")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={handleApplyFilters} className="w-full">
                        {t("jobs.filters.apply")}
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Clear Filters */}
              {(specialization !== "all" || seniorities.length > 0 || employmentTypes.length > 0 || workLocationTypes.length > 0 || postedTimeFrame !== "all" || justFastApply || sortBy !== "newest") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-2 text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  {t("jobs.filters.clear")}
                </Button>
              )}
          </div>

          {/* Horizontal Scrollable Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
             
              {/* Seniority Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${seniorities.length > 0 ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2">{t("jobs.filters.seniority")}</span>
                    {seniorities.length > 0 && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {getEnumKeys(JobSeniority).map((key) => {
                    const value = JobSeniority[key as keyof typeof JobSeniority].toString()
                    return (
                      <DropdownMenuCheckboxItem 
                        key={key} 
                        checked={seniorities.includes(value)}
                        onCheckedChange={() => toggleSelection(seniorities, setSeniorities, value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {t(`enums.jobSeniority.${key}` as any)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Employment Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${employmentTypes.length > 0 ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2">{t("jobs.filters.employmentType")}</span>
                    {employmentTypes.length > 0 && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {getEnumKeys(EmploymentType).map((key) => {
                    const value = EmploymentType[key as keyof typeof EmploymentType].toString()
                    return (
                      <DropdownMenuCheckboxItem 
                        key={key} 
                        checked={employmentTypes.includes(value)}
                        onCheckedChange={() => toggleSelection(employmentTypes, setEmploymentTypes, value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {t(`enums.employmentType.${key}` as any)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Work Location Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${workLocationTypes.length > 0 ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2">{t("jobs.filters.workLocationType")}</span>
                    {workLocationTypes.length > 0 && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {getEnumKeys(WorkLocationType).map((key) => {
                    const value = WorkLocationType[key as keyof typeof WorkLocationType].toString()
                    return (
                      <DropdownMenuCheckboxItem 
                        key={key} 
                        checked={workLocationTypes.includes(value)}
                        onCheckedChange={() => toggleSelection(workLocationTypes, setWorkLocationTypes, value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {t(`enums.workLocationType.${key}` as any)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Posted Time Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${postedTimeFrame !== "all" ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2">{t("jobs.filters.posted")}</span>
                    {postedTimeFrame !== "all" && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem onSelect={() => setPostedTimeFrame("all")}>
                    {t("jobs.filters.anyTime")}
                  </DropdownMenuItem>
                  {getEnumKeys(TimeAgoPosted).map((key) => (
                    <DropdownMenuItem key={key} onSelect={() => setPostedTimeFrame(TimeAgoPosted[key as keyof typeof TimeAgoPosted].toString())}>
                      {t(`enums.timeAgoPosted.${key}` as any)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort By Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${sortBy !== "newest" ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2">{t("jobs.filters.sortBy")}</span>
                    {sortBy !== "newest" && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem onSelect={() => setSortBy("newest")}>{t("jobs.sort.newest")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("oldest")}>{t("jobs.sort.oldest")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("mostViewed")}>{t("jobs.sort.mostViewed")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("leastViewed")}>{t("jobs.sort.leastViewed")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("mostApplied")}>{t("jobs.sort.mostApplied")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("leastApplied")}>{t("jobs.sort.leastApplied")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p>{t("common.loading")}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
            <Briefcase className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">{t("jobs.noResults")}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 flex-1">
              {jobs.map((job: JobPost, index: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {job.firmLogoUrl ? (
                              <Image
                                src={job.firmLogoUrl}
                                alt={job.firmName}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg sm:text-xl line-clamp-1">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mt-1">
                              <span>{job.firmName}</span>
                              {job.firmAverageRating > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <span>{job.firmAverageRating.toFixed(1)}</span>
                                  </div>
                                </>
                              )}
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{formatLocation(job)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant={job.externalApplication ? "secondary" : "default"} className="text-[10px] sm:text-xs">
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
                              {t("common.moreDetails")}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                disabled={pageNumber === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {t("companies.page")} {pageNumber}
              </span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setPageNumber(prev => prev + 1)}
                disabled={jobs.length < pageSize}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}