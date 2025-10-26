"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { categoriesManagementApi, type ServiceDto, type Translation } from "@/lib/api/categories-management"
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
import { Plus, Edit, Trash2, GripVertical, Briefcase, Grid3x3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface ServiceFormData {
  categoryId: string
  translations: {
    en: { name: string; description: string }
    ro: { name: string; description: string }
  }
}

function SortableServiceItem({
  service,
  onEdit,
  onDelete,
}: {
  service: ServiceDto
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.id })

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
        <h3 className="font-semibold">{service.name}</h3>
        {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
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

export function ServiceManager() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceDto | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>({
    categoryId: "",
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
      const clustersData = await categoriesManagementApi.getClusters()
      setClusters(clustersData)
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error loading services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingService(null)
    setFormData({
      categoryId: "",
      translations: {
        en: { name: "", description: "" },
        ro: { name: "", description: "" },
      },
    })
    setDialogOpen(true)
  }

  const openEditDialog = (service: ServiceDto) => {
    setEditingService(service)

    const enTranslation = service.translations.find((t) => t.languageCode === "en")
    const roTranslation = service.translations.find((t) => t.languageCode === "ro")

    setFormData({
      categoryId: service.categoryId,
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
      if (editingService) {
        await categoriesManagementApi.updateService(editingService.id, {
          translations,
        })
        toast({
          title: t("common.success"),
          description: "Service updated successfully",
        })
      } else {
        // Find the category to get the next order number
        const category = clusters.flatMap((c) => c.categories).find((cat) => cat.id === formData.categoryId)

        const orderInCategory = category ? category.services.length : 0

        await categoriesManagementApi.createService({
          categoryId: formData.categoryId,
          orderInCategory,
          translations,
        })
        toast({
          title: t("common.success"),
          description: "Service created successfully",
        })
      }
      setDialogOpen(false)
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: editingService ? "Error updating service" : "Error creating service",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (service: ServiceDto) => {
    if (!confirm(t("admin.confirmDelete"))) return

    try {
      await categoriesManagementApi.deleteService(service.id)
      toast({
        title: t("common.success"),
        description: "Service deleted successfully",
      })
      loadData()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error deleting service",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center">{t("common.loading")}</div>
  }

  const allCategories = clusters.flatMap((c) => c.categories)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("admin.manageServices")}</h2>
          <p className="text-sm text-muted-foreground">{t("admin.servicesDesc")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addService")}
        </Button>
      </div>

      {/* Services by Category */}
      <div className="space-y-4">
        {allCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{category.name}</h3>
              <span className="text-sm text-muted-foreground">({category.services.length})</span>
            </div>
            <div className="space-y-2 pl-7">
              {category.services.map((service: ServiceDto) => (
                <SortableServiceItem
                  key={service.id}
                  service={service}
                  onEdit={() => openEditDialog(service)}
                  onDelete={() => handleDelete(service)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {allCategories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No services yet. Create categories first!</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingService ? t("admin.editService") : t("admin.addService")}</DialogTitle>
            <DialogDescription>Fill in the information in both languages</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">{t("admin.selectCategory")}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                disabled={!!editingService}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
            <Button onClick={handleSubmit}>{editingService ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
