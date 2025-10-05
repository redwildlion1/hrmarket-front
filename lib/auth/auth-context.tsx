"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type AuthResponse } from "@/lib/api/auth"

interface AuthContextType {
  user: AuthResponse["user"] | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, accountType: "user" | "company") => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      // Fetch user data
      authApi
        .getCurrentUser(storedToken)
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem("auth_token")
          setToken(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem("auth_token", response.token)
  }

  const register = async (email: string, password: string, accountType: "user" | "company") => {
    const response = await authApi.register({ email, password, confirmPassword: password, accountType })
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem("auth_token", response.token)
  }

  const logout = async () => {
    if (token) {
      try {
        await authApi.logout(token)
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
