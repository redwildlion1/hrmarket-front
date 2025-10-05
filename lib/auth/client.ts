"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api/auth"

export interface User {
  id: string
  email: string
  accountType?: "user" | "company"
  [key: string]: any
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("[v0] Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    setUser(response.user)
    return response.user
  }

  const register = async (email: string, password: string, accountType: "user" | "company" = "user") => {
    const response = await authApi.register({ email, password, accountType })
    setUser(response.user)
    return response.user
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return { user, loading, login, register, logout, refetch: fetchUser }
}
