"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"

export function useAdminCheck() {
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const result = await apiClient.auth.checkAdmin()
        if (!result.isAdmin) {
          router.push("/")
        }
      } catch (error) {
        router.push("/login")
      }
    }

    checkAdmin()

    // Check periodically every 5 minutes
    const interval = setInterval(checkAdmin, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [router])
}
