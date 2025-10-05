import { api, withAuth } from "./client"

// Request types
export interface UpdateCategoriesRequest {
  categoryIds: number[]
}

// Response types
export interface Category {
  id: number
  name: string
  nameRo: string
  nameEn: string
  description?: string
  descriptionRo?: string
  descriptionEn?: string
  icon?: string
}

export interface CategoryListResponse {
  categories: Category[]
  total: number
}

// Categories API methods
export const categoriesApi = {
  // GET /categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories")
    return response.data
  },

  // GET /categories/:id
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },

  // GET /categories/search?query=...
  search: async (query: string): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories/search", {
      params: { query },
    })
    return response.data
  },

  // POST /categories (admin only)
  create: async (data: Omit<Category, "id">, token: string): Promise<Category> => {
    const response = await api.post<Category>("/categories", data, withAuth(token))
    return response.data
  },

  // PUT /categories/:id (admin only)
  update: async (id: number, data: Partial<Category>, token: string): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data, withAuth(token))
    return response.data
  },

  // DELETE /categories/:id (admin only)
  delete: async (id: number, token: string): Promise<void> => {
    await api.delete(`/categories/${id}`, withAuth(token))
  },
}
