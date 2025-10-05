"use client"

import { useRef, useState, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/language-context"

interface ImageCropperProps {
  src: string
  aspect?: number
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

export function ImageCropper({ src, aspect, onCropComplete, onCancel }: ImageCropperProps) {
  const { t } = useLanguage()
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Canvas is empty"))
          }
        },
        "image/jpeg",
        0.95,
      )
    })
  }, [completedCrop])

  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImg()
    if (croppedImage) {
      onCropComplete(croppedImage)
    }
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("company.media.cropImage")}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={aspect}>
            <img ref={imgRef} src={src || "/placeholder.svg"} alt="Crop preview" className="max-h-[60vh]" />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCropComplete} disabled={!completedCrop}>
            {t("company.media.cropAndSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
