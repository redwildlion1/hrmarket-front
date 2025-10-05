"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"
import type { CompanyFormData, CompanyType } from "@/lib/types/company"

interface Step1GeneralProps {
  data: Partial<CompanyFormData>
  onChange: (data: Partial<CompanyFormData>) => void
  companyTypes: CompanyType[]
}

export function Step1General({ data, onChange, companyTypes }: Step1GeneralProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cui">{t("company.register.cui")} *</Label>
        <Input id="cui" value={data.cui || ""} onChange={(e) => onChange({ ...data, cui: e.target.value })} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("company.register.name")} *</Label>
        <Input
          id="name"
          value={data.name || ""}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">{t("company.register.type")} *</Label>
        <Select
          value={data.typeId?.toString()}
          onValueChange={(value) => onChange({ ...data, typeId: Number.parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("company.register.selectType")} />
          </SelectTrigger>
          <SelectContent>
            {companyTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("company.register.description")} *</Label>
        <Textarea
          id="description"
          rows={4}
          value={data.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          required
        />
      </div>
    </div>
  )
}
