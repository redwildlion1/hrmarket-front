"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/media/image-upload"
import { uploadCompanyMedia } from "@/lib/api/media"

export default function CompanyMediaPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const companyId = params.id as string

  const [logo, setLogo] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSkip = () => {
    router.push(`/dashboard/company/${companyId}/categories`)
  }

  const handleSubmit = async () => {
    if (!logo && !cover) {
      handleSkip()
      return
    }

    setUploading(true)

    try {
      const uploadPromises = []

      if (logo) {
        uploadPromises.push(uploadCompanyMedia(companyId, "logo", logo))
      }

      if (cover) {
        uploadPromises.push(uploadCompanyMedia(companyId, "cover", cover))
      }

      await Promise.all(uploadPromises)

      toast({
        title: t("auth.success"),
        description: "Media uploaded successfully!",
      })

      router.push(`/dashboard/company/${companyId}/categories`)
    } catch (error: any) {
      console.error("[v0] Media upload error:", error)
      if (error.message?.includes("Unauthorized")) {
        router.push("/login")
        return
      }
      toast({
        title: t("auth.error"),
        description: error.message || "Failed to upload media",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{t("company.media.title")}</CardTitle>
          <CardDescription>{t("company.media.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            label={t("company.media.logo")}
            recommended={t("company.media.recommended").replace("{dimensions}", "400x400px")}
            aspect={1}
            onChange={setLogo}
            onRemove={() => setLogo(null)}
          />

          <ImageUpload
            label={t("company.media.cover")}
            recommended={t("company.media.recommended").replace("{dimensions}", "1200x400px")}
            aspect={3}
            onChange={setCover}
            onRemove={() => setCover(null)}
          />

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSkip} disabled={uploading}>
              {t("company.media.skip")}
            </Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? t("company.media.uploading") : t("company.media.continue")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
