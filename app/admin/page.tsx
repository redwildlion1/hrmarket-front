"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderTree, CheckCircle, CreditCard, HelpCircle } from "lucide-react"

export default function AdminPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { userInfo, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!userInfo || !userInfo.isAdmin)) {
      router.push("/login")
    }
  }, [userInfo, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  if (!userInfo?.isAdmin) {
    return null
  }

  const adminCards = [
    {
      title: t("admin.contentManagement"),
      description: t("admin.contentManagementDesc"),
      icon: FolderTree,
      href: "/admin/content-management",
    },
    {
      title: t("admin.universalQuestions"),
      description: t("admin.universalQuestionsDesc"),
      icon: HelpCircle,
      href: "/admin/universal-questions",
    },
    {
      title: t("admin.subscriptions"),
      description: t("admin.subscriptionsDesc"),
      icon: CreditCard,
      href: "/admin/subscriptions",
    },
    {
      title: t("admin.verifyFirms"),
      description: t("admin.verifyFirmsDesc"),
      icon: CheckCircle,
      href: "/admin/verify-firms",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t("admin.dashboard")}</h1>
        <p className="mt-2 text-muted-foreground">{t("admin.manageAll")}</p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-sm">{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
