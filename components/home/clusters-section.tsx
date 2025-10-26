"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { categoriesManagementApi, type ClusterDto } from "@/lib/api/categories-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { renderIcon } from "@/lib/utils/icons"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslation } from "@/lib/utils/translations"

export function ClustersSection() {
  const { t, language } = useLanguage()
  const [clusters, setClusters] = useState<ClusterDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    loadClusters()
  }, [])

  const loadClusters = async () => {
    try {
      const data = await categoriesManagementApi.getClustersPublic()
      setClusters(data.filter((c) => c.isActive))
      setError(null)
    } catch (err) {
      console.error("[v0] Error loading clusters:", err)
      setError(err instanceof Error ? err.message : "Failed to load clusters")
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

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
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
    return null
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {clusters.map((cluster) => {
            const clusterTranslation = getTranslation(cluster.translations, language)
            const isClusterExpanded = expandedClusters.has(cluster.id)

            return (
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
                          <CardTitle className="text-xl">{clusterTranslation.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {cluster.categories.length} {t("home.clusters.categories")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <motion.div
                          animate={{ rotate: isClusterExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </div>
                    {clusterTranslation.description && (
                      <CardDescription className="mt-2 text-sm">{clusterTranslation.description}</CardDescription>
                    )}
                  </CardHeader>

                  <AnimatePresence mode="wait">
                    {isClusterExpanded && cluster.categories.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <CardContent className="border-t pt-4">
                          <motion.div
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="space-y-2"
                          >
                            {cluster.categories.map((category) => {
                              const categoryTranslation = getTranslation(category.translations, language)
                              const isCategoryExpanded = expandedCategories.has(category.id)

                              return (
                                <div key={category.id} className="rounded-lg border bg-card overflow-hidden">
                                  <div
                                    className="flex items-center gap-2 p-3 cursor-pointer transition-colors hover:bg-accent"
                                    onClick={(e) => toggleCategory(category.id, e)}
                                  >
                                    {renderIcon(category.icon, { className: "h-4 w-4 text-primary flex-shrink-0" })}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{categoryTranslation.name}</p>
                                      {categoryTranslation.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {categoryTranslation.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {category.services.length > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                          {category.services.length} {t("home.clusters.services")}
                                        </span>
                                      )}
                                      {category.services.length > 0 && (
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <motion.div
                                            animate={{ rotate: isCategoryExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </motion.div>
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  <AnimatePresence mode="wait">
                                    {isCategoryExpanded && category.services.length > 0 && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                          duration: 0.4,
                                          ease: [0.4, 0, 0.2, 1],
                                        }}
                                        style={{ overflow: "hidden" }}
                                      >
                                        <div className="border-t bg-muted/30 p-3 space-y-1">
                                          {category.services.map((service) => {
                                            const serviceTranslation = getTranslation(service.translations, language)

                                            return (
                                              <motion.div
                                                key={service.id}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                className="flex items-start gap-2 rounded-md bg-background p-2 text-sm"
                                              >
                                                {renderIcon(service.icon, {
                                                  className: "h-3 w-3 text-primary mt-0.5 flex-shrink-0",
                                                })}
                                                <div className="flex-1 min-w-0">
                                                  <p className="font-medium text-xs">{serviceTranslation.name}</p>
                                                  {serviceTranslation.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                      {serviceTranslation.description}
                                                    </p>
                                                  )}
                                                </div>
                                              </motion.div>
                                            )
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )
                            })}
                          </motion.div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
