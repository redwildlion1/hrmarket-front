"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { adminApi } from "@/lib/api/admin"
import type { Category, Cluster } from "@/lib/types/admin"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", clusterId: "" })

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
      } else {
        loadData()
      }
      setLoading(false)
    })
  }, [router])

  const loadData = async () => {
    try {
      const [categoriesData, clustersData] = await Promise.all([adminApi.getCategories(), adminApi.getClusters()])
      setCategories(categoriesData)
      setClusters(clustersData)
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to load data",
        variant: "destructive",
      })
    }
  }

  const handleCreate = async () => {
    try {
      await adminApi.createCategory({
        name: formData.name,
        description: formData.description,
        clusterId: Number.parseInt(formData.clusterId),
      })
      toast({ title: t("admin.createSuccess") })
      setIsDialogOpen(false)
      setFormData({ name: "", description: "", clusterId: "" })
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.confirmDelete"))) return

    try {
      await adminApi.deleteCategory(id)
      toast({ title: t("admin.deleteSuccess") })
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold md:text-4xl">{t("admin.categories")}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("admin.addCategory")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("admin.addCategory")}</DialogTitle>
              <DialogDescription>Create a new category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clusterId">{t("admin.selectCluster")}</Label>
                <Select
                  value={formData.clusterId}
                  onValueChange={(value) => setFormData({ ...formData, clusterId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.selectCluster")} />
                  </SelectTrigger>
                  <SelectContent>
                    {clusters.map((cluster) => (
                      <SelectItem key={cluster.id} value={cluster.id.toString()}>
                        {cluster.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.categoryName")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("admin.description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("admin.cancel")}
              </Button>
              <Button onClick={handleCreate}>{t("admin.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {category.clusterName && <p className="mt-1 text-xs text-muted-foreground">{category.clusterName}</p>}
                  {category.description && (
                    <CardDescription className="mt-2 text-sm">{category.description}</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
