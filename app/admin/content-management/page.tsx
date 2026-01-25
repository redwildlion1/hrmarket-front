"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderTree, Grid3x3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ClusterManager } from "@/components/admin/cluster-manager"
import { CategoryManager } from "@/components/admin/category-manager"

export default function ContentManagementPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { userInfo, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("clusters")

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clusters" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.clusters")}</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.categories")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clusters" className="mt-6">
          <ClusterManager />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
