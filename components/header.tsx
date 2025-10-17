"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth/client"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-red shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="text-2xl font-bold gradient-text-red transition-transform group-hover:scale-105">
            HRMarket
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-semibold transition-colors hover:text-primary relative group py-2">
            {t("nav.home")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/companies"
            className="text-sm font-semibold transition-colors hover:text-primary relative group py-2"
          >
            {t("nav.companies")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/talks"
            className="text-sm font-semibold transition-colors hover:text-primary relative group py-2"
          >
            {t("nav.talks")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/events"
            className="text-sm font-semibold transition-colors hover:text-primary relative group py-2"
          >
            {t("nav.events")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link href="/jobs" className="text-sm font-semibold transition-colors hover:text-primary relative group py-2">
            {t("nav.jobs")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold transition-colors hover:text-primary relative group py-2"
          >
            {t("nav.contact")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-red transition-all group-hover:w-full rounded-full" />
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <Button
                size="sm"
                asChild
                className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="font-semibold">
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Link href="/register">{t("nav.register")}</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-background/98 backdrop-blur-xl md:hidden overflow-hidden shadow-lg"
          >
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
              <Link
                href="/"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/companies"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.companies")}
              </Link>
              <Link
                href="/talks"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.talks")}
              </Link>
              <Link
                href="/events"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.events")}
              </Link>
              <Link
                href="/jobs"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.jobs")}
              </Link>
              <Link
                href="/contact"
                className="text-base font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>
              <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                {user ? (
                  <Button size="sm" asChild className="flex-1 h-12 shadow-lg">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild className="flex-1 h-12 bg-transparent border-2">
                      <Link href="/login">{t("nav.login")}</Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1 h-12 shadow-lg">
                      <Link href="/register">{t("nav.register")}</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
