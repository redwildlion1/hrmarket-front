import { api, withAuth } from "./client"

// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  accountType?: "user" | "company"
}

export interface ResetPasswordRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Response types
export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export interface MessageResponse {
  message: string
}

// Auth API methods
export const authApi = {
  // POST /auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data)
    return response.data
  },

  // POST /auth/register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data)
    return response.data
  },

  // POST /auth/logout
  logout: async (token: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/logout", {}, withAuth(token))
    return response.data
  },

  // POST /auth/reset-password
  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/reset-password", data)
    return response.data
  },

  // POST /auth/change-password
  changePassword: async (data: ChangePasswordRequest, token: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/change-password", data, withAuth(token))
    return response.data
  },

  // GET /auth/me
  getCurrentUser: async (token: string): Promise<AuthResponse["user"]> => {
    const response = await api.get<AuthResponse["user"]>("/auth/me", withAuth(token))
    return response.data
  },
}
