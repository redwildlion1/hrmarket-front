"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, MapPin, Phone, Send, CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth/client"
import { FormInput } from "@/components/ui/form-input"

export default function ContactPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { userInfo } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (userInfo) {
      if (userInfo.personName) setName(userInfo.personName)
      if (userInfo.email) setEmail(userInfo.email)
    }
  }, [userInfo])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (!name.trim()) {
      newErrors.name = t("admin.required")
      isValid = false
    }

    if (!email.trim()) {
      newErrors.email = t("admin.required")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("firm.validation.invalidEmail")
      isValid = false
    }

    if (!message.trim()) {
      newErrors.message = t("admin.required")
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: t("firm.validationErrors"),
        description: t("firm.validationErrorDesc"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const payload = {
        name,
        email,
        message,
        personId: userInfo?.personId || null,
        companyId: userInfo?.firmId || null,
        accountEmail: userInfo?.email || null
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Newsletter/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSent(true)
        toast({
          title: t("auth.success"),
          description: t("contact.successMessage"),
        })

        setName("")
        setEmail("")
        setMessage("")
        
        setTimeout(() => {
          setIsSent(false)
        }, 3000)
      } else {
        const errorData = await response.json()
        if (errorData.validationErrors) {
            const newErrors: Record<string, string> = {}
            Object.entries(errorData.validationErrors).forEach(([key, messages]) => {
                const message = Array.isArray(messages) ? messages[0] : (messages as string)
                newErrors[key.toLowerCase()] = message
            })
            setErrors(newErrors)
            toast({
                title: t("firm.validationErrors"),
                description: t("firm.validationErrorDesc"),
                variant: "destructive",
            })
        } else {
            throw new Error(errorData.detail || "Failed to send message")
        }
      }
    } catch (error) {
      console.error("Contact form error:", error)
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12 text-center"
      >
        <h1 className="mb-3 sm:mb-4 text-balance text-3xl sm:text-4xl font-bold md:text-5xl text-red-600">
          {t("contact.title")}
        </h1>
        <p className="text-pretty text-base sm:text-lg text-muted-foreground">{t("contact.subtitle")}</p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t("contact.title")}</CardTitle>
              <CardDescription>{t("contact.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <FormInput 
                    id="name" 
                    value={name} 
                    onChange={(e) => {
                        setName(e.target.value)
                        setErrors(prev => ({ ...prev, name: "" }))
                    }} 
                    required 
                    disabled={loading || isSent}
                    error={errors.name}
                    label={t("contact.name")}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setErrors(prev => ({ ...prev, email: "" }))
                    }}
                    required
                    disabled={loading || isSent}
                    error={errors.email}
                    label={t("contact.email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")} <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        setErrors(prev => ({ ...prev, message: "" }))
                    }}
                    required
                    disabled={loading || isSent}
                    className={errors.message ? "border-destructive" : ""}
                    error={errors.message}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>
                <Button 
                  type="submit" 
                  className={`w-full transition-all duration-500 ${isSent ? "bg-green-500 hover:bg-green-600" : ""}`} 
                  disabled={loading || isSent}
                >
                  <AnimatePresence mode="wait">
                    {isSent ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{t("common.sent")}</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t("common.loading")}</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                <span>{t("contact.send")}</span>
                            </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="h-full border-0 shadow-lg bg-primary/5">
            <CardHeader>
              <CardTitle>{t("contact.info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/50 hover:bg-white transition-colors">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Email</p>
                  <a href="mailto:contact@hrmarket.ro" className="text-muted-foreground hover:text-primary transition-colors">contact@hrmarket.ro</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/50 hover:bg-white transition-colors">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">{t("contact.phone")}</p>
                  <a href="tel:+40123456789" className="text-muted-foreground hover:text-primary transition-colors">+40 123 456 789</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/50 hover:bg-white transition-colors">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">{t("contact.address")}</p>
                  <p className="text-muted-foreground">Bucharest, Romania</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
