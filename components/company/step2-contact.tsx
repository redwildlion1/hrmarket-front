"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/language-context"
import type { CompanyFormData } from "@/lib/types/company"

interface Step2ContactProps {
  data: Partial<CompanyFormData>
  onChange: (data: Partial<CompanyFormData>) => void
}

export function Step2Contact({ data, onChange }: Step2ContactProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contactEmail">{t("company.register.contactEmail")} *</Label>
        <Input
          id="contactEmail"
          type="email"
          value={data.contactEmail || ""}
          onChange={(e) => onChange({ ...data, contactEmail: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">{t("company.register.contactPhone")}</Label>
        <Input
          id="contactPhone"
          type="tel"
          value={data.contactPhone || ""}
          onChange={(e) => onChange({ ...data, contactPhone: e.target.value })}
        />
      </div>
    </div>
  )
}
