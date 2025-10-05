"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

export function Header() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">HRMarket</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.home")}
          </Link>
          <Link href="/companies" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.companies")}
          </Link>
          <Link href="/talks" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.talks")}
          </Link>
          <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.events")}
          </Link>
          <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.jobs")}
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t("nav.register")}</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link href="/" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.home")}
            </Link>
            <Link href="/companies" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.companies")}
            </Link>
            <Link href="/talks" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.talks")}
            </Link>
            <Link href="/events" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.events")}
            </Link>
            <Link href="/jobs" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.jobs")}
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.contact")}
            </Link>
            <div className="flex gap-2 pt-2">
              {user ? (
                <Button size="sm" asChild className="flex-1">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/register">{t("nav.register")}</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
