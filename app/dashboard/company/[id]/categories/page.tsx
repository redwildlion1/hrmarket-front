"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CategoryCard } from "@/components/category/category-card"
import { getCategories, updateCompanyCategories } from "@/lib/api/category"
import type { Category } from "@/lib/types/category"

export default function CompanyCategoriesPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const companyId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => {
        console.error("[v0] Failed to load categories:", error)
        toast({
          title: t("auth.error"),
          description: "Failed to load categories",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleContinue = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: t("auth.error"),
        description: t("company.categories.selectAtLeastOne"),
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      await updateCompanyCategories(companyId, selectedCategories, session.access_token)

      toast({
        title: t("auth.success"),
        description: "Categories updated successfully!",
      })

      router.push(`/dashboard/company/${companyId}/subscription`)
    } catch (error: any) {
      console.error("[v0] Categories update error:", error)
      toast({
        title: t("auth.error"),
        description: error.message || "Failed to update categories",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{t("company.categories.title")}</CardTitle>
          <CardDescription>{t("company.categories.subtitle")}</CardDescription>
          {selectedCategories.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {t("company.categories.selected").replace("{count}", selectedCategories.length.toString())}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                description={category.description}
                selected={selectedCategories.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleContinue} disabled={saving || selectedCategories.length === 0}>
              {saving ? t("common.loading") : t("company.categories.continue")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
