"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, Ghost } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Animated 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h1 className="text-[150px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent select-none">
              404
            </h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Ghost className="w-32 h-32 sm:w-40 sm:h-40 text-primary/80" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6 mt-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("notFound.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {t("notFound.description")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="group">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  {t("notFound.backHome")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/jobs">
                  <Search className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  {t("notFound.browseJobs")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
