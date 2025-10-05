import { api, withAuth } from "./client"

// Response types
export interface Country {
  id: number
  name: string
  nameRo: string
  nameEn: string
  code: string
}

export interface County {
  id: number
  name: string
  nameRo: string
  nameEn: string
  countryId: number
}

export interface City {
  id: number
  name: string
  countyId: number
}

// Location Elements API methods
export const locationElementsApi = {
  // GET /countries
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get<Country[]>("/countries")
    return response.data
  },

  // GET /countries/:id
  getCountryById: async (id: number): Promise<Country> => {
    const response = await api.get<Country>(`/countries/${id}`)
    return response.data
  },

  // GET /counties?countryId=...
  getCounties: async (countryId?: number): Promise<County[]> => {
    const response = await api.get<County[]>("/counties", {
      params: countryId ? { countryId } : undefined,
    })
    return response.data
  },

  // GET /counties/:id
  getCountyById: async (id: number): Promise<County> => {
    const response = await api.get<County>(`/counties/${id}`)
    return response.data
  },

  // GET /cities?countyId=...
  getCities: async (countyId?: number): Promise<City[]> => {
    const response = await api.get<City[]>("/cities", {
      params: countyId ? { countyId } : undefined,
    })
    return response.data
  },

  // GET /cities/:id
  getCityById: async (id: number): Promise<City> => {
    const response = await api.get<City>(`/cities/${id}`)
    return response.data
  },

  // POST /countries (admin only)
  createCountry: async (data: Omit<Country, "id">, token: string): Promise<Country> => {
    const response = await api.post<Country>("/countries", data, withAuth(token))
    return response.data
  },

  // POST /counties (admin only)
  createCounty: async (data: Omit<County, "id">, token: string): Promise<County> => {
    const response = await api.post<County>("/counties", data, withAuth(token))
    return response.data
  },

  // POST /cities (admin only)
  createCity: async (data: Omit<City, "id">, token: string): Promise<City> => {
    const response = await api.post<City>("/cities", data, withAuth(token))
    return response.data
  },
}
