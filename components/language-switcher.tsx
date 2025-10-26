"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render placeholder during SSR to match initial client render
  if (!mounted) {
    return (
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium" disabled>
          RO
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium" disabled>
          EN
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      <Button
        variant={language === "ro" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("ro")}
        className="h-8 px-3 text-xs font-medium"
      >
        RO
      </Button>
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="h-8 px-3 text-xs font-medium"
      >
        EN
      </Button>
    </div>
  )
}
