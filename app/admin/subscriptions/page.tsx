"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
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
import { Plus, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function SubscriptionsPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priceMonthly: "",
        priceYearly: "",
        features: [""],
        isPopular: false,
    })

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

    const handleCreate = async () => {
        try {
            await adminApi.createSubscriptionPlan({
                name: formData.name,
                description: formData.description,
                priceMonthly: parseFloat(formData.priceMonthly),
                priceYearly: parseFloat(formData.priceYearly),
                features: formData.features.filter((f) => f.trim() !== ""),
                isPopular: formData.isPopular,
            })
            toast({ title: "Subscription plan created successfully!" })
            setIsDialogOpen(false)
            setFormData({
                name: "",
                description: "",
                priceMonthly: "",
                priceYearly: "",
                features: [""],
                isPopular: false,
            })
            loadPlans()
        } catch (error: any) {
            toast({
                title: t("admin.error"),
                description: error.message || "Failed to create subscription plan",
                variant: "destructive",
            })
        }
    }

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ""] })
    }

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index)
        setFormData({ ...formData, features: newFeatures })
    }

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        setFormData({ ...formData, features: newFeatures })
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Subscription Plan</DialogTitle>
                            <DialogDescription>Create a new subscription plan with Stripe integration</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Plan Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Professional"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Plan description"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priceMonthly">Monthly Price (USD) *</Label>
                                    <Input
                                        id="priceMonthly"
                                        type="number"
                                        step="0.01"
                                        value={formData.priceMonthly}
                                        onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                                        placeholder="99.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priceYearly">Yearly Price (USD) *</Label>
                                    <Input
                                        id="priceYearly"
                                        type="number"
                                        step="0.01"
                                        value={formData.priceYearly}
                                        onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value })}
                                        placeholder="999.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Features *</Label>
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                        />
                                        {formData.features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeFeature(index)}
                                            >
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
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPopular"
                                    checked={formData.isPopular}
                                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPopular: checked as boolean })}
                                />
                                <Label htmlFor="isPopular" className="cursor-pointer">
                                    Mark as popular plan
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate}>Create Plan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        {plan.isPopular && (
                                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Popular
                      </span>
                                        )}
                                    </div>
                                    <CardDescription className="mt-2 text-sm">{plan.description}</CardDescription>
                                    <div className="mt-4 space-y-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">Monthly:</span> ${plan.priceMonthly}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Yearly:</span> ${plan.priceYearly}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold">Features:</p>
                                        <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}