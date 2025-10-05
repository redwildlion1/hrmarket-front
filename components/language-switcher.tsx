"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

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
