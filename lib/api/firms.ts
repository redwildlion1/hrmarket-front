import { api, withAuth, withoutAuth } from "./client"
import type { CompanyFormData, CompanyType, Country, County } from "@/lib/types/company"

// Request types
export interface CreateFirmRequest extends CompanyFormData {}

export interface UpdateFirmRequest extends Partial<CompanyFormData> {}

export interface UpdateFirmCategoriesRequest {
  categoryIds: number[]
}

export interface UpdateUniversalAnswersRequest {
    answers: UniversalQuestionAnswerItem[]
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
  bannerUrl?: string
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
  bannerUrl?: string
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

// Updated FirmDetailsForEditingDto interface
export interface FirmDetailsForEditingDto {
  id: string
  cui: string
  name: string
  description?: string
  status: string
  contact: {
    email: string
    phone?: string
  }
  links: {
    website?: string
    linkedin?: string
    facebook?: string
    twitter?: string
    instagram?: string
  }
  location: {
    address?: string
    countryId: string
    countyId: string
    cityId: string
    postalCode?: string
  }
  media: Array<{
    url: string
    type: string
  }>
  forms: Array<{
    categoryId: string
    questionsWithAnswers: Array<{
      categoryQuestion: {
        id: string
        type: string
        translations: Array<{ languageCode: string; text: string }>
      }
      categoryAnswer?: {
        id: string
        value?: string
        translations: Array<{ languageCode: string; text: string }>
      }
    }>
  }>
  universalAnswers: Array<{
    id: string
    order: number
    universalQuestion?: {
      id: string
      icon: string
      translations: Array<{ languageCode: string; name: string }>
      options: Array<{ id: string; translations: Array<{ languageCode: string; name: string }> }>
    }
    selectedOptionId: string
  }>
  availableResources: {
    addonsAvailableJobPosts: number
    addonsAvailableCategories: number
    addonsAvailableEvents: number
    subscriptionAvailableJobPosts: number
    subscriptionAvailableCategories: number
    subscriptionAvailableEvents: number
    totalAvailableJobPosts: number
    totalAvailableCategories: number
    totalAvailableEvents: number
  }
  subscriptionStatus?: {
    subscriptionId: string
    status: string
    currentPeriodEnd: string
    isYearly: boolean
    currency: string
    currentPrice: number
    planTranslations: Array<{ languageCode: string; name: string; description?: string }>
  }
}

// DTOs for Firm Details Page
export interface FirmDetailsForDisplayDto {
    id: string
    cui: string
    name: string
    logoUrl?: string
    bannerUrl?: string
    status: number // FirmStatus enum
    description: string
    forms: GetCategoryFormForDisplayDto[]
    universalAnswers: UniversalQuestionAnswerItem[]
    contact: FirmContactDto
    links: FirmLinksDto
    location: FirmLocationDto
    categoryIds: string[]
}

export interface FirmLocationDto {
    address?: string
    countryId: string
    countyId: string
    cityId: string
    postalCode?: string
}

export interface GetCategoryFormForDisplayDto {
    categoryId: string
    questionsWithAnswers: CategoryQuestionsWithAnswers[]
}

export interface CategoryQuestionsWithAnswers {
    categoryQuestion: CategoryQuestionWithTranslations
    categoryAnswer?: CategoryAnswerWithTranslations
}

export interface CategoryQuestionWithTranslations {
    id: string
    type: number // QuestionType enum
    updatedAt: string
    isRequired: boolean
    translations: CategoryQuestionTranslation[]
    options: CategoryQuestionOption[]
}

export interface CategoryQuestionTranslation {
    languageCode: string
    title: string
    description: string
    placeholder?: string
}

export interface CategoryQuestionOption {
    id: string
    translations: CategoryQuestionOptionTranslation[]
}

export interface CategoryQuestionOptionTranslation {
    languageCode: string
    label: string
    description: string
}

export interface CategoryAnswerWithTranslations {
    id: string
    translations: CategoryAnswerTranslationDto[]
    value?: string
    selectedOptionIds: string[]
    updatedAt: string
}

export interface CategoryAnswerTranslationDto {
    languageCode: string
    text: string
}

export interface UniversalQuestionAnswerItem {
    universalQuestionId: string
    selectedOptionId: string
}

export interface FirmContactDto {
    phone?: string
    email?: string
}

export interface FirmLinksDto {
    website?: string
    linkedIn?: string
    facebook?: string
    twitter?: string
    instagram?: string
}

// Firms API methods
export const firmsApi = {
  // GET /firms
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }): Promise<FirmListResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
        if (params.search) queryParams.append("search", params.search);
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return withoutAuth<FirmListResponse>(`/firms${queryString}`)
  },

  // GET /firms/:id
  getById: async (id: string): Promise<FirmDetailsForDisplayDto> => {
    return withoutAuth<FirmDetailsForDisplayDto>(`/firms/${id}`)
  },

  // GET /firms/my
  getMyFirms: async (): Promise<Firm[]> => {
    return withAuth<Firm[]>("/firms/my")
  },

  // POST /firms
  create: async (data: CreateFirmRequest): Promise<{ id: string }> => {
    return withAuth<{ id: string }>("/firms", {
        method: "POST",
        body: JSON.stringify(data)
    })
  },

  // PUT /firms/:id
  update: async (id: string, data: UpdateFirmRequest): Promise<Firm> => {
    return withAuth<Firm>(`/firms/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    })
  },

  // DELETE /firms/:id
  delete: async (id: string): Promise<void> => {
    return withAuth<void>(`/firms/${id}`, {
        method: "DELETE"
    })
  },

  // PUT /firms/:id/categories
  updateCategories: async (id: string, data: UpdateFirmCategoriesRequest): Promise<void> => {
    return withAuth<void>(`/firms/${id}/categories`, {
        method: "PUT",
        body: JSON.stringify(data)
    })
  },

  // GET /firms/search?query=...
  search: async (params: {
    categoryId?: string
    name?: string
    optionIds?: string[]
    pageNumber?: number
    pageSize?: number
  }) => {
    return api.firms.search(params)
  },

  // GET /firm/my-firm
  getMyFirm: async (): Promise<FirmDetailsForEditingDto> => {
    return api.firm.getMyFirm()
  },

  // PUT /api/universal-questions/update-answers
  updateUniversalAnswers: async (data: UpdateUniversalAnswersRequest): Promise<void> => {
    return withAuth<void>("/universal-questions/update-answers", {
        method: "PUT",
        body: JSON.stringify(data)
    })
  },

  // POST /api/firms/submit-for-review
  submitForReview: async (): Promise<void> => {
    return withAuth<void>("/firms/submit-for-review", {
        method: "POST"
    })
  },
}

// Helper endpoints for dropdowns
export const firmHelpers = {
  // GET /company-types
  getCompanyTypes: async (): Promise<CompanyType[]> => {
    return withoutAuth<CompanyType[]>("/company-types")
  },

  // GET /countries
  getCountries: async (): Promise<Country[]> => {
    return withoutAuth<Country[]>("/countries")
  },

  // GET /counties?countryId=...
  getCounties: async (countryId: number): Promise<County[]> => {
    return withoutAuth<County[]>(`/counties?countryId=${countryId}`)
  },
}
