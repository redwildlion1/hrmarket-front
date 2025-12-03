"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"
import type { CompanyFormData, Country } from "@/lib/types/company"
import { apiClient } from "@/lib/api/client"

interface Step4LocationProps {
  data: Partial<CompanyFormData>
  onChange: (data: Partial<CompanyFormData>) => void
  countries: Country[]
}

export function Step4Location({ data, onChange, countries }: Step4LocationProps) {
  const { t } = useLanguage()
  const [counties, setCounties] = useState<Array<{ id: string; name: string }>>([])
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
  const [loadingCounties, setLoadingCounties] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    if (data.locationCountryId) {
      setLoadingCounties(true)
      apiClient.location
        .getCounties(data.locationCountryId)
        .then((data) => {
          setCounties(data)
          setCities([])
        })
        .catch(console.error)
        .finally(() => setLoadingCounties(false))
    } else {
      setCounties([])
      setCities([])
    }
  }, [data.locationCountryId])

  useEffect(() => {
    if (data.locationCountyId) {
      setLoadingCities(true)
      apiClient.location
        .getCities(data.locationCountyId)
        .then(setCities)
        .catch(console.error)
        .finally(() => setLoadingCities(false))
    } else {
      setCities([])
    }
  }, [data.locationCountyId])

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
          value={data.locationCountryId}
          onValueChange={(value) =>
            onChange({ ...data, locationCountryId: value, locationCountyId: "", locationCityId: "" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("company.register.selectCountry")} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="county">{t("company.register.county")} *</Label>
        <Select
          value={data.locationCountyId}
          onValueChange={(value) => onChange({ ...data, locationCountyId: value, locationCityId: "" })}
          disabled={!data.locationCountryId || loadingCounties}
        >
          <SelectTrigger>
            <SelectValue placeholder={data.locationCountryId ? t("firm.selectCounty") : t("firm.selectCountyFirst")} />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county.id} value={county.id}>
                {county.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">{t("company.register.city")} *</Label>
        <Select
          value={data.locationCityId}
          onValueChange={(value) => onChange({ ...data, locationCityId: value })}
          disabled={!data.locationCountyId || loadingCities}
        >
          <SelectTrigger>
            <SelectValue placeholder={data.locationCountyId ? t("firm.selectCity") : t("firm.selectCityFirst")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
