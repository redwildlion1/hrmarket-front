"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api/client"
import { useRouter } from "next/navigation"

interface UserInfo {
  userId: string
  email: string
  isAdmin: boolean
  hasFirm: boolean
  firmId: string | null
  firmName: string | null
  roles: string[]
}

interface AuthContextType {
  userInfo: UserInfo | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, newsletter?: boolean, isFirm?: boolean) => Promise<void>
  logout: () => Promise<void>
  updateUserInfo: (updates: Partial<UserInfo>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const storedUserInfo = localStorage.getItem("userInfo")

      if (!token || !storedUserInfo) {
        setLoading(false)
        return
      }

      const parsedUserInfo = JSON.parse(storedUserInfo)
      setUserInfo(parsedUserInfo)
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userInfo")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await apiClient.auth.login({ email, password })
      setUserInfo(result.userInfo)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, newsletter = false, isFirm = false) => {
    try {
      await apiClient.auth.register({ email, password, newsletter, isFirm })
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userInfo")
    setUserInfo(null)
    router.push("/")
  }

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    if (!userInfo) return

    const updatedUserInfo = { ...userInfo, ...updates }
    setUserInfo(updatedUserInfo)
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
  }

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, register, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
