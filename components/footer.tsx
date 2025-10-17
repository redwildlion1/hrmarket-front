"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { Mail, MapPin, Phone, Sparkles, Send } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="border-t border-border bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-2xl font-bold gradient-text-red">HRMarket</div>
            </div>
            <p className="text-base md:text-sm text-muted-foreground leading-relaxed font-semibold">
              {t("footer.tagline")}
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 justify-center md:justify-start group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Bucharest, Romania</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>contact@hrmarket.com</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>+40 123 456 789</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-xl md:text-lg text-primary">{t("nav.home")}</h3>
            <nav className="grid grid-cols-2 gap-3 md:flex md:flex-col text-base md:text-sm">
              <Link
                href="/companies"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("nav.companies")}
              </Link>
              <Link
                href="/talks"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("nav.talks")}
              </Link>
              <Link
                href="/events"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("nav.events")}
              </Link>
              <Link
                href="/jobs"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("nav.jobs")}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-xl md:text-lg text-primary">Legal</h3>
            <nav className="grid grid-cols-2 gap-3 md:flex md:flex-col text-base md:text-sm">
              <Link
                href="/gdpr"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("footer.gdpr")}
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href="/investors"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("footer.investors")}
              </Link>
              <Link
                href="/partner"
                className="text-muted-foreground font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {t("nav.partner")}
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-xl md:text-lg text-primary">{t("footer.newsletter")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay updated with the latest HR trends and opportunities
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-2 h-12"
              />
              <Button type="submit" size="sm" className="w-full h-12 gap-2 shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" />
                {t("footer.subscribe")}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} HRMarket. All rights reserved. Made with ❤️ in Romania
          </p>
        </div>
      </div>
    </footer>
  )
}
