import { apiClient } from "@/lib/api/client"

export const locationCache = {
  getCountryName: (countryId: string): string | null => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("country_")) {
          const countryData = JSON.parse(localStorage.getItem(key) || "{}")
          if (countryData.id === countryId) {
            return countryData.name
          }
        }
      }
    } catch (e) {
      console.error("Error reading from location cache", e)
    }
    return null
  },

  getCountyName: (countyId: string): string | null => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("country_")) {
          const countryData = JSON.parse(localStorage.getItem(key) || "{}")
          const county = countryData.counties?.find((c: any) => c.id === countyId)
          if (county) {
            return county.name
          }
        }
      }
    } catch (e) {
      console.error("Error reading from location cache", e)
    }
    return null
  },

  getCityName: (cityId: string): string | null => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("country_")) {
          const countryData = JSON.parse(localStorage.getItem(key) || "{}")
          for (const county of countryData.counties || []) {
            const city = county.cities?.find((c: any) => c.id === cityId)
            if (city) {
              return city.name
            }
          }
        }
      }
    } catch (e) {
      console.error("Error reading from location cache", e)
    }
    return null
  },

  getLocationNames: (countryId?: string, countyId?: string, cityId?: string) => {
    return {
      country: countryId ? locationCache.getCountryName(countryId) : "",
      county: countyId ? locationCache.getCountyName(countyId) : "",
      city: cityId ? locationCache.getCityName(cityId) : "",
    }
  }
}
