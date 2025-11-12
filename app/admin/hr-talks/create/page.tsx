"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient, ApiError } from "@/lib/api/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Monitor, Smartphone, Save, Sparkles } from "lucide-react"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { TemplateSelector } from "@/components/editor/template-selector"
import { useAdminCheck } from "@/hooks/use-admin-check"
import { cn } from "@/lib/utils"
import type { BlogTemplate } from "@/components/editor/blog-templates"

export default function CreateBlogPage() {
  useAdminCheck()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showTemplates, setShowTemplates] = useState(true)

  const handleSelectTemplate = (template: BlogTemplate) => {
    setContent(template.html)
    setShowTemplates(false)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: t("common.error"),
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (!content || content.trim() === "") {
      toast({
        title: t("common.error"),
        description: "Content is required",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await apiClient.admin.blogs.create({ title, content })
      toast({
        title: t("common.success"),
        description: "Blog created successfully",
      })
      router.push("/admin/hr-talks")
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: t("common.error"),
        description: error instanceof ApiError ? error.detail : "Failed to save blog",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TemplateSelector open={showTemplates} onOpenChange={setShowTemplates} onSelectTemplate={handleSelectTemplate} />

      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/hr-talks")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">{t("admin.addBlog")}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Templates
            </Button>

            {/* Preview Mode Toggle */}
            <div className="flex items-center rounded-md border bg-muted p-1">
              <Button
                variant={previewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className="h-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className="h-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-muted/30 py-8">
        <div
          className={cn(
            "mx-auto w-full bg-background shadow-lg transition-all duration-300",
            previewMode === "mobile" ? "max-w-[375px] rounded-xl" : "max-w-[900px] rounded-lg",
          )}
        >
          {/* Title Input */}
          <div className={cn("border-b px-8 py-6", previewMode === "mobile" && "px-4 py-4")}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className={cn(
                "border-0 font-bold focus-visible:ring-0",
                previewMode === "mobile" ? "text-xl" : "text-3xl",
              )}
            />
          </div>

          {/* Editor */}
          <div className={cn("min-h-[600px] px-8 py-6", previewMode === "mobile" && "px-4 py-4")}>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  )
}
