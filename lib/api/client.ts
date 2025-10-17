const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api"

interface ProblemDetails {
  title: string
  detail?: string
  status: number
  instance?: string
  timestamp: string
  traceId?: string
  validationErrors?: Record<string, string[]>
  errors?: string[]
}

class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail?: string,
    public validationErrors?: Record<string, string[]>,
    public errors: string[] = [],
    public traceId?: string,
  ) {
    super(title)
    this.name = "ApiError"
  }
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Merge existing headers if any
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: ProblemDetails
    try {
      errorData = await response.json()
    } catch {
      throw new ApiError(response.status, response.statusText, "An unexpected error occurred")
    }

    throw new ApiError(
      errorData.status || response.status,
      errorData.title || "An error occurred",
      errorData.detail,
      errorData.validationErrors,
      errorData.errors || [],
      errorData.traceId,
    )
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export const apiClient = {
  // Auth endpoints
  auth: {
    register: async (data: { email: string; password: string; newsletter: boolean }) => {
      return fetchWithAuth("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    login: async (data: { email: string; password: string }) => {
      const result = await fetchWithAuth<{
        token: string
        refreshToken: string
        tokenExpires: string
        refreshTokenExpires: string
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      })

      localStorage.setItem("accessToken", result.token)
      localStorage.setItem("refreshToken", result.refreshToken)
      return result
    },

    refreshToken: async () => {
      const token = localStorage.getItem("accessToken")
      const refreshToken = localStorage.getItem("refreshToken")

      const result = await fetchWithAuth<{
        token: string
        refreshToken: string
        tokenExpires: string
        refreshTokenExpires: string
      }>("/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify({ token, refreshToken }),
      })

      localStorage.setItem("accessToken", result.token)
      localStorage.setItem("refreshToken", result.refreshToken)
      return result
    },

    confirmEmail: async (userId: string, token: string) => {
      return fetchWithAuth(`/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`, {
        method: "GET",
      })
    },
  },

  // Company/Firm endpoints
  firms: {
    create: async (data: any) => {
      return fetchWithAuth<{ id: string }>("/firm/create", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    uploadMedia: async (firmId: string, file: File, type: "logo" | "cover") => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_BASE_URL}/media/firms/${firmId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new ApiError(
          response.status,
          error.title,
          error.detail,
          error.validationErrors,
          error.errors,
          error.traceId,
        )
      }

      return response.json()
    },
  },

  // Categories endpoints
  categories: {
    getAll: async () => {
      return fetchWithAuth<any[]>("/categories/clusters")
    },

    getClusters: async () => {
      return fetchWithAuth<any[]>("/categories/clusters")
    },

    getCategories: async () => {
      return fetchWithAuth<any[]>("/categories/categories")
    },

    getServices: async () => {
      return fetchWithAuth<any[]>("/categories/services")
    },

    createCluster: async (data: { name: string; icon: string }) => {
      return fetchWithAuth("/categories/clusters", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    createCategory: async (data: { name: string; icon: string; orderCluster?: number; clusterId?: string }) => {
      return fetchWithAuth("/categories/categories", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    createService: async (data: { name: string; orderInCategory: number; categoryId: string }) => {
      return fetchWithAuth("/categories/services", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    deleteCluster: async (id: string) => {
      return fetchWithAuth(`/categories/clusters/${id}`, {
        method: "DELETE",
      })
    },

    deleteCategory: async (id: string) => {
      return fetchWithAuth(`/categories/categories/${id}`, {
        method: "DELETE",
      })
    },

    deleteService: async (id: string) => {
      return fetchWithAuth(`/categories/services/${id}`, {
        method: "DELETE",
      })
    },
  },

  // Location endpoints
  location: {
    getCountries: async () => {
      return fetchWithAuth<Array<{ id: number; name: string }>>("/location-elements/countries")
    },

    getCounties: async (countryId: number) => {
      return fetchWithAuth<Array<{ id: number; name: string }>>(`/location-elements/${countryId}/counties`)
    },
  },

  // Subscription endpoints
  subscriptions: {
    getPlans: async () => {
      return fetchWithAuth<
        Array<{
          id: string
          name: string
          description: string
          priceMonthly: number
          priceYearly: number
          stripePriceIdMonthly: string
          stripePriceIdYearly: string
          isPopular: boolean
          features: string[]
        }>
      >("/subscriptions/plans")
    },

    createPlan: async (data: {
      name: string
      description: string
      priceMonthly: number
      priceYearly: number
      features: string[]
      isPopular?: boolean
    }) => {
      return fetchWithAuth("/subscriptions/plans", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    createCheckoutSession: async (data: {
      firmId: string
      priceId: string
      isYearly: boolean
    }) => {
      return fetchWithAuth<{
        sessionId: string
        publishableKey: string
      }>("/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    getSubscriptionStatus: async (firmId: string) => {
      return fetchWithAuth<{
        subscriptionId: string
        status: string
        currentPeriodEnd: string
        isYearly: boolean
        plan: any
      }>(`/subscriptions/firms/${firmId}/status`)
    },
  },
}

export const api = apiClient

export const withAuth = fetchWithAuth

export { ApiError }
