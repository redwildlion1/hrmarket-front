"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { OutputData } from "@editorjs/editorjs"
import { apiClient, ApiError } from "@/lib/api/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, FileText } from "lucide-react"
import { EditorJSWrapper } from "@/components/editor/editor-js-wrapper"
import { useAdminCheck } from "@/hooks/use-admin-check"

interface Blog {
  id: string
  title: string
  content: OutputData
  createdAt: string
  updatedAt: string | null
}

export default function HRTalksAdminPage() {
  useAdminCheck()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState<OutputData | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const result = await apiClient.admin.blogs.getAll()
      setBlogs(result.blogs)
    } catch (error) {
      console.error("[v0] Error loading blogs:", error)
      toast({
        title: t("common.error"),
        description: error instanceof ApiError ? error.detail : "Failed to load blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBlog(null)
    setTitle("")
    setContent(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = async (blog: Blog) => {
    setEditingBlog(blog)
    setTitle(blog.title)
    setContent(blog.content)
    setIsDialogOpen(true)
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

    if (!content || !content.blocks || content.blocks.length === 0) {
      toast({
        title: t("common.error"),
        description: "Content is required",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      if (editingBlog) {
        await apiClient.admin.blogs.update(editingBlog.id, { title, content })
        toast({
          title: t("common.success"),
          description: "Blog updated successfully",
        })
      } else {
        await apiClient.admin.blogs.create({ title, content })
        toast({
          title: t("common.success"),
          description: "Blog created successfully",
        })
      }
      setIsDialogOpen(false)
      loadBlogs()
    } catch (error) {
      console.error("[v0] Error saving blog:", error)
      toast({
        title: t("common.error"),
        description: error instanceof ApiError ? error.detail : "Failed to save blog",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return
    }

    try {
      await apiClient.admin.blogs.delete(id)
      toast({
        title: t("common.success"),
        description: "Blog deleted successfully",
      })
      loadBlogs()
    } catch (error) {
      console.error("[v0] Error deleting blog:", error)
      toast({
        title: t("common.error"),
        description: error instanceof ApiError ? error.detail : "Failed to delete blog",
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{t("admin.hrTalks")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.hrTalksDesc")}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addBlog")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              <CardDescription>
                {new Date(blog.createdAt).toLocaleDateString()}
                {blog.updatedAt && " (edited)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(blog)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {blogs.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-center text-muted-foreground">{t("admin.noBlogs")}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? t("admin.editBlog") : t("admin.addBlog")}</DialogTitle>
            <DialogDescription>{editingBlog ? t("admin.editBlogDesc") : t("admin.addBlogDesc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("admin.title")}</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("admin.content")}</label>
              <div className="mt-1 rounded-md border p-4">
                <EditorJSWrapper holder="editorjs" data={content} onChange={(data) => setContent(data)} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
