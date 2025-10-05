"use client"

import type React from "react"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to backend API
    console.log("[v0] Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary">HRMarket</div>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("nav.home")}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/companies" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.companies")}
              </Link>
              <Link href="/talks" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.talks")}
              </Link>
              <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.events")}
              </Link>
              <Link href="/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.jobs")}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/gdpr" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("footer.gdpr")}
              </Link>
              <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("footer.terms")}
              </Link>
              <Link href="/partner" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.partner")}
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.newsletter")}</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="sm">
                {t("footer.subscribe")}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} HRMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
