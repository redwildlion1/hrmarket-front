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

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  failedQueue = []
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (token: string | null): Promise<Response> => {
    const language = localStorage.getItem("language") || "ro"

    const headers: Record<string, string> = {
      "Accept-Language": language === "en" ? "en" : "ro",
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
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

  let accessToken = localStorage.getItem("accessToken")
  let response = await makeRequest(accessToken)

  if (response.status === 401) {
    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        response = await makeRequest(token)
      } catch (error) {
        throw error
      }
    } else {
      isRefreshing = true
      const refreshToken = localStorage.getItem("refreshToken")

      if (refreshToken && refreshToken !== "undefined" && accessToken) {
        try {
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
            localStorage.setItem("accessToken", refreshData.token)
            // The backend might return a new refresh token, or it might not.
            // If it does, update it. If not, keep the old one (if it's still valid).
            // Based on the DTO, it seems it returns a new one if rotation is enabled.
            if (refreshData.refreshToken) {
                localStorage.setItem("refreshToken", refreshData.refreshToken)
            }

            if (refreshData.userInfo) {
              localStorage.setItem("userInfo", JSON.stringify(refreshData.userInfo))
            }
            processQueue(null, refreshData.token)
            response = await makeRequest(refreshData.token)
          } else {
            const error = new ApiError(401, "Session expired", "Please login again")
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userInfo")
            processQueue(error, null)
            window.location.href = "/login"
            throw error
          }
        } catch (error) {
          processQueue(error, null)
          if (error instanceof ApiError && error.status === 401) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userInfo")
            window.location.href = "/login"
          }
          throw error
        } finally {
          isRefreshing = false
        }
      } else {
        isRefreshing = false
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userInfo")
        window.location.href = "/login"
        throw new ApiError(401, "Session expired", "Please login again")
      }
    }
  }

  if (!response.ok) {
    let errorData: ProblemDetails
    try {
      errorData = await response.json()
    } catch {
      throw new ApiError(response.status, response.statusText, "An unexpected error occurred")
    }

    // Handle 400 Bad Request specifically for validation and profanity errors
    if (response.status === 400) {
        // If it's a profanity error or other specific error with detail, we might want to throw it
        // so the UI can catch it and display the detail.
        // The ApiError constructor already handles validationErrors if present in errorData.
        // We just need to make sure we pass everything correctly.
        throw new ApiError(
            errorData.status || response.status,
            errorData.title || "An error occurred",
            errorData.detail,
            errorData.validationErrors, // This will be populated for standard validation errors
            errorData.errors || [],
            errorData.traceId,
        )
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

    // Handle 400 Bad Request specifically for validation and profanity errors
    if (response.status === 400) {
        throw new ApiError(
            errorData.status || response.status,
            errorData.title || "An error occurred",
            errorData.detail,
            errorData.validationErrors,
            errorData.errors || [],
            errorData.traceId,
        )
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

// DTOs for Firm Details
export interface FirmDetailsForDisplayDto {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    contact: {
        email: string;
        phone: string | null;
    };
    links: {
        website: string | null;
        linkedIn: string | null;
        facebook: string | null;
        twitter: string | null;
        instagram: string | null;
    };
    location: {
        countryId: string;
        countyId: string;
        cityId: string;
        address: string | null;
        postalCode: string | null;
    };
    forms: Array<{
        categoryId: string;
        questionsWithAnswers: Array<{
            categoryQuestion: {
                id: string;
                type: number; // QuestionType enum
                isRequired: boolean;
                translations: Array<{
                    languageCode: string;
                    title: string;
                    description: string | null;
                    placeholder: string | null;
                }>;
                options: Array<{
                    id: string;
                    value: string;
                    order: number;
                    translations: Array<{
                        languageCode: string;
                        label: string;
                        description: string | null;
                    }>;
                }>;
            };
            categoryAnswer: {
                id: string;
                value: string | null;
                selectedOptionIds: string[];
                translations: Array<{
                    languageCode: string;
                    text: string;
                }>;
            } | null;
        }>;
    }>;
    universalAnswers: Array<{
        universalQuestionId: string;
        selectedOptionId: string;
    }>;
    reviewsCount: number;
    averageRating: number;
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
          personId: string | null
          personName: string | null
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

    forgotPassword: async (email: string) => {
      return fetchPublic("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    },

    resendConfirmationEmail: async (email: string) => {
      return fetchPublic("/auth/resend-confirmation-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    },
  },

  // Person endpoints
  person: {
    create: async (data: {
      firstName: string
      lastName: string
      contactEmail?: string
      contactPhone?: string
      headline?: string
      location: {
        countryId: string
        countyId: string
        cityId: string
      }
      summary?: string
      workHistory: Array<{
        jobTitle: string
        companyName: string
        startDate: string
        endDate?: string
        isCurrentRole: boolean
        description: string
      }>
      educationHistory: Array<{
        institution: string
        degree: string
        description: string
        startDate: string
        graduationDate?: string
      }>
      certifications: Array<{
        name: string
        issuingOrganization: string
        issueDate: string
        expirationDate?: string
        credentialUrl?: string
        credentialId?: string
      }>
      skills: string[]
      languages: string[]
      portfolioUrl?: string
      linkedInUrl?: string
      isOpenToRemote: boolean
      availabilityTimeSpanInDays: number
    }) => {
      return fetchWithAuth<{ personId: string; message: string }>("/person/create", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    getProfile: async () => {
      return fetchWithAuth<any>("/person/profile", {
        method: "GET",
      })
    },

    getById: async (id: string) => {
      return fetchPublic<any>(`/person/${id}`)
    },

    updateBasicInfo: async (data: {
      firstName: string
      lastName: string
      contactEmail?: string
      phoneNumber?: string
      headline: string
      linkedInUrl?: string
      portfolioUrl?: string
    }) => {
      return fetchWithAuth("/person/basic-info", {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    updateLocation: async (data: {
      countryId: string
      countyId: string
      cityId: string
    }) => {
      return fetchWithAuth("/person/location", {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    updateProfessionalSummary: async (data: { summary: string }) => {
      return fetchWithAuth("/person/professional-summary", {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    updatePreferences: async (data: { isOpenToRemote: boolean; availabilityTimeSpanInDays: number }) => {
      return fetchWithAuth("/person/preferences", {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    addWorkExperience: async (data: {
      jobTitle: string
      companyName: string
      startDate: string
      endDate?: string
      description: string
    }) => {
      return fetchWithAuth("/person/work-experience", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateWorkExperience: async (data: {
      id: string
      jobTitle: string
      companyName: string
      startDate: string
      endDate?: string
      description: string
    }) => {
      return fetchWithAuth("/person/work-experience", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    deleteWorkExperience: async (id: string) => {
      return fetchWithAuth("/person/work-experience", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
    },

    addEducation: async (data: {
      institution: string
      degree: string
      startDate: string
      graduationDate?: string
      description: string
    }) => {
      return fetchWithAuth("/person/education", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateEducation: async (data: {
      id: string
      institution: string
      degree: string
      startDate: string
      graduationDate?: string
      description: string
    }) => {
      return fetchWithAuth("/person/education", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    deleteEducation: async (id: string) => {
      return fetchWithAuth("/person/education", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
    },

    addCertification: async (data: {
      name: string
      issuingOrganization: string
      issueDate: string
      expirationDate?: string
      credentialId: string
      credentialUrl: string
    }) => {
      return fetchWithAuth("/person/certifications", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateCertification: async (data: {
      id: string
      name: string
      issuingOrganization: string
      issueDate: string
      expirationDate?: string
      credentialId: string
      credentialUrl: string
    }) => {
      return fetchWithAuth("/person/certifications", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    deleteCertification: async (id: string) => {
      return fetchWithAuth("/person/certifications", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
    },

    updateSkills: async (skills: string[]) => {
      return fetchWithAuth("/person/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      })
    },

    updateLanguages: async (languages: string[]) => {
      return fetchWithAuth("/person/languages", {
        method: "PUT",
        body: JSON.stringify({ languages }),
      })
    },

    uploadCv: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      return fetchWithAuth<{ status: string | number; url?: string }>("/media/my-cv", {
        method: "POST",
        body: formData,
      })
    },

    uploadMedia: async (file: File, type: "Avatar" = "Avatar") => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      return fetchWithAuth<{ status: string }>("/media/my-person", {
        method: "POST",
        body: formData,
      })
    },
  },

  // Company/Firm endpoints
  firms: {
    create: async (data: {
      cui: string
      name: string
      type: string
      description?: string
      contact: {
        email: string
        phone?: string | null
      }
      links: {
        website?: string | null
        linkedIn?: string | null;
        facebook?: string | null;
        twitter?: string | null;
        instagram?: string | null;
      }
      location: {
        countryId: string
        countyId: string
        cityId: string
        address?: string | null
        postalCode?: string | null
      }
      universalQuestionAnswers: Array<{
        universalQuestionId: string
        selectedOptionId: string
      }>
    }) => {
      return fetchWithAuth<{ firmId: string; firmName: string; message: string }>("/firms/create", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    uploadMedia: async (file: File, type: "Logo" | "Banner") => {
      const formData = new FormData()
      formData.append("file", file)

      return fetchWithAuth<any>(`/media/my-firm/${type}`, {
        method: "POST",
        body: formData,
      })
    },

    search: async (params: {
      categoryId?: string
      name?: string
      optionIds?: string[]
      pageNumber?: number
      pageSize?: number
    }) => {

      return fetchPublic<Array<{
        id: string
        name: string
        logoUrl: string | null
        categoryIds: string[] | null
        optionsIds: string[]
        averageRating: number
        reviewsCount: number
        countryId: string | null
        countyId: string | null
        cityId: string | null
      }>>("/firms/search", {
        method: "POST",
        body: JSON.stringify(params),
      })
    },

    getById: async (id: string) => {
      return fetchPublic<FirmDetailsForDisplayDto>(`/firms/${id}`)
    },

    // Reviews endpoints
    reviews: {
        get: async (data: {
            firmId: string;
            pageNumber?: number;
            pageSize?: number;
            sortingOption?: number;
            currentPersonId?: string;
        }) => {
            return fetchPublic<Array<{
                personId: string;
                personFullName: string;
                personAvatarUrl: string | null;
                rating: number;
                comment: string;
                createdAt: string;
                isCurrentPersonReview: boolean;
            }>>("/firms/reviews/get", {
                method: "POST",
                body: JSON.stringify(data)
            })
        },

        create: async (firmId: string, data: { rating: number; comment: string }) => {
            return fetchWithAuth(`/firms/reviews/${firmId}`, {
                method: "POST",
                body: JSON.stringify(data)
            })
        },

        update: async (firmId: string, data: { rating: number; comment: string }) => {
            return fetchWithAuth(`/firms/reviews/${firmId}`, {
                method: "PUT",
                body: JSON.stringify(data)
            })
        },

        delete: async (firmId: string) => {
            return fetchWithAuth(`/firms/reviews/${firmId}`, {
                method: "DELETE"
            })
        }
    }
  },

  // Job Posts endpoints
  jobs: {
    search: async (params: {
      page?: number
      pageSize?: number
      location?: number
      specialization?: number
      seniority?: number
      postedTimeFrame?: number
      employmentType?: number
      workLocationType?: number
      justFastApply?: boolean
      allowExternalApplications?: boolean
      sortByMostViewed?: boolean
      sortByLeastViewed?: boolean
      sortByMostApplied?: boolean
      sortByLeastApplied?: boolean
      sortByNewest?: boolean
      sortByOldest?: boolean
      personId?: string
    }) => {
      // Use fetchWithAuth to include the token if available, so the backend can check if the user applied
      const token = localStorage.getItem("accessToken");
      
      // Add personId from local storage if available
      let personId = params.personId;
      if (!personId) {
          const userInfoStr = localStorage.getItem("userInfo");
          if (userInfoStr) {
              try {
                  const userInfo = JSON.parse(userInfoStr);
                  personId = userInfo.personId;
              } catch (e) {}
          }
      }
      
      const requestParams = { ...params, personId };

      if (token) {
          return fetchWithAuth<{
            totalCount: number
            documents: Array<{
              id: string
              title: string
              firmId: string
              specialization: number
              seniority: number
              countryId: string | null
              countyId: string | null
              cityId: string | null
              compensation: number | null
              employmentType: number
              workLocationType: number
              applicationLink: string | null
              postedDate: string
              views: number
              applicationsCount: number
              externalApplication: boolean
              firmName: string
              firmLogoUrl: string | null
              firmAverageRating: number
              appliedByCurrentUser: boolean
            }>
          }>("/jobposts", {
            method: "POST",
            body: JSON.stringify(requestParams),
          })
      } else {
          return fetchPublic<{
            totalCount: number
            documents: Array<{
              id: string
              title: string
              firmId: string
              specialization: number
              seniority: number
              countryId: string | null
              countyId: string | null
              cityId: string | null
              compensation: number | null
              employmentType: number
              workLocationType: number
              applicationLink: string | null
              postedDate: string
              views: number
              applicationsCount: number
              externalApplication: boolean
              firmName: string
              firmLogoUrl: string | null
              firmAverageRating: number
              appliedByCurrentUser: boolean
            }>
          }>("/jobposts", {
            method: "POST",
            body: JSON.stringify(requestParams),
          })
      }
    },

    getByFirm: async (firmId: string) => {
        // Use fetchWithAuth to include the token if available
        const token = localStorage.getItem("accessToken");
        
        let personId = null;
        const userInfoStr = localStorage.getItem("userInfo");
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                personId = userInfo.personId;
            } catch (e) {}
        }
        
        const routeSuffix = personId ? `/${personId}` : "";

        if (token) {
            return fetchWithAuth<{
                totalCount: number
                documents: Array<{
                  id: string
                  title: string
                  firmId: string
                  specialization: number
                  seniority: number
                  countryId: string | null
                  countyId: string | null
                  cityId: string | null
                  compensation: number | null
                  employmentType: number
                  workLocationType: number
                  applicationLink: string | null
                  postedDate: string
                  views: number
                  applicationsCount: number
                  externalApplication: boolean
                  firmName: string
                  firmLogoUrl: string | null
                  firmAverageRating: number
                  appliedByCurrentUser: boolean
                }>
              }>(`/jobposts/by-firm/${firmId}${routeSuffix}`)
        } else {
            return fetchPublic<{
                totalCount: number
                documents: Array<{
                  id: string
                  title: string
                  firmId: string
                  specialization: number
                  seniority: number
                  countryId: string | null
                  countyId: string | null
                  cityId: string | null
                  compensation: number | null
                  employmentType: number
                  workLocationType: number
                  applicationLink: string | null
                  postedDate: string
                  views: number
                  applicationsCount: number
                  externalApplication: boolean
                  firmName: string
                  firmLogoUrl: string | null
                  firmAverageRating: number
                  appliedByCurrentUser: boolean
                }>
              }>(`/jobposts/by-firm/${firmId}${routeSuffix}`)
        }
    },

    getById: async (id: string) => {
      // Use fetchWithAuth to include the token if available
      const token = localStorage.getItem("accessToken");
      
      let personId = null;
      let firmId = null;
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
          try {
              const userInfo = JSON.parse(userInfoStr);
              personId = userInfo.personId;
              firmId = userInfo.firmId;
          } catch (e) {}
      }
      
      const params = new URLSearchParams();
      if (personId) params.append("personId", personId);
      if (firmId) params.append("firmId", firmId);
      
      const query = params.toString() ? `?${params.toString()}` : "";

      if (token) {
          return fetchWithAuth<any>(`/jobposts/${id}${query}`)
      } else {
          return fetchPublic<any>(`/jobposts/${id}${query}`)
      }
    },

    apply: async (id: string) => {
        return fetchWithAuth(`/jobposts/apply/${id}`, {
            method: "POST"
        })
    },

    update: async (data: any) => {
        return fetchWithAuth("/jobposts/update", {
            method: "PUT",
            body: JSON.stringify(data)
        })
    },

    getForManagement: async (id: string) => {
        return fetchWithAuth<any>(`/jobposts/management/${id}`)
    }
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
      return fetchWithAuth<Array<{ id: string; name: string }>>("/location-elements/countries")
    },

    getCounties: async (countryId: string) => {
      // Check local storage first
      const cachedCountry = localStorage.getItem(`country_${countryId}`)
      if (cachedCountry) {
        const countryData = JSON.parse(cachedCountry)
        return countryData.counties.map((c: any) => ({ id: c.id, name: c.name }))
      }

      // If not in cache, fetch full country data
      try {
        const fullCountry = await fetchWithAuth<{
          id: string
          name: string
          counties: Array<{
            id: string
            name: string
            cities: Array<{ id: string; name: string }>
          }>
        }>(`/location-elements/${countryId}/full`)
        
        // Cache the full country data
        localStorage.setItem(`country_${countryId}`, JSON.stringify(fullCountry))
        
        return fullCountry.counties.map(c => ({ id: c.id, name: c.name }))
      } catch (error) {
        // Fallback to simple endpoint if full fetch fails
        return fetchWithAuth<Array<{ id: string; name: string }>>(`/location-elements/${countryId}/counties`)
      }
    },

    getCities: async (countyId: string) => {
      // We need to find which country this county belongs to in order to use the cache
      // This is a bit tricky since we don't have the countryId here.
      // However, we can iterate through cached countries to find the county.
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("country_")) {
          const countryData = JSON.parse(localStorage.getItem(key) || "{}")
          const county = countryData.counties?.find((c: any) => c.id === countyId)
          if (county) {
            return county.cities
          }
        }
      }

      // If not found in cache, fetch from API
      return fetchWithAuth<Array<{ id: string; name: string }>>(`/location-elements/${countyId}/cities`)
    },

    getLocationSimple: async (countryId: number, countyId: number) => {
      return fetchPublic<{
        country: { id: number; name: string }
        county: { id: number; name: string }
      }>(`/location-elements/simple?countryId=${countryId}&countyId=${countyId}`)
    },
  },

  // Subscription endpoints
  subscriptions: {
    getPlans: async () => {
      return fetchPublic<{
        plans: Array<{
          id: string
          stripeProductId: string
          isPopular: boolean
          maxCategories: number
          maxArticles: number
          maxOpenJobs: number
          displayOrder: number
          isActive: boolean
          translations: Array<{
            languageCode: string
            name: string
            description: string | null
          }>
          features: Array<{
            order: number
            translations: Array<{
              languageCode: string
              text: string
            }>
          }>
          prices: Array<{
            currency: string
            currencyCode: string
            currencySymbol: string
            monthlyPrice: number
            yearlyPrice: number
            stripePriceIdMonthly: string
            stripePriceIdYearly: string
          }>
        }>
        totalCount: number
      }>("/subscriptions/plans")
    },

    getPlan: async (planId: string) => {
      return fetchWithAuth<{
        id: string
        stripeProductId: string
        isPopular: boolean
        maxCategories: number
        maxArticles: number
        maxOpenJobs: number
        displayOrder: number
        isActive: boolean
        translations: Array<{
          languageCode: string
          name: string
          description: string | null
        }>
        features: Array<{
          order: number
          translations: Array<{
            languageCode: string
            text: string
          }>
        }>
        prices: Array<{
          currency: string
          currencyCode: string
          currencySymbol: string
          monthlyPrice: number
          yearlyPrice: number
          stripePriceIdMonthly: string
          stripePriceIdYearly: string
        }>
      }>(`/subscriptions/plans/${planId}`)
    },

    createPlan: async (data: {
      translations: Array<{
        languageCode: string
        name: string
        description?: string
      }>
      features: Array<{
        order: number
        translations: Array<{
          languageCode: string
          text: string
        }>
      }>
      prices: Array<{
        currency: "EUR" | "RON"
        monthlyPrice: number
        yearlyPrice: number
      }>
      isPopular: boolean
      maxCategories: number
      maxArticles: number
      maxOpenJobs: number
      displayOrder: number
    }) => {
      return fetchWithAuth("/subscriptions/plans", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updatePlan: async (
      planId: string,
      data: {
        id: string
        translations: Array<{
          languageCode: string
          name: string
          description?: string
        }>
        features: Array<{
          order: number
          translations: Array<{
            languageCode: string
            text: string
          }>
        }>
        isPopular: boolean
        maxListings: number // Backend uses maxListings in update DTO
        maxCategories: number
        maxArticles: number
        maxOpenJobs: number
        displayOrder: number
        isActive: boolean
      },
    ) => {
      return fetchWithAuth(`/subscriptions/plans/${planId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    deletePlan: async (planId: string) => {
      return fetchWithAuth(`/subscriptions/plans/${planId}`, {
        method: "DELETE",
      })
    },

    createCheckoutSession: async (data: {
      firmId: string
      planId: string
      priceId: string
      isYearly: boolean
      currency: "EUR" | "RON"
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
        currency: string
        currentPrice: number
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
        bannerUrl: string | null
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

    getMyFirm: async () => {
      const result = await fetchWithAuth<{
        id: string
        cui: string
        name: string
        type: string
        description?: string
        status: string | number
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
        universalAnswers: Array<{
          icon: string
          questionDisplayTranslations: Array<{
            languageCode: string
            name: string
            description?: string
          }>
          answerTranslations: Array<{
            languageCode: string
            name: string
            description?: string
          }>
        }>
      }>("/firms/my-firm", {
        method: "GET",
      })
      return result
    },

    updateLocation: async (data: { address?: string; countryId: string; countyId: string; cityId: string; postalCode?: string }) => {
      return fetchWithAuth("/firms/update-location", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    updateContact: async (data: { phone?: string; email?: string }) => {
      return fetchWithAuth("/firms/update-contact", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    updateLinks: async (data: { website?: string; linkedIn?: string; facebook?: string; twitter?: string; instagram?: string }) => {
      return fetchWithAuth("/firms/update-links", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    updateDescription: async (data: { description: string }) => {
      return fetchWithAuth("/firms/update-description", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    updateType: async (data: { type: string }) => {
      return fetchWithAuth("/firms/update-type", {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    submitForVerification: async () => {
      return fetchWithAuth("/firms/submit-for-review", {
        method: "POST",
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

  // Universal Questions endpoints
  universalQuestions: {
    getAll: async () => {
      return fetchPublic<Array<{
        id: string
        order: number
        icon: string
        isRequired: boolean
        isActive: boolean
        createdAt: string
        updatedAt: string | null
        translations: Array<{
          languageCode: string
          title: string
          display: string
          description: string | null
          placeholder: string | null
        }>
        options: Array<{
          id: string
          value: string
          order: number
          metadata: string | null
          translations: Array<{
            languageCode: string
            label: string
            display: string
            description: string | null
          }>
        }>
      }>>("/universal-questions")
    },
  },

  // Admin endpoints
  admin: {
    getFirmsAwaitingReview: async (page = 1, pageSize = 20) => {
      return fetchWithAuth<Array<{
        id: string
        cui: string
        name: string
        type: string
        ownerEmail: string
        description: string | null
        logoUrl: string | null
        bannerUrl: string | null
        status: number
        rejectionReasonType: number | null
        submittedForReviewAt: string
      }>>(`/admin/firms/awaiting-review?page=${page}&pageSize=${pageSize}`)
    },

    verifyFirm: async (data: {
      firmId: string
      status: "approved" | "rejected"
      rejectionReason?: string
      rejectionNote?: string
    }) => {
      return fetchWithAuth(`/admin/firms/${data.firmId}/verify`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    universalQuestions: {
      getAll: async () => {
        return fetchWithAuth<Array<{
          id: string
          order: number
          icon: string
          isRequired: boolean
          isActive: boolean
          createdAt: string
          updatedAt: string | null
          translations: Array<{
            languageCode: string
            title: string
            display: string
            description: string | null
            placeholder: string | null
          }>
          options: Array<{
            id: string
            value: string
            order: number
            metadata: string | null
            translations: Array<{
              languageCode: string
              label: string
              display: string
              description: string | null
            }>
          }>
        }>>("/universal-questions")
      },

      getById: async (id: string) => {
        return fetchWithAuth<{
          id: string
          order: number
          icon: string
          isRequired: boolean
          isActive: boolean
          createdAt: string
          updatedAt: string | null
          translations: Array<{
            languageCode: string
            title: string
            display: string
            description: string | null
            placeholder: string | null
          }>
          options: Array<{
            id: string
            value: string
            order: number
            metadata: string | null
            translations: Array<{
              languageCode: string
              label: string
              display: string
              description: string | null
            }>
          }>
        }>(`/admin/universal-questions/${id}`)
      },

      create: async (data: {
        order: number
        icon: string
        isRequired: boolean
        isActive?: boolean
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
          icon: string
          isRequired: boolean
          isActive: boolean
          createdAt: string
          updatedAt: string | null
          translations: Array<{
            languageCode: string
            title: string
            display: string
            description: string | null
            placeholder: string | null
          }>
          options: Array<{
            id: string
            value: string
            order: number
            metadata: string | null
            translations: Array<{
              languageCode: string
              label: string
              display: string
              description: string | null
            }>
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
          icon: string
          isRequired: boolean
          isActive: boolean
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
          icon: string
          isRequired: boolean
          isActive: boolean
          createdAt: string
          updatedAt: string | null
          translations: Array<{
            languageCode: string
            title: string
            display: string
            description: string | null
            placeholder: string | null
          }>
          options: Array<{
            id: string
            value: string
            order: number
            metadata: string | null
            translations: Array<{
              languageCode: string
              label: string
              display: string
              description: string | null
            }>
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

    // HR Talks blog management endpoints
    blogs: {
      getAll: async () => {
        return fetchWithAuth<{
          blogs: Array<{
            id: string
            title: string
            content: string // Changed from 'any' to 'string' for HTML content
            createdAt: string
            updatedAt: string | null
          }>
        }>("/admin/blogs")
      },

      getById: async (id: string) => {
        return fetchWithAuth<{
          id: string
          title: string
          content: string // Changed from 'any' to 'string' for HTML content
          createdAt: string
          updatedAt: string | null
        }>(`/admin/blogs/${id}`)
      },

      create: async (data: { title: string; content: string }) => {
        // Changed content type to string
        return fetchWithAuth<{
          id: string
          title: string
          content: string
          createdAt: string
        }>("/admin/blogs", {
          method: "POST",
          body: JSON.stringify(data),
        })
      },

      update: async (id: string, data: { title: string; content: string }) => {
        // Changed content type to string
        return fetchWithAuth<{
          id: string
          title: string
          content: string
          updatedAt: string
        }>(`/admin/blogs/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
      },

      delete: async (id: string) => {
        return fetchWithAuth(`/admin/blogs/${id}`, {
          method: "DELETE",
        })
      },

      uploadImage: async (file: File) => {
        const formData = new FormData()
        formData.append("image", file)

        const result = await fetchWithAuth<{ url: string }>("/api/upload", {
          method: "POST",
          body: formData,
        })
        return result
      },
    },
  },
}

export const api = apiClient

export const withAuth = fetchWithAuth
export const withoutAuth = fetchPublic

export { ApiError }
