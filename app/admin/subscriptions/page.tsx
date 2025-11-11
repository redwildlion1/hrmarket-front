"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAdminCheck } from "@/hooks/use-admin-check"
import { adminApi } from "@/lib/api/admin"
import type { SubscriptionPlan } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ArrowLeft, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getTranslation = (
  translations: Array<{ languageCode: string; [key: string]: any }>,
  field: string,
  language: string,
) => {
  const translation = translations.find((t) => t.languageCode === language)
  return translation?.[field] || translations[0]?.[field] || ""
}

export default function SubscriptionsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

  const [formData, setFormData] = useState({
    nameRo: "",
    nameEn: "",
    descriptionRo: "",
    descriptionEn: "",
    featuresRo: [""],
    featuresEn: [""],
    priceMonthlyEur: "",
    priceYearlyEur: "",
    priceMonthlyRon: "",
    priceYearlyRon: "",
    maxCategories: "",
    maxArticles: "",
    maxOpenJobs: "",
    displayOrder: "",
    isPopular: false,
    isActive: true,
  })

  useAdminCheck(30000)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await adminApi.getSubscriptionPlans()
      setPlans(data)
    } catch (error) {
      console.error(error)
      toast({
        title: t("admin.error"),
        description: "Failed to load subscription plans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    const roTranslation = plan.translations.find((t) => t.languageCode === "ro")
    const enTranslation = plan.translations.find((t) => t.languageCode === "en")
    const eurPrice = plan.prices.find((p) => p.currency.toUpperCase() === "EUR")
    const ronPrice = plan.prices.find((p) => p.currency.toUpperCase() === "RON")

    setFormData({
      nameRo: roTranslation?.name || "",
      nameEn: enTranslation?.name || "",
      descriptionRo: roTranslation?.description || "",
      descriptionEn: enTranslation?.description || "",
      featuresRo: plan.features.map((f) => getTranslation(f.translations, "text", "ro")).filter(Boolean),
      featuresEn: plan.features.map((f) => getTranslation(f.translations, "text", "en")).filter(Boolean),
      priceMonthlyEur: eurPrice?.monthlyPrice.toString() || "",
      priceYearlyEur: eurPrice?.yearlyPrice.toString() || "",
      priceMonthlyRon: ronPrice?.monthlyPrice.toString() || "",
      priceYearlyRon: ronPrice?.yearlyPrice.toString() || "",
      maxCategories: plan.maxCategories.toString(),
      maxArticles: plan.maxArticles.toString(),
      maxOpenJobs: plan.maxOpenJobs.toString(),
      displayOrder: plan.displayOrder.toString(),
      isPopular: plan.isPopular,
      isActive: plan.isActive,
    })
    setEditingPlan(plan)
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const data = {
        translations: [
          {
            languageCode: "ro",
            name: formData.nameRo,
            description: formData.descriptionRo || undefined,
          },
          {
            languageCode: "en",
            name: formData.nameEn,
            description: formData.descriptionEn || undefined,
          },
        ],
        features: formData.featuresRo
          .map((_, index) => ({
            order: index + 1,
            translations: [
              {
                languageCode: "ro",
                text: formData.featuresRo[index],
              },
              {
                languageCode: "en",
                text: formData.featuresEn[index] || formData.featuresRo[index],
              },
            ],
          }))
          .filter((f) => f.translations[0].text.trim() !== ""),
        prices: [
          {
            currency: "EUR" as const,
            monthlyPrice: Number.parseFloat(formData.priceMonthlyEur),
            yearlyPrice: Number.parseFloat(formData.priceYearlyEur),
          },
          {
            currency: "RON" as const,
            monthlyPrice: Number.parseFloat(formData.priceMonthlyRon),
            yearlyPrice: Number.parseFloat(formData.priceYearlyRon),
          },
        ],
        isPopular: formData.isPopular,
        maxCategories: Number.parseInt(formData.maxCategories),
        maxArticles: Number.parseInt(formData.maxArticles),
        maxOpenJobs: Number.parseInt(formData.maxOpenJobs),
        displayOrder: Number.parseInt(formData.displayOrder),
      }

      if (editingPlan) {
        const updateData = {
          id: editingPlan.id,
          translations: data.translations,
          features: data.features,
          isPopular: data.isPopular,
          maxListings: Number.parseInt(formData.maxCategories), // Backend uses maxListings in update
          maxCategories: data.maxCategories,
          maxArticles: data.maxArticles,
          maxOpenJobs: data.maxOpenJobs,
          displayOrder: data.displayOrder,
          isActive: formData.isActive,
        }
        await adminApi.updateSubscriptionPlan(editingPlan.id, updateData)
        toast({ title: "Subscription plan updated successfully!" })
      } else {
        await adminApi.createSubscriptionPlan(data)
        toast({ title: "Subscription plan created successfully!" })
      }

      setIsDialogOpen(false)
      setEditingPlan(null)
      setFormData({
        nameRo: "",
        nameEn: "",
        descriptionRo: "",
        descriptionEn: "",
        featuresRo: [""],
        featuresEn: [""],
        priceMonthlyEur: "",
        priceYearlyEur: "",
        priceMonthlyRon: "",
        priceYearlyRon: "",
        maxCategories: "",
        maxArticles: "",
        maxOpenJobs: "",
        displayOrder: "",
        isPopular: false,
        isActive: true,
      })
      loadPlans()
    } catch (error: any) {
      toast({
        title: t("admin.error"),
        description: error.message || "Failed to save subscription plan",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      await adminApi.deleteSubscriptionPlan(planId)
      toast({ title: "Subscription plan deleted successfully!" })
      loadPlans()
    } catch (error: any) {
      toast({
        title: t("admin.error"),
        description: error.message || "Failed to delete subscription plan",
        variant: "destructive",
      })
    }
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      featuresRo: [...formData.featuresRo, ""],
      featuresEn: [...formData.featuresEn, ""],
    })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      featuresRo: formData.featuresRo.filter((_, i) => i !== index),
      featuresEn: formData.featuresEn.filter((_, i) => i !== index),
    })
  }

  const updateFeature = (index: number, value: string, lang: "ro" | "en") => {
    const features = lang === "ro" ? [...formData.featuresRo] : [...formData.featuresEn]
    features[index] = value
    setFormData({
      ...formData,
      [lang === "ro" ? "featuresRo" : "featuresEn"]: features,
    })
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold md:text-4xl">Subscription Plans</h1>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingPlan(null)
              setFormData({
                nameRo: "",
                nameEn: "",
                descriptionRo: "",
                descriptionEn: "",
                featuresRo: [""],
                featuresEn: [""],
                priceMonthlyEur: "",
                priceYearlyEur: "",
                priceMonthlyRon: "",
                priceYearlyRon: "",
                maxCategories: "",
                maxArticles: "",
                maxOpenJobs: "",
                displayOrder: "",
                isPopular: false,
                isActive: true,
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit" : "Add"} Subscription Plan</DialogTitle>
              <DialogDescription>
                {editingPlan ? "Update" : "Create"} a subscription plan with bilingual support and multiple currencies
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="ro" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ro">Română</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="ro" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nameRo">Plan Name (RO) *</Label>
                  <Input
                    id="nameRo"
                    value={formData.nameRo}
                    onChange={(e) => setFormData({ ...formData, nameRo: e.target.value })}
                    placeholder="e.g., Profesional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionRo">Description (RO)</Label>
                  <Textarea
                    id="descriptionRo"
                    value={formData.descriptionRo}
                    onChange={(e) => setFormData({ ...formData, descriptionRo: e.target.value })}
                    placeholder="Descrierea planului"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Features (RO) *</Label>
                  {formData.featuresRo.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, "ro")}
                        placeholder={`Caracteristică ${index + 1}`}
                      />
                      {formData.featuresRo.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Plan Name (EN) *</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g., Professional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Description (EN)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Plan description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Features (EN) *</Label>
                  {formData.featuresEn.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, "en")}
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.featuresEn.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceMonthlyEur">Monthly Price (EUR) *</Label>
                  <Input
                    id="priceMonthlyEur"
                    type="number"
                    step="0.01"
                    value={formData.priceMonthlyEur}
                    onChange={(e) => setFormData({ ...formData, priceMonthlyEur: e.target.value })}
                    placeholder="99.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceYearlyEur">Yearly Price (EUR) *</Label>
                  <Input
                    id="priceYearlyEur"
                    type="number"
                    step="0.01"
                    value={formData.priceYearlyEur}
                    onChange={(e) => setFormData({ ...formData, priceYearlyEur: e.target.value })}
                    placeholder="999.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMonthlyRon">Monthly Price (RON) *</Label>
                  <Input
                    id="priceMonthlyRon"
                    type="number"
                    step="0.01"
                    value={formData.priceMonthlyRon}
                    onChange={(e) => setFormData({ ...formData, priceMonthlyRon: e.target.value })}
                    placeholder="450.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceYearlyRon">Yearly Price (RON) *</Label>
                  <Input
                    id="priceYearlyRon"
                    type="number"
                    step="0.01"
                    value={formData.priceYearlyRon}
                    onChange={(e) => setFormData({ ...formData, priceYearlyRon: e.target.value })}
                    placeholder="4500.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxCategories">Max Categories *</Label>
                  <Input
                    id="maxCategories"
                    type="number"
                    value={formData.maxCategories}
                    onChange={(e) => setFormData({ ...formData, maxCategories: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxArticles">Max Articles *</Label>
                  <Input
                    id="maxArticles"
                    type="number"
                    value={formData.maxArticles}
                    onChange={(e) => setFormData({ ...formData, maxArticles: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOpenJobs">Max Open Jobs *</Label>
                  <Input
                    id="maxOpenJobs"
                    type="number"
                    value={formData.maxOpenJobs}
                    onChange={(e) => setFormData({ ...formData, maxOpenJobs: e.target.value })}
                    placeholder="20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order *</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                />
                <Label htmlFor="isPopular" className="cursor-pointer">
                  Mark as popular plan
                </Label>
              </div>
              {editingPlan && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{editingPlan ? "Update" : "Create"} Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const name = getTranslation(plan.translations, "name", language)
          const description = getTranslation(plan.translations, "description", language)
          const eurPrice = plan.prices.find((p) => p.currency.toUpperCase() === "EUR")
          const ronPrice = plan.prices.find((p) => p.currency.toUpperCase() === "RON")

          return (
            <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{name}</CardTitle>
                      {plan.isPopular && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          Popular
                        </span>
                      )}
                      {!plan.isActive && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-2 text-sm">{description}</CardDescription>
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">EUR</p>
                        <p className="text-sm">
                          <span className="font-semibold">Monthly:</span> €{eurPrice?.monthlyPrice}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Yearly:</span> €{eurPrice?.yearlyPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">RON</p>
                        <p className="text-sm">
                          <span className="font-semibold">Monthly:</span> {ronPrice?.monthlyPrice} RON
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Yearly:</span> {ronPrice?.yearlyPrice} RON
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Limits:</p>
                      <ul className="mt-1 text-sm text-muted-foreground">
                        <li>{plan.maxCategories} categories</li>
                        <li>{plan.maxArticles} articles</li>
                        <li>{plan.maxOpenJobs} open jobs</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Features:</p>
                      <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                        {plan.features
                          .sort((a, b) => a.order - b.order)
                          .map((feature, idx) => (
                            <li key={idx}>{getTranslation(feature.translations, "text", language)}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
