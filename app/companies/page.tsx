"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CompaniesPage() {
  const { t } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // TODO: Fetch from backend API
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">{t("companies.title")}</h1>
        <p className="text-pretty text-lg text-muted-foreground">{t("companies.subtitle")}</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("companies.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {companies.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{t("companies.noResults")}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* Companies will be loaded from backend */}</div>
    </div>
  )
}
