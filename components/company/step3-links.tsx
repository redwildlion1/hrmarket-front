"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/language-context"
import type { CompanyFormData } from "@/lib/types/company"

interface Step3LinksProps {
  data: Partial<CompanyFormData>
  onChange: (data: Partial<CompanyFormData>) => void
}

export function Step3Links({ data, onChange }: Step3LinksProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website">{t("company.register.website")}</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          value={data.linksWebsite || ""}
          onChange={(e) => onChange({ ...data, linksWebsite: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">{t("company.register.linkedin")}</Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/company/..."
          value={data.linksLinkedIn || ""}
          onChange={(e) => onChange({ ...data, linksLinkedIn: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebook">{t("company.register.facebook")}</Label>
        <Input
          id="facebook"
          type="url"
          placeholder="https://facebook.com/..."
          value={data.linksFacebook || ""}
          onChange={(e) => onChange({ ...data, linksFacebook: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">{t("company.register.twitter")}</Label>
        <Input
          id="twitter"
          type="url"
          placeholder="https://twitter.com/..."
          value={data.linksTwitter || ""}
          onChange={(e) => onChange({ ...data, linksTwitter: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">{t("company.register.instagram")}</Label>
        <Input
          id="instagram"
          type="url"
          placeholder="https://instagram.com/..."
          value={data.linksInstagram || ""}
          onChange={(e) => onChange({ ...data, linksInstagram: e.target.value })}
        />
      </div>
    </div>
  )
}
