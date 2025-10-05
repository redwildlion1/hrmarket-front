"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function EventsPage() {
  const { t } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from backend API
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">{t("events.title")}</h1>
        <p className="text-pretty text-lg text-muted-foreground">{t("events.subtitle")}</p>
      </div>

      {events.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{t("events.noResults")}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* Events will be loaded from backend */}</div>
    </div>
  )
}
