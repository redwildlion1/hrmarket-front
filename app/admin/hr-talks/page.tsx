"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient, ApiError } from "@/lib/api/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, FileText } from "lucide-react"
import { useAdminCheck } from "@/hooks/use-admin-check"

interface Blog {
  id: string
  title: string
  content: string // Changed from OutputData to string for HTML content
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

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const result = await apiClient.admin.blogs.getAll()
      setBlogs(result.blogs)
    } catch (error) {
      console.error("Error loading blogs:", error)
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
    router.push("/admin/hr-talks/create")
  }

  const handleEdit = (blog: Blog) => {
    router.push(`/admin/hr-talks/edit/${blog.id}`)
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
      console.error("Error deleting blog:", error)
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
    </div>
  )
}
