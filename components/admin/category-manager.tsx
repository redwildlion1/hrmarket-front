"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { categoriesManagementApi, type CategoryDto, type Translation } from "@/lib/api/categories-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, GripVertical, Grid3x3, FolderTree } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IconPicker } from "@/components/admin/icon-picker"
import { renderIcon } from "@/lib/utils/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTranslation } from "@/lib/utils/translations"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface CategoryFormData {
  icon: string
  clusterId: string | null
  translations: {
    en: { name: string; description: string }
    ro: { name: string; description: string }
  }
}

function SortableCategoryItem({
  category,
  onEdit,
  onDelete,
  onRestore,
}: {
  category: CategoryDto
  onEdit: () => void
  onDelete: () => void
  onRestore?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id })
  const { t, language } = useLanguage()

  const translation = getTranslation(category.translations, language)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <button {...attributes} {...listeners} className="cursor-grab touch-none">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {renderIcon(category.icon, { className: "h-5 w-5" })}
          <h3 className="font-semibold">{translation.name}</h3>
        </div>
        {translation.description && <p className="text-sm text-muted-foreground">{translation.description}</p>}
      </div>
      <div className="flex gap-2">
        {onRestore ? (
          <Button variant="outline" size="sm" onClick={onRestore}>
            {t("admin.restore")}
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export function CategoryManager() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [unassignedCategories, setUnassignedCategories] = useState<CategoryDto[]>([])
  const [deletedCategories, setDeletedCategories] = useState<CategoryDto[]>([])
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    icon: "Grid3x3",
    clusterId: null,
    translations: {
      en: { name: "", description: "" },
      ro: { name: "", description: "" },
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [clustersData, allCategoriesData] = await Promise.all([
        categoriesManagementApi.getClusters(),
        categoriesManagementApi.getAllCategories(),
      ])

      // Filter categories based on their status/assignment
      const deleted = allCategoriesData.filter(c => c.isDeleted)
      const active = allCategoriesData.filter(c => !c.isDeleted)
      
      // Unassigned categories are active categories that are not in any cluster
      // We can check clusterId directly from the category DTO
      const unassigned = active.filter(c => !c.clusterId)

      setClusters(clustersData)
      setCategories(active)
      setUnassignedCategories(unassigned)
      setDeletedCategories(deleted)

    } catch (error) {
      console.error(error)
      toast({
        title: t("common.error"),
        description: "Error loading categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setFormData({
      icon: "Grid3x3",
      clusterId: null,
      translations: {
        en: { name: "", description: "" },
        ro: { name: "", description: "" },
      },
    })
    setDialogOpen(true)
  }

  const openEditDialog = (category: CategoryDto) => {
    setEditingCategory(category)

    const enTranslation = category.translations.find((t) => t.languageCode === "en")
    const roTranslation = category.translations.find((t) => t.languageCode === "ro")

    setFormData({
      icon: category.icon,
      clusterId: category.clusterId,
      translations: {
        en: {
          name: enTranslation?.name || "",
          description: enTranslation?.description || "",
        },
        ro: {
          name: roTranslation?.name || "",
          description: roTranslation?.description || "",
        },
      },
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const translations: Translation[] = [
      {
        languageCode: "en",
        name: formData.translations.en.name,
        description: formData.translations.en.description || undefined,
      },
      {
        languageCode: "ro",
        name: formData.translations.ro.name,
        description: formData.translations.ro.description || undefined,
      },
    ]

    try {
      if (editingCategory) {
        await categoriesManagementApi.updateCategory(editingCategory.id, {
          icon: formData.icon,
          translations,
        })

        // If cluster changed, reassign
        if (formData.clusterId !== editingCategory.clusterId) {
          // If moving to unassigned (null)
          if (!formData.clusterId) {
             await categoriesManagementApi.removeCategoryFromCluster(editingCategory.id)
          } else {
             // If moving to a cluster (from null or another cluster)
             await categoriesManagementApi.addCategoryToCluster(editingCategory.id, formData.clusterId)
          }
        }

        toast({
          title: t("common.success"),
          description: "Category updated successfully",
        })
      } else {
        await categoriesManagementApi.createCategory({
          icon: formData.icon,
          clusterId: formData.clusterId || undefined,
          translations,
        })
        toast({
          title: t("common.success"),
          description: "Category created successfully",
        })
      }
      setDialogOpen(false)
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: editingCategory ? "Error updating category" : "Error creating category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (category: CategoryDto) => {
    if (!confirm(t("admin.confirmDelete"))) return

    try {
      await categoriesManagementApi.softDeleteCategory(category.id)
      toast({
        title: t("common.success"),
        description: "Category deleted successfully",
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error deleting category",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (category: CategoryDto) => {
    try {
      await categoriesManagementApi.restoreCategory(category.id)
      toast({
        title: t("common.success"),
        description: "Category restored successfully",
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error restoring category",
        variant: "destructive",
      })
    }
  }

  const handleCategoryDragEnd = async (event: DragEndEvent, clusterId: string) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const cluster = clusters.find((c) => c.id === clusterId)
      if (!cluster) return

      const oldIndex = cluster.categories.findIndex((c: CategoryDto) => c.id === active.id)
      const newIndex = cluster.categories.findIndex((c: CategoryDto) => c.id === over.id)

      const newCategories = arrayMove(cluster.categories, oldIndex, newIndex)

      // Update local state optimistically
      setClusters((prev) => prev.map((c) => (c.id === clusterId ? { ...c, categories: newCategories } : c)))

      try {
        await categoriesManagementApi.reorderCategoriesInCluster(
          clusterId,
          newCategories.map((c: CategoryDto) => c.id),
        )
        toast({
          title: t("common.success"),
          description: "Categories reordered successfully",
        })
      } catch (error) {
        // Revert on error
        setClusters((prev) => prev.map((c) => (c.id === clusterId ? { ...c, categories: cluster.categories } : c)))
        toast({
          title: t("common.error"),
          description: "Error reordering categories",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("admin.manageCategories")}</h2>
          <p className="text-sm text-muted-foreground">{t("admin.categoriesDesc")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addCategory")}
        </Button>
      </div>

      {/* Assigned Categories by Cluster */}
      <div className="space-y-4">
        {clusters.map((cluster) => {
          const clusterTranslation = getTranslation(cluster.translations, language)

          return (
            <div key={cluster.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{clusterTranslation.name}</h3>
                <span className="text-sm text-muted-foreground">({cluster.categories.length})</span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleCategoryDragEnd(event, cluster.id)}
              >
                <SortableContext
                  items={cluster.categories.map((c: CategoryDto) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 pl-7">
                    {cluster.categories.map((category: CategoryDto) => (
                      <SortableCategoryItem
                        key={category.id}
                        category={category}
                        onEdit={() => openEditDialog(category)}
                        onDelete={() => handleDelete(category)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )
        })}
      </div>

      {/* Unassigned Categories */}
      {unassignedCategories.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">{t("admin.unassignedCategories")}</h3>
          <div className="space-y-2">
            {unassignedCategories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                onEdit={() => openEditDialog(category)}
                onDelete={() => handleDelete(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Deleted Categories */}
      {deletedCategories.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">{t("admin.deletedCategories")}</h3>
          <div className="space-y-2">
            {deletedCategories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                onEdit={() => {}}
                onDelete={() => {}}
                onRestore={() => handleRestore(category)}
              />
            ))}
          </div>
        </div>
      )}

      {categories.length === 0 && unassignedCategories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Grid3x3 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No categories yet. Create your first category!</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? t("admin.editCategory") : t("admin.addCategory")}</DialogTitle>
            <DialogDescription>Fill in the information in both languages</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="icon">{t("admin.icon")}</Label>
              <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster">{t("admin.selectCluster")}</Label>
              <Select
                value={formData.clusterId || "none"}
                onValueChange={(value) => setFormData({ ...formData, clusterId: value === "none" ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.selectCluster")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {clusters.map((cluster) => {
                    const clusterTranslation = getTranslation(cluster.translations, language)
                    return (
                      <SelectItem key={cluster.id} value={cluster.id}>
                        {clusterTranslation.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("admin.englishTranslation")}</h3>
              <div className="space-y-2">
                <Label htmlFor="en-name">{t("admin.name")}</Label>
                <Input
                  id="en-name"
                  value={formData.translations.en.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        en: { ...formData.translations.en, name: e.target.value },
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="en-description">{t("admin.description")}</Label>
                <Textarea
                  id="en-description"
                  value={formData.translations.en.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        en: { ...formData.translations.en, description: e.target.value },
                      },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("admin.romanianTranslation")}</h3>
              <div className="space-y-2">
                <Label htmlFor="ro-name">{t("admin.name")}</Label>
                <Input
                  id="ro-name"
                  value={formData.translations.ro.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        ro: { ...formData.translations.ro, name: e.target.value },
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ro-description">{t("admin.description")}</Label>
                <Textarea
                  id="ro-description"
                  value={formData.translations.ro.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        ro: { ...formData.translations.ro, description: e.target.value },
                      },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit}>{editingCategory ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
