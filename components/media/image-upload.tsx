"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { ImageCropper } from "./image-cropper"

interface ImageUploadProps {
  label: string
  recommended?: string
  aspect?: number
  value?: string
  onChange: (file: File) => void
  onRemove?: () => void
}

export function ImageUpload({ label, recommended, aspect, value, onChange, onRemove }: ImageUploadProps) {
  const { t } = useLanguage()
  const [preview, setPreview] = useState<string | null>(value || null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCropSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  })

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" })
    onChange(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(croppedBlob)

    setCropSrc(null)
  }

  const handleRemove = () => {
    setPreview(null)
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {recommended && <span className="text-xs text-muted-foreground">{recommended}</span>}
      </div>

      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt={label} className="h-48 w-full object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <Card
          {...getRootProps()}
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors hover:border-primary",
            isDragActive && "border-primary bg-primary/5",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("company.media.dragDrop")}</p>
        </Card>
      )}

      {cropSrc && (
        <ImageCropper
          src={cropSrc || "/placeholder.svg"}
          aspect={aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  )
}
