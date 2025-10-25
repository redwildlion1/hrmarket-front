"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderTree, Grid3x3, Briefcase, CheckCircle, CreditCard } from "lucide-react"

export default function AdminPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { userInfo, loading } = useAuth()

  useEffect(() => {
    console.log("[v0] Admin page - loading:", loading, "userInfo:", userInfo)

    if (!loading) {
      if (!userInfo) {
        console.log("[v0] No userInfo, redirecting to login")
        router.push("/login")
      } else if (!userInfo.isAdmin) {
        console.log("[v0] User is not admin, redirecting to login")
        router.push("/login")
      } else {
        console.log("[v0] User is admin, showing admin page")
      }
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
      title: t("admin.clusters"),
      description: "Manage organization clusters",
      icon: FolderTree,
      href: "/admin/clusters",
    },
    {
      title: t("admin.categories"),
      description: "Manage categories within clusters",
      icon: Grid3x3,
      href: "/admin/categories",
    },
    {
      title: t("admin.services"),
      description: "Manage services within categories",
      icon: Briefcase,
      href: "/admin/services",
    },
    {
      title: "Subscription Plans",
      description: "Manage subscription plans and pricing",
      icon: CreditCard,
      href: "/admin/subscriptions",
    },
    {
      title: t("admin.verifyFirms"),
      description: "Verify pending company registrations",
      icon: CheckCircle,
      href: "/admin/verify-firms",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t("admin.dashboard")}</h1>
        <p className="mt-2 text-muted-foreground">
          Manage clusters, categories, services, subscriptions, and verify firms
        </p>
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
