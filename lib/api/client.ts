import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added per request when needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = (error.response.data as any)?.message || error.message

      switch (status) {
        case 401:
          console.error("[v0] Unauthorized:", message)
          // Could redirect to login here
          break
        case 403:
          console.error("[v0] Forbidden:", message)
          break
        case 404:
          console.error("[v0] Not found:", message)
          break
        case 500:
          console.error("[v0] Server error:", message)
          break
        default:
          console.error("[v0] API error:", message)
      }
    } else if (error.request) {
      // Request made but no response
      console.error("[v0] No response from server")
    } else {
      // Error in request setup
      console.error("[v0] Request error:", error.message)
    }

    return Promise.reject(error)
  },
)

// Helper to add auth token to config
export const withAuth = (token: string, config?: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

// Generic request methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config)
  },
}

export { apiClient }
export default apiClient
