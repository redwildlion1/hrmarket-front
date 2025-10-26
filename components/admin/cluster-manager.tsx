"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { categoriesManagementApi, type ClusterDto, type Translation } from "@/lib/api/categories-management"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, GripVertical, FolderTree } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IconPicker } from "@/components/admin/icon-picker"
import { renderIcon } from "@/lib/utils/icons"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface ClusterFormData {
  icon: string
  isActive: boolean
  translations: {
    en: { name: string; description: string }
    ro: { name: string; description: string }
  }
}

function SortableClusterItem({
  cluster,
  onEdit,
  onDelete,
}: { cluster: ClusterDto; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cluster.id })
  const { t } = useLanguage()

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
          {renderIcon(cluster.icon, { className: "h-5 w-5" })}
          <h3 className="font-semibold">{cluster.name}</h3>
          {!cluster.isActive && <span className="text-xs text-muted-foreground">({t("admin.inactive")})</span>}
        </div>
        {cluster.description && <p className="text-sm text-muted-foreground">{cluster.description}</p>}
        <p className="text-xs text-muted-foreground">
          {cluster.categories.length} {t("admin.categories")}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ClusterManager() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [clusters, setClusters] = useState<ClusterDto[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCluster, setEditingCluster] = useState<ClusterDto | null>(null)
  const [formData, setFormData] = useState<ClusterFormData>({
    icon: "FolderTree",
    isActive: true,
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
    loadClusters()
  }, [])

  const loadClusters = async () => {
    try {
      setLoading(true)
      const data = await categoriesManagementApi.getClusters()
      setClusters(data)
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.errorLoadingClusters"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = clusters.findIndex((c) => c.id === active.id)
      const newIndex = clusters.findIndex((c) => c.id === over.id)

      const newClusters = arrayMove(clusters, oldIndex, newIndex)
      setClusters(newClusters)

      try {
        await categoriesManagementApi.reorderClusters(newClusters.map((c) => c.id))
        toast({
          title: t("common.success"),
          description: t("admin.clustersReordered"),
        })
      } catch (error) {
        setClusters(clusters)
        toast({
          title: t("common.error"),
          description: t("admin.errorReorderingClusters"),
          variant: "destructive",
        })
      }
    }
  }

  const openCreateDialog = () => {
    setEditingCluster(null)
    setFormData({
      icon: "FolderTree",
      isActive: true,
      translations: {
        en: { name: "", description: "" },
        ro: { name: "", description: "" },
      },
    })
    setDialogOpen(true)
  }

  const openEditDialog = (cluster: ClusterDto) => {
    setEditingCluster(cluster)

    // Extract translations from the cluster
    const enTranslation = cluster.translations.find((t) => t.languageCode === "en")
    const roTranslation = cluster.translations.find((t) => t.languageCode === "ro")

    setFormData({
      icon: cluster.icon,
      isActive: cluster.isActive,
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
      if (editingCluster) {
        await categoriesManagementApi.updateCluster(editingCluster.id, {
          icon: formData.icon,
          isActive: formData.isActive,
          translations,
        })
        toast({
          title: t("common.success"),
          description: t("admin.clusterUpdated"),
        })
      } else {
        await categoriesManagementApi.createCluster({
          icon: formData.icon,
          translations,
        })
        toast({
          title: t("common.success"),
          description: t("admin.clusterCreated"),
        })
      }
      setDialogOpen(false)
      loadClusters()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: editingCluster ? t("admin.errorUpdatingCluster") : t("admin.errorCreatingCluster"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (cluster: ClusterDto) => {
    if (!confirm(t("admin.confirmDeleteCluster"))) return

    try {
      await categoriesManagementApi.deleteCluster(cluster.id)
      toast({
        title: t("common.success"),
        description: t("admin.clusterDeleted"),
      })
      loadClusters()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.errorDeletingCluster"),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("admin.manageClusters")}</h2>
          <p className="text-sm text-muted-foreground">{t("admin.clustersDesc")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.createCluster")}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={clusters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {clusters.map((cluster) => (
              <SortableClusterItem
                key={cluster.id}
                cluster={cluster}
                onEdit={() => openEditDialog(cluster)}
                onDelete={() => handleDelete(cluster)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {clusters.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderTree className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t("admin.noClusters")}</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCluster ? t("admin.editCluster") : t("admin.createCluster")}</DialogTitle>
            <DialogDescription>{t("admin.clusterFormDesc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="icon">{t("admin.icon")}</Label>
              <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} />
            </div>

            {editingCluster && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">{t("admin.active")}</Label>
              </div>
            )}

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
            <Button onClick={handleSubmit}>{editingCluster ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
