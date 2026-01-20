"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

interface LogoCarouselProps {
  logos?: Array<{ name: string; src: string }>
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
  const { t } = useLanguage()
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Default partner logos if none provided
  const defaultLogos = [
    { name: "Partner 1", src: "/abstract-logo-1.png" },
    { name: "Partner 2", src: "/abstract-logo-geometric.png" },
    { name: "Partner 3", src: "/abstract-logo-design-3.png" },
    { name: "Partner 4", src: "/abstract-logo-4.png" },
    { name: "Partner 5", src: "/abstract-logo-5.png" },
    { name: "Partner 6", src: "/company-logo-6.png" },
  ]

  const displayLogos = logos || defaultLogos

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // If carousel is paused, set timer to auto-resume after 3 seconds
    if (isPaused) {
      timerRef.current = setTimeout(() => {
        setIsPaused(false)
      }, 3000)
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isPaused])

  const handleLogoClick = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="relative w-full overflow-hidden bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("home.trustedBy")}
        </h3>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      <div className="flex gap-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* First set of logos */}
        <div
          className={`flex min-w-full shrink-0 items-center justify-around gap-12 animate-scroll ${isPaused ? "paused" : ""}`}
        >
          {displayLogos.map((logo, idx) => (
            <div
              key={`logo-1-${idx}`}
              onClick={handleLogoClick}
              className="flex h-16 w-32 shrink-0 items-center justify-center grayscale transition-all duration-300 cursor-pointer hover:grayscale-0"
            >
              <img
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                className="h-full w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div
          className={`flex min-w-full shrink-0 items-center justify-around gap-12 animate-scroll ${isPaused ? "paused" : ""}`}
        >
          {displayLogos.map((logo, idx) => (
            <div
              key={`logo-2-${idx}`}
              onClick={handleLogoClick}
              className="flex h-16 w-32 shrink-0 items-center justify-center grayscale transition-all duration-300 cursor-pointer hover:grayscale-0"
            >
              <img
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                className="h-full w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogoCarousel
