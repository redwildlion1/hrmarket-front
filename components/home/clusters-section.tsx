"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { categoriesManagementApi, type ClusterDto } from "@/lib/api/categories-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { renderIcon } from "@/lib/utils/icons"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ClustersSection() {
  const { t } = useLanguage()
  const [clusters, setClusters] = useState<ClusterDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set())
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    loadClusters()
  }, [])

  const loadClusters = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api"
      console.log("[v0] API URL:", apiUrl)
      console.log("[v0] Loading clusters from API...")

      const data = await categoriesManagementApi.getClustersPublic()
      console.log("[v0] Clusters loaded successfully:", data)

      // Only show active clusters for users
      setClusters(data.filter((c) => c.isActive))
      setError(null)
    } catch (err) {
      console.error("[v0] Error loading clusters:", err)
      setError(err instanceof Error ? err.message : "Failed to load clusters")
      // Don't show the section if there's an error
      setClusters([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCluster = (clusterId: string) => {
    setExpandedClusters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(clusterId)) {
        newSet.delete(clusterId)
      } else {
        newSet.add(clusterId)
      }
      return newSet
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  if (loading) {
    return (
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">{t("common.loading")}</div>
        </div>
      </section>
    )
  }

  if (error || clusters.length === 0) {
    // Silently hide the section for production
    // In development, you can uncomment the Alert below to see the error
    return null

    /* Development error display:
    return (
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load services</AlertTitle>
            <AlertDescription>
              {error || "No services available at the moment."}
              <br />
              <span className="text-xs mt-2 block">
                Make sure your backend is running on {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api"}
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
    */
  }

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-24 md:py-32">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <div className="mb-16 text-center">
          <motion.h2 variants={itemVariants} className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            {t("home.clusters.title")}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground md:text-2xl">
            {t("home.clusters.subtitle")}
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clusters.map((cluster) => (
            <motion.div key={cluster.id} variants={itemVariants}>
              <Card className="group h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
                <CardHeader className="cursor-pointer" onClick={() => toggleCluster(cluster.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                        {renderIcon(cluster.icon, {
                          className: "h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white",
                        })}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{cluster.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {cluster.categories.length} {t("home.clusters.categories")}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {expandedClusters.has(cluster.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {cluster.description && (
                    <CardDescription className="mt-2 text-sm">{cluster.description}</CardDescription>
                  )}
                </CardHeader>

                {expandedClusters.has(cluster.id) && cluster.categories.length > 0 && (
                  <CardContent className="border-t pt-4">
                    <div className="space-y-2">
                      {cluster.categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2 rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                        >
                          {renderIcon(category.icon, { className: "h-4 w-4 text-primary" })}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{category.name}</p>
                            {category.description && (
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            )}
                          </div>
                          {category.services.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {category.services.length} {t("home.clusters.services")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
