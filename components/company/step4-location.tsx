"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"
import type { CompanyFormData, Country, County } from "@/lib/types/company"
import { getCounties } from "@/lib/api/company"

interface Step4LocationProps {
  data: Partial<CompanyFormData>
  onChange: (data: Partial<CompanyFormData>) => void
  countries: Country[]
}

export function Step4Location({ data, onChange, countries }: Step4LocationProps) {
  const { t } = useLanguage()
  const [counties, setCounties] = useState<County[]>([])
  const [loadingCounties, setLoadingCounties] = useState(false)

  useEffect(() => {
    if (data.locationCountryId) {
      setLoadingCounties(true)
      getCounties(data.locationCountryId)
        .then(setCounties)
        .catch(console.error)
        .finally(() => setLoadingCounties(false))
    } else {
      setCounties([])
    }
  }, [data.locationCountryId])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">{t("company.register.address")}</Label>
        <Input
          id="address"
          value={data.locationAddress || ""}
          onChange={(e) => onChange({ ...data, locationAddress: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">{t("company.register.country")} *</Label>
        <Select
          value={data.locationCountryId?.toString()}
          onValueChange={(value) =>
            onChange({ ...data, locationCountryId: Number.parseInt(value), locationCountyId: 0 })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("company.register.selectCountry")} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="county">{t("company.register.county")} *</Label>
        <Select
          value={data.locationCountyId?.toString()}
          onValueChange={(value) => onChange({ ...data, locationCountyId: Number.parseInt(value) })}
          disabled={!data.locationCountryId || loadingCounties}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("company.register.selectCounty")} />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county.id} value={county.id.toString()}>
                {county.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">{t("company.register.city")} *</Label>
        <Input
          id="city"
          value={data.locationCity || ""}
          onChange={(e) => onChange({ ...data, locationCity: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">{t("company.register.postalCode")}</Label>
        <Input
          id="postalCode"
          value={data.locationPostalCode || ""}
          onChange={(e) => onChange({ ...data, locationPostalCode: e.target.value })}
        />
      </div>
    </div>
  )
}
