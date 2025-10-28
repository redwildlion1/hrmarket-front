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
  const makeRequest = async (): Promise<Response> => {
    const token = localStorage.getItem("accessToken")
    const language = localStorage.getItem("language") || "ro"

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept-Language": language === "en" ? "en" : "ro",
    }

    if (options.headers) {
      const existingHeaders = new Headers(options.headers)
      existingHeaders.forEach((value, key) => {
        headers[key] = value
      })
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    })
  }

  let response = await makeRequest()

  if (response.status === 401) {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      const accessToken = localStorage.getItem("accessToken")

      if (refreshToken && accessToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken,
            refreshToken: refreshToken,
          }),
          credentials: "include",
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          // Store new tokens
          localStorage.setItem("accessToken", refreshData.token)
          localStorage.setItem("refreshToken", refreshData.refreshToken)

          // Update userInfo if present in response
          if (refreshData.userInfo) {
            localStorage.setItem("userInfo", JSON.stringify(refreshData.userInfo))
          }

          // Retry the original request with new token
          response = await makeRequest()
        } else {
          // Refresh failed, logout
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("userInfo")
          window.location.href = "/login"
          throw new ApiError(401, "Session expired", "Please login again")
        }
      } else {
        // No tokens, logout
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userInfo")
        window.location.href = "/login"
        throw new ApiError(401, "Session expired", "Please login again")
      }
    } catch (error) {
      // Refresh failed, logout
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userInfo")
      window.location.href = "/login"
      throw error instanceof ApiError ? error : new ApiError(401, "Session expired", "Please login again")
    }
  }

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

  const contentType = response.headers.get("content-type")
  const contentLength = response.headers.get("content-length")

  if (!contentType || contentLength === "0") {
    return null as T
  }

  if (contentType.includes("application/json")) {
    const text = await response.text()
    if (!text || text.trim() === "") {
      return null as T
    }
    return JSON.parse(text)
  }

  return null as T
}

async function fetchPublic<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const language = localStorage.getItem("language") || "ro"

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": language === "en" ? "en" : "ro",
  }

  // Merge existing headers if any
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
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

  const contentType = response.headers.get("content-type")
  const contentLength = response.headers.get("content-length")

  if (!contentType || contentLength === "0") {
    return null as T
  }

  if (contentType.includes("application/json")) {
    const text = await response.text()
    if (!text || text.trim() === "") {
      return null as T
    }
    return JSON.parse(text)
  }

  return null as T
}

export const apiClient = {
  // Auth endpoints
  auth: {
    register: async (data: { email: string; password: string; newsletter: boolean; isFirm?: boolean }) => {
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
        userInfo: {
          userId: string
          email: string
          isAdmin: boolean
          hasFirm: boolean
          firmId: string | null
          firmName: string | null
          roles: string[]
        }
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      })

      localStorage.setItem("accessToken", result.token)
      localStorage.setItem("refreshToken", result.refreshToken)
      localStorage.setItem("userInfo", JSON.stringify(result.userInfo))
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

    checkAdmin: async () => {
      return fetchWithAuth<{ isAdmin: boolean }>("/auth/check-admin", {
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

  // User profile endpoints
  user: {
    getProfile: async () => {
      return fetchWithAuth<{
        userId: string
        email: string
        firstName: string | null
        lastName: string | null
        phone: string | null
        hasFirm: boolean
        firmId: string | null
        firmName: string | null
      }>("/user/profile", {
        method: "GET",
      })
    },

    updateProfile: async (data: {
      firstName?: string
      lastName?: string
      phone?: string
    }) => {
      return fetchWithAuth("/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },
  },

  // Firm management endpoints
  firm: {
    getDetails: async (firmId: string) => {
      return fetchWithAuth<{
        firmId: string
        name: string
        email: string
        phone: string | null
        website: string | null
        description: string | null
        logo: string | null
        coverImage: string | null
        address: string | null
        city: string | null
        country: string | null
      }>(`/firm/${firmId}`, {
        method: "GET",
      })
    },

    updateDetails: async (
      firmId: string,
      data: {
        name?: string
        email?: string
        phone?: string
        website?: string
        description?: string
        address?: string
        city?: string
        country?: string
      },
    ) => {
      return fetchWithAuth(`/firm/${firmId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    create: async (data: {
      cui: string
      name: string
      type: string
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
    }) => {
      return fetchWithAuth<{ firmId: string; firmName: string; message: string }>("/firms/create", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },

  // Config endpoints
  config: {
    getFirmTypes: async () => {
      return fetchPublic<{
        ro: Array<{ value: string; label: string; description: string }>
        en: Array<{ value: string; label: string; description: string }>
      }>("/config/firm-types")
    },
  },

  // Admin endpoints
  admin: {
    universalQuestions: {
      getAll: async () => {
        return fetchWithAuth<{
          questions: Array<{
            id: string
            order: number
            isRequired: boolean
            title: string
            display: string
            description: string | null
            placeholder: string | null
            options: Array<{
              id: string
              value: string
              order: number
              label: string
              display: string
              description: string | null
            }>
          }>
        }>("/admin/universal-questions")
      },

      getById: async (id: string) => {
        return fetchWithAuth<{
          id: string
          order: number
          isRequired: boolean
          title: string
          display: string
          description: string | null
          placeholder: string | null
          options: Array<{
            id: string
            value: string
            order: number
            label: string
            display: string
            description: string | null
          }>
        }>(`/admin/universal-questions/${id}`)
      },

      create: async (data: {
        order: number
        isRequired: boolean
        translations: Array<{
          languageCode: string
          title: string
          display: string
          description?: string
          placeholder?: string
        }>
        options: Array<{
          value: string
          order: number
          translations: Array<{
            languageCode: string
            label: string
            display: string
            description?: string
          }>
          metadata?: string
        }>
      }) => {
        return fetchWithAuth<{
          id: string
          order: number
          isRequired: boolean
          title: string
          display: string
          description: string | null
          placeholder: string | null
          options: Array<{
            id: string
            value: string
            order: number
            label: string
            display: string
            description: string | null
          }>
        }>("/admin/universal-questions", {
          method: "POST",
          body: JSON.stringify(data),
        })
      },

      update: async (
        id: string,
        data: {
          id: string
          order: number
          isRequired: boolean
          translations: Array<{
            languageCode: string
            title: string
            display: string
            description?: string
            placeholder?: string
          }>
          options: Array<{
            value: string
            order: number
            translations: Array<{
              languageCode: string
              label: string
              display: string
              description?: string
            }>
            metadata?: string
          }>
        },
      ) => {
        return fetchWithAuth<{
          id: string
          order: number
          isRequired: boolean
          title: string
          display: string
          description: string | null
          placeholder: string | null
          options: Array<{
            id: string
            value: string
            order: number
            label: string
            display: string
            description: string | null
          }>
        }>(`/admin/universal-questions/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
      },

      delete: async (id: string) => {
        return fetchWithAuth(`/admin/universal-questions/${id}`, {
          method: "DELETE",
        })
      },
    },
  },
}

export const api = apiClient

export const withAuth = fetchWithAuth
export const withoutAuth = fetchPublic

export { ApiError }
