"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/client"

export function useAdminCheck(intervalMs = 30000) {
  // This hook is now disabled as requested
  /*
  const router = useRouter()
  const { userInfo, logout } = useAuth()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      return
    }

    const checkAdminStatus = async () => {
      try {
        const result = await apiClient.auth.checkAdmin()

        if (!result?.isAdmin) {
          await logout()
          router.push("/login")
        }
      } catch (error) {
        console.error("Admin check failed:", error)
        await logout()
        router.push("/login")
      }
    }

    checkAdminStatus()

    intervalRef.current = setInterval(checkAdminStatus, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [userInfo, intervalMs, router, logout])
  */
}
