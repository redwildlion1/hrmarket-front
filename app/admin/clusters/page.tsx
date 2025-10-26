"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  categoriesManagementApi,
  type ClusterDto,
  type CategoryDto,
  type Translation,
} from "@/lib/api/categories-management"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, ArrowLeft, Edit, GripVertical, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export default function ClustersPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [clusters, setClusters] = useState<ClusterDto[]>([])
  const [unassignedCategories, setUnassignedCategories] = useState<CategoryDto[]>([])
  const [deletedCategories, setDeletedCategories] = useState<CategoryDto[]>([])

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCluster, setEditingCluster] = useState<ClusterDto | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    icon: "Briefcase",
    nameEn: "",
    nameRo: "",
    descEn: "",
    descRo: "",
    isActive: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [clustersData, unassignedData, deletedData] = await Promise.all([
        categoriesManagementApi.getClusters(),
        categoriesManagementApi.getUnassignedCategories(),
        categoriesManagementApi.getSoftDeletedCategories(),
      ])
      setClusters(clustersData)
      setUnassignedCategories(unassignedData)
      setDeletedCategories(deletedData)
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const translations: Translation[] = [
        { languageCode: "en", name: formData.nameEn, description: formData.descEn },
        { languageCode: "ro", name: formData.nameRo, description: formData.descRo },
      ]

      await categoriesManagementApi.createCluster({
        icon: formData.icon,
        translations,
      })

      toast({ title: t("admin.createSuccess") })
      setIsCreateDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to create cluster",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingCluster) return

    try {
      const translations: Translation[] = [
        { languageCode: "en", name: formData.nameEn, description: formData.descEn },
        { languageCode: "ro", name: formData.nameRo, description: formData.descRo },
      ]

      await categoriesManagementApi.updateCluster(editingCluster.id, {
        icon: formData.icon,
        isActive: formData.isActive,
        translations,
      })

      toast({ title: t("admin.updateSuccess") })
      setIsEditDialogOpen(false)
      setEditingCluster(null)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to update cluster",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return

    try {
      await categoriesManagementApi.deleteCluster(id)
      toast({ title: t("admin.deleteSuccess") })
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to delete cluster",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(clusters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setClusters(items)

    try {
      await categoriesManagementApi.reorderClusters(items.map((c) => c.id))
      toast({ title: t("admin.reorderSuccess") })
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to reorder clusters",
        variant: "destructive",
      })
      loadData()
    }
  }

  const openEditDialog = (cluster: ClusterDto) => {
    setEditingCluster(cluster)
    // Extract translations (assuming backend returns them)
    setFormData({
      icon: cluster.icon,
      nameEn: cluster.name, // TODO: Get from translations
      nameRo: cluster.name,
      descEn: cluster.description || "",
      descRo: cluster.description || "",
      isActive: cluster.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      icon: "Briefcase",
      nameEn: "",
      nameRo: "",
      descEn: "",
      descRo: "",
      isActive: true,
    })
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
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold md:text-4xl">{t("admin.clusters")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.clustersDesc")}</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("admin.addCluster")}
        </Button>
      </div>

      {/* Active Clusters - Drag and Drop */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">{t("admin.activeClusters")}</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="clusters">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {clusters
                  .filter((c) => c.isActive)
                  .map((cluster, index) => (
                    <Draggable key={cluster.id} draggableId={cluster.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="transition-shadow hover:shadow-md"
                        >
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div {...provided.dragHandleProps} className="cursor-grab pt-1">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{cluster.icon}</span>
                                  <CardTitle>{cluster.name}</CardTitle>
                                </div>
                                {cluster.description && (
                                  <CardDescription className="mt-2">{cluster.description}</CardDescription>
                                )}
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {cluster.categories.length} {t("admin.categories")}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(cluster)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(cluster.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Inactive Clusters */}
      {clusters.filter((c) => !c.isActive).length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <EyeOff className="h-5 w-5" />
            {t("admin.inactiveClusters")}
          </h2>
          <div className="space-y-4">
            {clusters
              .filter((c) => !c.isActive)
              .map((cluster) => (
                <Card key={cluster.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{cluster.icon}</span>
                      <div className="flex-1">
                        <CardTitle>{cluster.name}</CardTitle>
                        {cluster.description && (
                          <CardDescription className="mt-2">{cluster.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(cluster)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cluster.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Unassigned Categories */}
      {unassignedCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{t("admin.unassignedCategories")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unassignedCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </div>
                  {category.description && <CardDescription className="mt-2">{category.description}</CardDescription>}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Deleted Categories */}
      {deletedCategories.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-destructive">{t("admin.deletedCategories")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deletedCategories.map((category) => (
              <Card key={category.id} className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await categoriesManagementApi.restoreCategory(category.id)
                          toast({ title: t("admin.restoreSuccess") })
                          loadData()
                        } catch (error) {
                          toast({
                            title: t("admin.error"),
                            description: "Failed to restore category",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      {t("admin.restore")}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.addCluster")}</DialogTitle>
            <DialogDescription>{t("admin.addClusterDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="icon">{t("admin.icon")}</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Briefcase"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("admin.nameEn")}</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameRo">{t("admin.nameRo")}</Label>
                <Input
                  id="nameRo"
                  value={formData.nameRo}
                  onChange={(e) => setFormData({ ...formData, nameRo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="descEn">{t("admin.descriptionEn")}</Label>
                <Textarea
                  id="descEn"
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descRo">{t("admin.descriptionRo")}</Label>
                <Textarea
                  id="descRo"
                  value={formData.descRo}
                  onChange={(e) => setFormData({ ...formData, descRo: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleCreate}>{t("admin.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.editCluster")}</DialogTitle>
            <DialogDescription>{t("admin.editClusterDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">{t("admin.active")}</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">{t("admin.icon")}</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("admin.nameEn")}</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameRo">{t("admin.nameRo")}</Label>
                <Input
                  id="nameRo"
                  value={formData.nameRo}
                  onChange={(e) => setFormData({ ...formData, nameRo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="descEn">{t("admin.descriptionEn")}</Label>
                <Textarea
                  id="descEn"
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descRo">{t("admin.descriptionRo")}</Label>
                <Textarea
                  id="descRo"
                  value={formData.descRo}
                  onChange={(e) => setFormData({ ...formData, descRo: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleEdit}>{t("admin.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
