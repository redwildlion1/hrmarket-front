"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { renderIcon } from "@/lib/utils/icons"
import { Search, MapPin, Star, Filter, X, Building2, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { motion } from "framer-motion"
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
import { useSearchParams, useRouter } from "next/navigation"
import { useSearchFirms } from "@/lib/hooks/use-firms"
import { useClusters, useUniversalQuestions } from "@/lib/hooks/use-categories"
import { apiClient } from "@/lib/api/client"

type FirmSearchResult = {
  id: string
  name: string
  logoUrl: string | null
  categoryIds: string[] | null
  optionsIds: string[]
  averageRating: number
  reviewsCount: number
  countryId: string | null
  countyId: string | null
  cityId: string | null
}

type UniversalQuestion = {
  id: string
  order: number
  icon: string
  translations: Array<{ languageCode: string; title: string; display: string }>
  options: Array<{
    id: string
    order: number
    translations: Array<{ languageCode: string; label: string }>
  }>
}

type LocationData = {
  id: string
  name: string
}

const QuestionFilter = ({ 
  question, 
  selectedOptions, 
  toggleOption, 
  getTranslation, 
  t 
}: {
  question: UniversalQuestion
  selectedOptions: string[]
  toggleOption: (qId: string, oId: string) => void
  getTranslation: (items: any[], field: string) => string
  t: (key: string) => string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (!isOpen) {
      openTimeoutRef.current = setTimeout(() => setIsOpen(true), 200)
    }
  }

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    if (isOpen) {
      closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 200)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${selectedOptions.some(id => question.options.some(o => o.id === id)) ? 'bg-accent text-accent-foreground border-solid' : ''}`}
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <span className="mr-1 sm:mr-2 truncate max-w-[100px] sm:max-w-none">{getTranslation(question.translations, "display") || getTranslation(question.translations, "title")}</span>
          {selectedOptions.some(id => question.options.some(o => o.id === id)) && (
             <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
          )}
          <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56" 
        align="start"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {question.options.map((option) => (
          <DropdownMenuItem 
            key={option.id}
            onSelect={(e) => {
              e.preventDefault()
              toggleOption(question.id, option.id)
            }}
            className="flex items-center gap-2"
          >
            <Checkbox 
              id={`dropdown-${option.id}`}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => toggleOption(question.id, option.id)}
            />
            <label 
              htmlFor={`dropdown-${option.id}`}
              className="flex-1 cursor-pointer"
            >
              {getTranslation(option.translations, "label")}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function CompaniesPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(12)
  const [pageNumber, setPageNumber] = useState(1)
  const [filtersChanged, setFiltersChanged] = useState(false)
  
  // Data State
  const [countries, setCountries] = useState<LocationData[]>([])
  const [counties, setCounties] = useState<Record<string, LocationData[]>>({})
  const [cities, setCities] = useState<Record<string, LocationData[]>>({})

  // React Query Hooks
  const { data: clusters = [] } = useClusters()
  const { data: questions = [] } = useUniversalQuestions()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    router.replace(`/companies?${params.toString()}`, { scroll: false })
  }, [selectedCategory, router, searchParams])

  // Load countries initially
  useEffect(() => {
      const loadCountries = async () => {
          try {
              const data = await apiClient.location.getCountries()
              setCountries(data)
          } catch (error) {
              console.error("Failed to load countries", error)
          }
      }
      loadCountries()
  }, [])

  // Construct search params for React Query
  const searchRequest = {
    name: debouncedSearchTerm || undefined,
    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    optionIds: selectedOptions.length > 0 ? selectedOptions : undefined,
    pageNumber: pageNumber,
    pageSize: pageSize
  }

  const { data: firms = [], isLoading: loading } = useSearchFirms(searchRequest)

  // Fetch location details for results
  useEffect(() => {
      const fetchLocations = async () => {
          if (!firms.length) return

          const uniqueCountryIds = Array.from(new Set(firms.map((f: FirmSearchResult) => f.countryId).filter(Boolean) as string[]))
          const uniqueCountyIds = Array.from(new Set(firms.map((f: FirmSearchResult) => f.countyId).filter(Boolean) as string[]))
          
          for (const countryId of uniqueCountryIds) {
              if (!counties[countryId]) {
                  try {
                      const countryCounties = await apiClient.location.getCounties(countryId)
                      setCounties(prev => ({ ...prev, [countryId]: countryCounties }))
                  } catch (e) {}
              }
          }

          for (const countyId of uniqueCountyIds) {
              if (!cities[countyId]) {
                  try {
                      const countyCities = await apiClient.location.getCities(countyId)
                      setCities(prev => ({ ...prev, [countyId]: countyCities }))
                  } catch (e) {}
              }
          }
      }
      fetchLocations()
  }, [firms, counties, cities])

  // Reset page number when filters change
  useEffect(() => {
    if (pageNumber !== 1) {
      setPageNumber(1)
    }
  }, [debouncedSearchTerm, selectedCategory, selectedOptions, pageSize])

  const handleApplyFilters = () => {
    if (pageNumber !== 1) {
      setPageNumber(1)
    }
  }

  const toggleOption = (questionId: string, optionId: string) => {
    setSelectedOptions(prev => {
      // If already selected, deselect it
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId)
      }
      
      // Find all option IDs for this question
      const question = questions.find((q: UniversalQuestion) => q.id === questionId)
      const questionOptionIds = question?.options.map((o: any) => o.id) || []
      
      // Remove any other selected option from this question and add the new one
      const newSelected = prev.filter(id => !questionOptionIds.includes(id))
      return [...newSelected, optionId]
    })
  }

  const getTranslation = (items: any[], field: string) => {
    if (!items || !Array.isArray(items)) return ""
    const item = items.find(i => i.languageCode === language) || items.find(i => i.languageCode === "en")
    return item?.[field] || ""
  }

  const getOptionDetails = (optionId: string) => {
    for (const q of questions) {
      const opt = (q as UniversalQuestion).options.find((o: any) => o.id === optionId)
      if (opt) {
        return {
          label: getTranslation(opt.translations, "label"),
          icon: q.icon
        }
      }
    }
    return null
  }

  const getLocationString = (firm: FirmSearchResult) => {
      const parts = []
      if (firm.cityId && firm.countyId && cities[firm.countyId]) {
          const city = cities[firm.countyId].find(c => c.id === firm.cityId)
          if (city) parts.push(city.name)
      }
      if (firm.countyId && firm.countryId && counties[firm.countryId]) {
          const county = counties[firm.countryId].find(c => c.id === firm.countyId)
          if (county) parts.push(county.name)
      }
      if (firm.countryId) {
          const country = countries.find(c => c.id === firm.countryId)
          if (country) parts.push(country.name)
      }
      
      return parts.length > 0 ? parts.join(", ") : "Romania"
  }

  const getCategoryName = (categoryId: string) => {
      // Search in clusters first as they contain the full structure
      for (const cluster of clusters) {
          const category = cluster.categories?.find((c: any) => c.id === categoryId)
          if (category) {
              return getTranslation(category.translations, "name")
          }
      }
      return ""
  }

  const getSelectedCategoryLabel = () => {
    if (selectedCategory === "all") return t("companies.allCategories")
    
    for (const cluster of clusters) {
      const category = cluster.categories?.find((c: any) => c.id === selectedCategory)
      if (category) {
        return getTranslation(category.translations, "name")
      }
    }
    return t("firm.selectOption")
  }

  // Helper component to measure and display categories
  const CategoryList = ({ categoryIds }: { categoryIds: string[] }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleCount, setVisibleCount] = useState(categoryIds.length)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
      const checkOverflow = () => {
        if (!containerRef.current) return

        const container = containerRef.current
        const badges = Array.from(container.children) as HTMLElement[]
        let currentWidth = 0
        const containerWidth = container.offsetWidth
        // Approximate width of the "+X" badge
        const overflowBadgeWidth = 40 
        
        let count = 0
        for (let i = 0; i < badges.length; i++) {
          // If this is the overflow badge (last one potentially), skip it in calculation initially
          if (badges[i].dataset.type === 'overflow') continue

          const badgeWidth = badges[i].offsetWidth + 8 // 8px for gap
          
          if (currentWidth + badgeWidth + (i < categoryIds.length - 1 ? overflowBadgeWidth : 0) > containerWidth) {
            break
          }
          
          currentWidth += badgeWidth
          count++
        }

        // If we can show all, great. If not, show calculated count
        if (count < categoryIds.length) {
            setVisibleCount(Math.max(1, count))
            setIsOverflowing(true)
        } else {
            setVisibleCount(categoryIds.length)
            setIsOverflowing(false)
        }
      }

      // Initial check
      checkOverflow()
      
      // Re-check on resize
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
    }, [categoryIds])

    // We render all initially to let the effect measure them, but hide overflow with CSS
    // Then we update state to show only what fits + overflow badge
    
    return (
      <div ref={containerRef} className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2 overflow-hidden h-6 sm:h-7 w-full relative">
        {categoryIds.map((catId, idx) => {
            const catName = getCategoryName(catId)
            if (!catName) return null
            
            // Hide items that are determined to overflow
            const isHidden = isOverflowing && idx >= visibleCount
            
            return (
                <Badge 
                    key={catId} 
                    variant="outline" 
                    className={`font-normal bg-primary/5 hover:bg-primary/10 border-primary/20 text-[10px] sm:text-xs whitespace-nowrap ${isHidden ? 'hidden' : ''}`}
                    data-type="category"
                >
                    {catName}
                </Badge>
            )
        })}
        
        {isOverflowing && (
            <Popover>
            <PopoverTrigger asChild>
                <Badge 
                    variant="outline" 
                    className="font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground text-[10px] sm:text-xs whitespace-nowrap"
                    data-type="overflow"
                >
                    +{categoryIds.length - visibleCount}
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
                <div className="space-y-2">
                <h4 className="font-medium leading-none text-sm text-muted-foreground mb-2">{t("home.clusters.categories")}</h4>
                <div className="flex flex-wrap gap-2">
                    {categoryIds.map(catId => {
                        const catName = getCategoryName(catId)
                        if (!catName) return null
                        return (
                            <Badge key={catId} variant="outline" className="font-normal bg-primary/5 border-primary/20">
                                {catName}
                            </Badge>
                        )
                    })}
                </div>
                </div>
            </PopoverContent>
            </Popover>
        )}
      </div>
    )
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
            {t("companies.title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("companies.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Top Filter Bar */}
      <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Search */}
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("companies.search")}
                  className="pl-9 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>{t("home.clusters.categories")}</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between font-normal">
                             <span className="truncate">{getSelectedCategoryLabel()}</span>
                             <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[260px] sm:w-[340px]" align="start">
                           <DropdownMenuItem onSelect={() => setSelectedCategory("all")}>
                             {t("companies.allCategories")}
                           </DropdownMenuItem>
                           {clusters.map((cluster: any) => (
                             <DropdownMenuSub key={cluster.id}>
                               <DropdownMenuSubTrigger className="flex items-center gap-2">
                                 {renderIcon(cluster.icon, { className: "h-4 w-4 shrink-0" })}
                                 <span className="truncate">{getTranslation(cluster.translations, "name")}</span>
                               </DropdownMenuSubTrigger>
                               <DropdownMenuPortal>
                                 <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                   {cluster.categories?.map((category: any) => (
                                     <DropdownMenuItem 
                                       key={category.id}
                                       onSelect={() => setSelectedCategory(category.id)}
                                       className="flex items-center justify-between"
                                     >
                                       <span className="truncate">{getTranslation(category.translations, "name")}</span>
                                       {selectedCategory === category.id && (
                                         <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                       )}
                                     </DropdownMenuItem>
                                   ))}
                                 </DropdownMenuSubContent>
                               </DropdownMenuPortal>
                             </DropdownMenuSub>
                           ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator />

                    {/* Universal Questions */}
                    {questions.map((question: UniversalQuestion) => (
                      <div key={question.id} className="space-y-3">
                        <Label>{getTranslation(question.translations, "display") || getTranslation(question.translations, "title")}</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`sheet-${option.id}`}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={() => toggleOption(question.id, option.id)}
                              />
                              <label 
                                htmlFor={`sheet-${option.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {getTranslation(option.translations, "label")}
                              </label>
                            </div>
                          ))}
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    ))}

                    {/* Page Size */}
                    <div className="space-y-2">
                      <Label>{t("companies.itemsPerPage")}</Label>
                      <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={handleApplyFilters} className="w-full">
                        {t("companies.filter")}
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== "all" || selectedOptions.length > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedOptions([])
                    setFiltersChanged(true)
                  }}
                >
                  {t("companies.clearFilters")}
                </Button>
              )}
          </div>

          {/* Horizontal Scrollable Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
             {/* Category Filter - Single Dropdown with Flyouts */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs sm:h-9 sm:text-sm rounded-full px-3 sm:px-4 border-dashed ${selectedCategory !== "all" ? 'bg-accent text-accent-foreground border-solid' : ''}`}
                  >
                    <span className="mr-1 sm:mr-2 truncate max-w-[100px] sm:max-w-[150px]">
                      {selectedCategory === "all" ? t("home.clusters.categories") : getSelectedCategoryLabel()}
                    </span>
                    {selectedCategory !== "all" && (
                       <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                    )}
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[260px] sm:w-56" align="start">
                  <DropdownMenuItem onSelect={() => setSelectedCategory("all")}>
                    {t("companies.allCategories")}
                  </DropdownMenuItem>
                  {clusters.map((cluster: any) => (
                    <DropdownMenuSub key={cluster.id}>
                      <DropdownMenuSubTrigger className="flex items-center gap-2">
                        {renderIcon(cluster.icon, { className: "h-4 w-4 shrink-0" })}
                        <span className="truncate">{getTranslation(cluster.translations, "name")}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                          {cluster.categories?.map((category: any) => (
                            <DropdownMenuItem 
                              key={category.id}
                              onSelect={() => setSelectedCategory(category.id)}
                              className="flex items-center justify-between"
                            >
                              <span className="truncate">{getTranslation(category.translations, "name")}</span>
                              {selectedCategory === category.id && (
                                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Universal Questions Filters */}
              {questions.map((question: UniversalQuestion) => (
                <QuestionFilter 
                  key={question.id}
                  question={question}
                  selectedOptions={selectedOptions}
                  toggleOption={toggleOption}
                  getTranslation={getTranslation}
                  t={t}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p>{t("common.loading")}</p>
          </div>
        ) : firms.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
            <Building2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">{t("companies.noResults")}</p>
            <p className="text-sm text-muted-foreground">{t("companies.noResultsDesc")}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-1">
              {firms.map((firm: FirmSearchResult, index: number) => (
                <motion.div
                  key={firm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                    <CardHeader className="relative pb-2">
                      <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-lg border bg-muted shadow-sm">
                        {firm.logoUrl ? (
                          <Image
                            src={firm.logoUrl}
                            alt={firm.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="line-clamp-1 text-base sm:text-lg">{firm.name}</CardTitle>
                          <div className="mt-1 flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-primary text-primary" />
                            <span className="font-medium text-foreground">{firm.averageRating.toFixed(1)}</span>
                            <span>({firm.reviewsCount})</span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span className="line-clamp-1">{getLocationString(firm)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-2">
                      
                      {/* Categories */}
                      {firm.categoryIds && firm.categoryIds.length > 0 && (
                          <CategoryList categoryIds={firm.categoryIds} />
                      )}

                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {firm.optionsIds.slice(0, 4).map((optId) => {
                          const details = getOptionDetails(optId)
                          if (!details) return null
                          return (
                            <Badge key={optId} variant="secondary" className="font-normal gap-1 text-[10px] sm:text-xs">
                              {details.icon && renderIcon(details.icon, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3" })}
                              {details.label}
                            </Badge>
                          )
                        })}
                        {firm.optionsIds.length > 4 && (
                          <Badge variant="outline" className="font-normal text-[10px] sm:text-xs">
                            +{firm.optionsIds.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full group h-8 sm:h-9 text-xs sm:text-sm" variant="outline" asChild>
                        <Link href={`/companies/${firm.id}`} className="flex items-center justify-center gap-2">
                          {t("companies.viewProfile")}
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
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
                disabled={firms.length < pageSize}
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