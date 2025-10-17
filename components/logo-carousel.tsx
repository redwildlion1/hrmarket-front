"use client"

import { useRef } from "react"

interface LogoCarouselProps {
  logos?: Array<{ name: string; src: string }>
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative w-full overflow-hidden bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by Leading HR Companies
        </h3>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className="flex gap-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {/* First set of logos */}
        <div className="flex min-w-full shrink-0 animate-scroll items-center justify-around gap-12">
          {displayLogos.map((logo, idx) => (
            <div
              key={`logo-1-${idx}`}
              className="flex h-16 w-32 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0"
            >
              <img
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                className="h-full w-full object-contain opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex min-w-full shrink-0 animate-scroll items-center justify-around gap-12">
          {displayLogos.map((logo, idx) => (
            <div
              key={`logo-2-${idx}`}
              className="flex h-16 w-32 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0"
            >
              <img
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                className="h-full w-full object-contain opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogoCarousel
