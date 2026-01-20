"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useLanguage } from "@/lib/i18n/language-context"
import { apiClient } from "@/lib/api/client"
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
import { Plus, Trash2, ArrowLeft, Edit, GripVertical, X } from 'lucide-react'
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { IconPicker } from "@/components/admin/icon-picker"
import { renderIcon } from "@/lib/utils/icons"

type UniversalQuestion = {
  id: string
  icon?: string
  order: number
  isRequired: boolean
  isActive?: boolean
  createdAt: string
  updatedAt: string | null
  translations: Array<{
    languageCode: string
    title: string
    display: string
    description: string | null
    placeholder: string | null
  }>
  options: Array<{
    id: string
    value: string
    order: number
    metadata: string | null
    translations: Array<{
      languageCode: string
      label: string
      display: string
      description: string | null
    }>
  }>
}

type QuestionOption = {
  value: string
  order: number
  labelEn: string
  labelRo: string
  displayEn: string
  displayRo: string
  descriptionEn?: string
  descriptionRo?: string
  metadata?: string
}

export default function UniversalQuestionsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<UniversalQuestion[]>([])

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<UniversalQuestion | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    icon: "HelpCircle",
    order: 0,
    isRequired: false,
    titleEn: "",
    titleRo: "",
    displayEn: "",
    displayRo: "",
    descriptionEn: "",
    descriptionRo: "",
    placeholderEn: "",
    placeholderRo: "",
    options: [] as QuestionOption[],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await apiClient.admin.universalQuestions.getAll()
      setQuestions(data || [])
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to load universal questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const translations = [
        {
          languageCode: "en",
          title: formData.titleEn,
          display: formData.displayEn,
          description: formData.descriptionEn || undefined,
          placeholder: formData.placeholderEn || undefined,
        },
        {
          languageCode: "ro",
          title: formData.titleRo,
          display: formData.displayRo,
          description: formData.descriptionRo || undefined,
          placeholder: formData.placeholderRo || undefined,
        },
      ]

      const options = formData.options.map((opt) => ({
        value: opt.value,
        order: opt.order,
        translations: [
          {
            languageCode: "en",
            label: opt.labelEn,
            display: opt.displayEn,
            description: opt.descriptionEn || undefined,
          },
          {
            languageCode: "ro",
            label: opt.labelRo,
            display: opt.displayRo,
            description: opt.descriptionRo || undefined,
          },
        ],
        metadata: opt.metadata || undefined,
      }))

      await apiClient.admin.universalQuestions.create({
        icon: formData.icon,
        order: formData.order,
        isRequired: formData.isRequired,
        translations,
        options,
      })

      toast({ title: t("admin.createSuccess") })
      setIsCreateDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to create question",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingQuestion) return

    try {
      const translations = [
        {
          languageCode: "en",
          title: formData.titleEn,
          display: formData.displayEn,
          description: formData.descriptionEn || undefined,
          placeholder: formData.placeholderEn || undefined,
        },
        {
          languageCode: "ro",
          title: formData.titleRo,
          display: formData.displayRo,
          description: formData.descriptionRo || undefined,
          placeholder: formData.placeholderRo || undefined,
        },
      ]

      const options = formData.options.map((opt) => ({
        value: opt.value,
        order: opt.order,
        translations: [
          {
            languageCode: "en",
            label: opt.labelEn,
            display: opt.displayEn,
            description: opt.descriptionEn || undefined,
          },
          {
            languageCode: "ro",
            label: opt.labelRo,
            display: opt.displayRo,
            description: opt.descriptionRo || undefined,
          },
        ],
        metadata: opt.metadata || undefined,
      }))

      await apiClient.admin.universalQuestions.update(editingQuestion.id, {
        id: editingQuestion.id,
        icon: formData.icon,
        order: formData.order,
        isRequired: formData.isRequired,
        translations,
        options,
      })

      toast({ title: t("admin.updateSuccess") })
      setIsEditDialogOpen(false)
      setEditingQuestion(null)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to update question",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return

    try {
      await apiClient.admin.universalQuestions.delete(id)
      toast({ title: t("admin.deleteSuccess") })
      loadData()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to delete question",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    setQuestions(updatedItems)

    // TODO: Add reorder API endpoint if needed
    toast({ title: t("admin.reorderSuccess") })
  }

  const getTranslation = (translations: Array<{ languageCode: string; [key: string]: any }>, field: string): string => {
    const translation = translations.find((t) => t.languageCode === language)
    return translation?.[field] || translations[0]?.[field] || ""
  }

  const openEditDialog = (question: UniversalQuestion) => {
    setEditingQuestion(question)

    const enTranslation = question.translations.find((t) => t.languageCode === "en")
    const roTranslation = question.translations.find((t) => t.languageCode === "ro")

    setFormData({
      icon: question.icon || "HelpCircle",
      order: question.order,
      isRequired: question.isRequired,
      titleEn: enTranslation?.title || "",
      titleRo: roTranslation?.title || "",
      displayEn: enTranslation?.display || "",
      displayRo: roTranslation?.display || "",
      descriptionEn: enTranslation?.description || "",
      descriptionRo: roTranslation?.description || "",
      placeholderEn: enTranslation?.placeholder || "",
      placeholderRo: roTranslation?.placeholder || "",
      options: question.options.map((opt) => {
        const enOptTranslation = opt.translations.find((t) => t.languageCode === "en")
        const roOptTranslation = opt.translations.find((t) => t.languageCode === "ro")
        return {
          value: opt.value,
          order: opt.order,
          labelEn: enOptTranslation?.label || "",
          labelRo: roOptTranslation?.label || "",
          displayEn: enOptTranslation?.display || "",
          displayRo: roOptTranslation?.display || "",
          descriptionEn: enOptTranslation?.description || "",
          descriptionRo: roOptTranslation?.description || "",
          metadata: opt.metadata || "",
        }
      }),
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      icon: "HelpCircle",
      order: questions.length,
      isRequired: false,
      titleEn: "",
      titleRo: "",
      displayEn: "",
      displayRo: "",
      descriptionEn: "",
      descriptionRo: "",
      placeholderEn: "",
      placeholderRo: "",
      options: [],
    })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        {
          value: "",
          order: formData.options.length,
          labelEn: "",
          labelRo: "",
          displayEn: "",
          displayRo: "",
        },
      ],
    })
  }

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    })
  }

  const updateOption = (index: number, field: keyof QuestionOption, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setFormData({ ...formData, options: newOptions })
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
          <h1 className="text-3xl font-bold md:text-4xl">{t("admin.universalQuestions")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.universalQuestionsDesc")}</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("admin.addQuestion")}
        </Button>
      </div>

      {/* Questions List - Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
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
                              {renderIcon(question.icon || 'HelpCircle', { className: 'h-5 w-5' })}
                              <CardTitle>{getTranslation(question.translations, "title")}</CardTitle>
                              {question.isRequired && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {t("admin.required")}
                                </span>
                              )}
                            </div>
                            <CardDescription className="mt-1">
                              {getTranslation(question.translations, "display")}
                            </CardDescription>
                            {getTranslation(question.translations, "description") && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {getTranslation(question.translations, "description")}
                              </p>
                            )}
                            {question.options.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                  {t("admin.options")} ({question.options.length}):
                                </p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {question.options.map((opt) => (
                                    <span key={opt.id} className="rounded-md bg-muted px-2 py-1 text-xs">
                                      {getTranslation(opt.translations, "label")}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(question)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(question.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setIsEditDialogOpen(false)
            setEditingQuestion(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? t("admin.editQuestion") : t("admin.addQuestion")}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? t("admin.editQuestionDesc") : t("admin.addQuestionDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Icon Picker */}
            <div className="space-y-2">
              <Label htmlFor="icon">{t("admin.icon")}</Label>
              <IconPicker 
                value={formData.icon} 
                onChange={(icon) => setFormData({ ...formData, icon })} 
              />
            </div>

            {/* Basic Settings */}
            <div className="flex items-center justify-between">
              <Label htmlFor="isRequired">{t("admin.required")}</Label>
              <Switch
                id="isRequired"
                checked={formData.isRequired}
                onCheckedChange={(checked) => setFormData({ ...formData, isRequired: checked })}
              />
            </div>

            {/* Translations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">{t("admin.translations")}</h3>

              {/* English */}
              <div className="space-y-3 rounded-lg border p-4">
                <h4 className="text-sm font-medium">{t("admin.lang.en")}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">{t("admin.title")}</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Question title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayEn">{t("admin.display")}</Label>
                    <Input
                      id="displayEn"
                      value={formData.displayEn}
                      onChange={(e) => setFormData({ ...formData, displayEn: e.target.value })}
                      placeholder="Display text"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">{t("admin.description")}</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholderEn">{t("admin.placeholder")}</Label>
                  <Input
                    id="placeholderEn"
                    value={formData.placeholderEn}
                    onChange={(e) => setFormData({ ...formData, placeholderEn: e.target.value })}
                    placeholder="Optional placeholder"
                  />
                </div>
              </div>

              {/* Romanian */}
              <div className="space-y-3 rounded-lg border p-4">
                <h4 className="text-sm font-medium">{t("admin.lang.ro")}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="titleRo">{t("admin.title")}</Label>
                    <Input
                      id="titleRo"
                      value={formData.titleRo}
                      onChange={(e) => setFormData({ ...formData, titleRo: e.target.value })}
                      placeholder="Titlul întrebării"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayRo">{t("admin.display")}</Label>
                    <Input
                      id="displayRo"
                      value={formData.displayRo}
                      onChange={(e) => setFormData({ ...formData, displayRo: e.target.value })}
                      placeholder="Text afișat"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionRo">{t("admin.description")}</Label>
                  <Textarea
                    id="descriptionRo"
                    value={formData.descriptionRo}
                    onChange={(e) => setFormData({ ...formData, descriptionRo: e.target.value })}
                    placeholder="Descriere opțională"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholderRo">{t("admin.placeholder")}</Label>
                  <Input
                    id="placeholderRo"
                    value={formData.placeholderRo}
                    onChange={(e) => setFormData({ ...formData, placeholderRo: e.target.value })}
                    placeholder="Placeholder opțional"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t("admin.options")}</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("admin.addOption")}
                </Button>
              </div>

              {formData.options.map((option, index) => (
                <div key={index} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      {t("admin.option")} {index + 1}
                    </h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("admin.valueIdentifier")}</Label>
                    <Input
                      value={option.value}
                      onChange={(e) => updateOption(index, "value", e.target.value)}
                      placeholder="option_value"
                    />
                  </div>

                  {/* English Option */}
                  <div className="space-y-2 rounded border-l-2 border-blue-500 pl-3">
                    <p className="text-xs font-medium text-muted-foreground">{t("admin.lang.en")}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        value={option.labelEn}
                        onChange={(e) => updateOption(index, "labelEn", e.target.value)}
                        placeholder="Label"
                      />
                      <Input
                        value={option.displayEn}
                        onChange={(e) => updateOption(index, "displayEn", e.target.value)}
                        placeholder="Display"
                      />
                    </div>
                  </div>

                  {/* Romanian Option */}
                  <div className="space-y-2 rounded border-l-2 border-yellow-500 pl-3">
                    <p className="text-xs font-medium text-muted-foreground">{t("admin.lang.ro")}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        value={option.labelRo}
                        onChange={(e) => updateOption(index, "labelRo", e.target.value)}
                        placeholder="Etichetă"
                      />
                      <Input
                        value={option.displayRo}
                        onChange={(e) => updateOption(index, "displayRo", e.target.value)}
                        placeholder="Afișare"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setIsEditDialogOpen(false)
                setEditingQuestion(null)
                resetForm()
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={editingQuestion ? handleEdit : handleCreate}>
              {editingQuestion ? t("admin.save") : t("admin.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
