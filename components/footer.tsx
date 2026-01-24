"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState, useEffect } from "react"
import { Mail, MapPin, Phone, Sparkles, Send, CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TranslationKey } from "@/lib/i18n/translations"

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionMessage, setSubscriptionMessage] = useState<TranslationKey>("footer.subscribed")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscriptionMessage("footer.subscribed")
        setIsSubscribed(true)
        setEmail("")
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSubscribed(false)
        }, 3000)
      } else {
        try {
            const data = await response.json()
            if (data.validationErrors?.email?.includes("Validation.Newsletter.EmailAlreadySubscribed")) {
                setSubscriptionMessage("footer.alreadySubscribed")
                setIsSubscribed(true)
                setEmail("")
                setTimeout(() => {
                  setIsSubscribed(false)
                }, 3000)
            } else {
                console.error("Newsletter subscription failed with status:", response.status)
            }
        } catch (e) {
            console.error("Failed to parse error response", e)
        }
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <footer className="border-t border-border bg-gradient-to-b from-muted/30 to-muted/50">
        <div className="container mx-auto px-4 py-16 md:py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </footer>
    )
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
              {t("footer.newsletterDesc")}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isSubscribed}
                className="bg-background border-2 h-12"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={isLoading || isSubscribed}
                className={`w-full h-12 gap-2 shadow-lg shadow-primary/20 transition-all duration-500 ${
                  isSubscribed ? "bg-green-500 hover:bg-green-600" : ""
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{t(subscriptionMessage)}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isLoading ? t("common.loading") : t("footer.subscribe")}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
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
