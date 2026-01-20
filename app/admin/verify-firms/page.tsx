"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { adminApi } from "@/lib/api/admin"
import type { FirmVerification } from "@/lib/types/admin"
import { FirmRejectionReasonType } from "@/lib/types/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, ArrowLeft, Building, Mail, Calendar, FileText, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function VerifyFirmsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [firms, setFirms] = useState<FirmVerification[]>([])
  const [selectedFirm, setSelectedFirm] = useState<FirmVerification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"approved" | "rejected">("approved")
  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined)
  const [rejectionNote, setRejectionNote] = useState("")

  useEffect(() => {
    loadFirms()
  }, [router])

  const loadFirms = async () => {
    try {
      const data = await adminApi.getFirmsAwaitingReview()
      setFirms(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        router.push("/login")
        return
      }
      toast({
        title: t("common.error"),
        description: t("firm.loadError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = (firm: FirmVerification, status: "approved" | "rejected") => {
    setSelectedFirm(firm)
    setVerificationStatus(status)
    setRejectionReason(undefined)
    setRejectionNote("")
    setIsDialogOpen(true)
  }

  const handleMoreDetails = (firm: FirmVerification) => {
    router.push(`/admin/verify-firms/${firm.id}`)
  }

  const handleSubmitVerification = async () => {
    if (!selectedFirm) return

    try {
      await adminApi.verifyFirm({
        firmId: selectedFirm.id,
        status: verificationStatus,
        rejectionReason: verificationStatus === "rejected" ? rejectionReason : undefined,
        rejectionNote: verificationStatus === "rejected" ? rejectionNote : undefined,
      })
      toast({ title: t("admin.verifySuccess") })
      setIsDialogOpen(false)
      setSelectedFirm(null)
      loadFirms()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("firm.submitError"),
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Draft",
      1: "AwaitingReview",
      2: "Approved",
      3: "Rejected",
      4: "Suspended",
      5: "Trusted",
    }
    const statusKey = statusMap[status] || "Unknown"
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      AwaitingReview: "secondary",
      Approved: "default",
      Rejected: "destructive",
      Draft: "outline",
      Suspended: "destructive",
      Trusted: "default",
    }
    return <Badge variant={variants[statusKey] || "default"}>{t(`firm.status.${statusKey.toLowerCase()}` as any) || statusKey}</Badge>
  }

  const isSevereRejection = (reason: string | undefined) => {
    if (!reason) return false
    const reasonType = Number(reason)
    return (
      reasonType === FirmRejectionReasonType.InappropriateContent ||
      reasonType === FirmRejectionReasonType.FalseInformation ||
      reasonType === FirmRejectionReasonType.ViolatesTerms
    )
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
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold md:text-4xl">{t("admin.verifyFirms")}</h1>
        <p className="mt-2 text-muted-foreground">{t("admin.verifyFirmsDesc")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {firms.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t("companies.noResults")}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          firms.map((firm) => (
            <Card key={firm.id} className="flex flex-col">
              <CardHeader>
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                  <Image
                    src={firm.bannerUrl || "/placeholder.svg"}
                    alt={`${firm.name} banner`}
                    layout="fill"
                    objectFit="cover"
                    className="bg-muted"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Image
                      src={firm.logoUrl || "/placeholder.svg"}
                      alt={`${firm.name} logo`}
                      width={64}
                      height={64}
                      className="rounded-full border-4 border-background bg-background"
                    />
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{firm.name}</CardTitle>
                  {getStatusBadge(firm.status)}
                </div>
                <p className="text-sm text-muted-foreground">{firm.type}</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{t("firm.cui")}:</span> {firm.cui}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{t("firm.ownerEmail")}:</span> {firm.ownerEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{t("jobs.postedOn")}:</span>{" "}
                    {new Date(firm.submittedForReviewAt).toLocaleDateString()}
                  </span>
                </div>
                {firm.description && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <p className="line-clamp-3">{firm.description}</p>
                  </div>
                )}
              </CardContent>
              <div className="flex items-center justify-between p-4 border-t bg-muted/10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoreDetails(firm)}
                  className="gap-2"
                >
                  <Info className="h-4 w-4" />
                  {t("common.moreDetails")}
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleVerify(firm, "approved")}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {t("common.yes")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleVerify(firm, "rejected")}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    {t("common.no")}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {verificationStatus === "approved" ? t("firm.status.approved") : t("firm.status.rejected")}
            </DialogTitle>
            <DialogDescription>
              {selectedFirm?.name} - {selectedFirm?.cui}
            </DialogDescription>
          </DialogHeader>
          {verificationStatus === "rejected" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">{t("firm.rejectionReason")}</Label>
                <Select onValueChange={setRejectionReason} value={rejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("firm.selectRejectionReason")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FirmRejectionReasonType)
                      .filter(([key]) => isNaN(Number(key)))
                      .map(([key, value]) => (
                        <SelectItem key={value} value={String(value)}>
                          {isSevereRejection(String(value)) && (
                            <span className="mr-2 text-red-500 font-bold">!</span>
                          )}
                          {t(`enums.firmRejectionReasonType.${key}` as any)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isSevereRejection(rejectionReason) && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{t("firm.rejectionWarning")}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="rejectionNote">{t("contact.message")}</Label>
                <Textarea
                  id="rejectionNote"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder={t("firm.answerPlaceholder")}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmitVerification}
              variant={verificationStatus === "approved" ? "default" : "destructive"}
            >
              {t("common.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
