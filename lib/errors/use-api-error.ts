"use client"

import { useState, useCallback } from "react"
import { type ApiError, parseApiError } from "./errorTypes"

/**
 * Hook for managing API errors in components
 */
export const useApiError = () => {
  const [apiError, setApiError] = useState<ApiError | null>(null)

  const handleError = useCallback((error: any) => {
    const parsedError = parseApiError(error)
    setApiError(parsedError)
    return parsedError
  }, [])

  const clearError = useCallback(() => {
    setApiError(null)
  }, [])

  const clearFieldError = useCallback((fieldName: string) => {
    setApiError((prev) => {
      if (!prev?.problemDetails.validationErrors) return prev

      const newValidationErrors = { ...prev.problemDetails.validationErrors }
      delete newValidationErrors[fieldName]

      // If no validation errors left, clear the entire error
      if (Object.keys(newValidationErrors).length === 0) {
        return null
      }

      return {
        ...prev,
        problemDetails: {
          ...prev.problemDetails,
          validationErrors: newValidationErrors,
        },
      }
    })
  }, [])

  return {
    apiError,
    handleError,
    clearError,
    clearFieldError,
  }
}
