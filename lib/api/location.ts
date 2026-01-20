import { apiClient } from "./client"
import type { Country, County, City } from "./company"

const fetchAndCache = async <T,>(key: string, fetcher: () => Promise<T[]>): Promise<T[]> => {
  try {
    const cached = localStorage.getItem(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn("Could not read from localStorage", error)
  }

  const data = await fetcher()
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn("Could not write to localStorage", error)
  }
  return data
}

export const getCachedCountries = (): Promise<Country[]> => {
  return fetchAndCache("countries", () => apiClient.location.getCountries())
}

export const getCachedCounties = (countryId: string): Promise<County[]> => {
  return fetchAndCache(`counties_${countryId}`, () => apiClient.location.getCounties(countryId))
}

export const getCachedCities = (countyId: string): Promise<City[]> => {
  return fetchAndCache(`cities_${countyId}`, () => apiClient.location.getCities(countyId))
}
