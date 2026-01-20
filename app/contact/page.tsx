"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Send to backend API
      console.log("[v0] Contact form:", { name, email, message })

      toast({
        title: t("auth.success"),
        description: t("contact.successMessage"),
      })

      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="mb-3 sm:mb-4 text-balance text-3xl sm:text-4xl font-bold md:text-5xl">{t("contact.title")}</h1>
        <p className="text-pretty text-base sm:text-lg text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("contact.title")}</CardTitle>
            <CardDescription>{t("contact.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("contact.name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("contact.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading") : t("contact.send")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">contact@hrmarket.ro</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{t("contact.phone")}</p>
                  <p className="text-sm text-muted-foreground">+40 123 456 789</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{t("contact.address")}</p>
                  <p className="text-sm text-muted-foreground">Bucharest, Romania</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
