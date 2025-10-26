"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAdminCheck } from "@/lib/hooks/use-admin-check"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderTree, Grid3x3, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ContentManagementPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { userInfo, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("clusters")

  useAdminCheck(30000)

  useEffect(() => {
    if (!loading && (!userInfo || !userInfo.isAdmin)) {
      router.push("/login")
    }
  }, [userInfo, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  if (!userInfo?.isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t("admin.contentManagement")}</h1>
        <p className="mt-2 text-muted-foreground">{t("admin.contentManagementDesc")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clusters" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.clusters")}</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.categories")}</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.services")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clusters" className="mt-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold">{t("admin.manageClusters")}</h2>
            <p className="text-muted-foreground">{t("admin.clustersDesc")}</p>
            {/* Cluster management UI will go here */}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold">{t("admin.manageCategories")}</h2>
            <p className="text-muted-foreground">{t("admin.categoriesDesc")}</p>
            {/* Category management UI will go here */}
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold">{t("admin.manageServices")}</h2>
            <p className="text-muted-foreground">{t("admin.servicesDesc")}</p>
            {/* Service management UI will go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
