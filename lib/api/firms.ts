import { api, withAuth } from "./client"
import type { CompanyFormData, CompanyType, Country, County } from "@/lib/types/company"

// Request types
export interface CreateFirmRequest extends CompanyFormData {}

export interface UpdateFirmRequest extends Partial<CompanyFormData> {}

export interface UpdateFirmCategoriesRequest {
  categoryIds: number[]
}

// Response types
export interface Firm {
  id: string
  cui: string
  name: string
  typeId: number
  description: string
  contactEmail: string
  contactPhone?: string
  linksWebsite?: string
  linksLinkedIn?: string
  linksFacebook?: string
  linksTwitter?: string
  linksInstagram?: string
  locationAddress?: string
  locationCountryId: number
  locationCountyId: number
  locationCity: string
  locationPostalCode?: string
  logoUrl?: string
  coverUrl?: string
  categories?: number[]
  subscriptionTier?: string
  createdAt: string
  updatedAt: string
}

export interface FirmListResponse {
  firms: Firm[]
  total: number
  page: number
  pageSize: number
}

export interface FirmDetailsDto {
  id: string
  cui: string
  name: string
  description?: string
  contactEmail: string
  contactPhone?: string
  linksWebsite?: string
  linksLinkedIn?: string
  linksFacebook?: string
  linksTwitter?: string
  linksInstagram?: string
  locationAddress?: string
  locationCountryId: number
  locationCountyId: number
  locationCity: string
  locationPostalCode?: string
  logoUrl?: string
  coverImageUrl?: string
  universalAnswers: FirmUniversalAnswer[]
}

export interface FirmUniversalAnswer {
  icon: string
  questionDisplayTranslations: Translation[]
  answerTranslations: Translation[]
}

export interface Translation {
  languageCode: string
  name: string
  description?: string
}

// Firms API methods
export const firmsApi = {
  // GET /firms
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }): Promise<FirmListResponse> => {
    const response = await api.get<FirmListResponse>("/firms", { params })
    return response.data
  },

  // GET /firms/:id
  getById: async (id: string): Promise<Firm> => {
    const response = await api.get<Firm>(`/firms/${id}`)
    return response.data
  },

  // GET /firms/my
  getMyFirms: async (token: string): Promise<Firm[]> => {
    const response = await api.get<Firm[]>("/firms/my", withAuth(token))
    return response.data
  },

  // POST /firms
  create: async (data: CreateFirmRequest, token: string): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>("/firms", data, withAuth(token))
    return response.data
  },

  // PUT /firms/:id
  update: async (id: string, data: UpdateFirmRequest, token: string): Promise<Firm> => {
    const response = await api.put<Firm>(`/firms/${id}`, data, withAuth(token))
    return response.data
  },

  // DELETE /firms/:id
  delete: async (id: string, token: string): Promise<void> => {
    await api.delete(`/firms/${id}`, withAuth(token))
  },

  // PUT /firms/:id/categories
  updateCategories: async (id: string, data: UpdateFirmCategoriesRequest, token: string): Promise<void> => {
    await api.put(`/firms/${id}/categories`, data, withAuth(token))
  },

  // GET /firms/search?query=...
  search: async (query: string): Promise<Firm[]> => {
    const response = await api.get<Firm[]>("/firms/search", {
      params: { query },
    })
    return response.data
  },

  // GET /firm/my-firm
  getMyFirm: async (): Promise<FirmDetailsDto> => {
    const response = await api.get<FirmDetailsDto>("/firms/my-firm")
    return response.data
  },
}

// Helper endpoints for dropdowns
export const firmHelpers = {
  // GET /company-types
  getCompanyTypes: async (): Promise<CompanyType[]> => {
    const response = await api.get<CompanyType[]>("/company-types")
    return response.data
  },

  // GET /countries
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get<Country[]>("/countries")
    return response.data
  },

  // GET /counties?countryId=...
  getCounties: async (countryId: number): Promise<County[]> => {
    const response = await api.get<County[]>("/counties", {
      params: { countryId },
    })
    return response.data
  },
}
