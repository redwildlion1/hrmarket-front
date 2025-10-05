"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { adminApi } from "@/lib/api/admin"
import type { FirmVerification } from "@/lib/types/admin"
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
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function VerifyFirmsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [firms, setFirms] = useState<FirmVerification[]>([])
  const [selectedFirm, setSelectedFirm] = useState<FirmVerification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "rejected">("verified")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
      } else {
        loadFirms()
      }
      setLoading(false)
    })
  }, [router])

  const loadFirms = async () => {
    try {
      const data = await adminApi.getPendingFirms()
      setFirms(data)
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to load firms",
        variant: "destructive",
      })
    }
  }

  const handleVerify = (firm: FirmVerification, status: "verified" | "rejected") => {
    setSelectedFirm(firm)
    setVerificationStatus(status)
    setNotes("")
    setIsDialogOpen(true)
  }

  const handleSubmitVerification = async () => {
    if (!selectedFirm) return

    try {
      await adminApi.verifyFirm({
        firmId: selectedFirm.id,
        status: verificationStatus,
        notes,
      })
      toast({ title: t("admin.verifySuccess") })
      setIsDialogOpen(false)
      setSelectedFirm(null)
      setNotes("")
      loadFirms()
    } catch (error) {
      toast({
        title: t("admin.error"),
        description: "Failed to verify firm",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      verified: "default",
      rejected: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{t(`admin.${status}`)}</Badge>
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
        <p className="mt-2 text-muted-foreground">Review and verify pending company registrations</p>
      </div>

      <div className="space-y-4">
        {firms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pending firms to verify</p>
            </CardContent>
          </Card>
        ) : (
          firms.map((firm) => (
            <Card key={firm.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-xl">{firm.firmName}</CardTitle>
                      {getStatusBadge(firm.status)}
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">{t("admin.cui")}:</span> {firm.cui}
                      </p>
                      <p>
                        <span className="font-medium">{t("admin.contactEmail")}:</span> {firm.contactEmail}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">{t("admin.submittedAt")}:</span>{" "}
                        {new Date(firm.submittedAt).toLocaleDateString()}
                      </p>
                      {firm.notes && (
                        <p className="mt-2">
                          <span className="font-medium">{t("admin.notes")}:</span> {firm.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  {firm.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(firm, "verified")}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {t("admin.verify")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerify(firm, "rejected")}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        {t("admin.reject")}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{verificationStatus === "verified" ? t("admin.verify") : t("admin.reject")} Firm</DialogTitle>
            <DialogDescription>
              {selectedFirm?.firmName} - {selectedFirm?.cui}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">{t("admin.verificationNotes")}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button
              onClick={handleSubmitVerification}
              variant={verificationStatus === "verified" ? "default" : "destructive"}
            >
              {verificationStatus === "verified" ? t("admin.verify") : t("admin.reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
