"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { ApiError } from "./types"
import { parseApiError } from "./types"

interface FormErrorContextValue {
  apiError: ApiError | null
  setError: (error: any) => void
  clearError: () => void
  clearFieldError: (fieldId: string) => void
  getFieldErrors: (fieldId: string) => string[]
  hasFieldError: (fieldId: string) => boolean
}

const FormErrorContext = createContext<FormErrorContextValue | undefined>(undefined)

/**
 * Provider component that manages form errors for all child inputs
 * Automatically parses backend ProblemDetails responses
 */
export function FormErrorProvider({ children }: { children: React.ReactNode }) {
  const [apiError, setApiError] = useState<ApiError | null>(null)

  const setError = useCallback((error: any) => {
    const parsed = parseApiError(error)
    setApiError(parsed)
  }, [])

  const clearError = useCallback(() => {
    setApiError(null)
  }, [])

  const clearFieldError = useCallback((fieldId: string) => {
    setApiError((prev) => {
      if (!prev?.problemDetails.validationErrors) return prev

      const newValidationErrors = { ...prev.problemDetails.validationErrors }
      delete newValidationErrors[fieldId]

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

  const getFieldErrors = useCallback(
    (fieldId: string): string[] => {
      return apiError?.problemDetails.validationErrors?.[fieldId] || []
    },
    [apiError],
  )

  const hasFieldError = useCallback(
    (fieldId: string): boolean => {
      return getFieldErrors(fieldId).length > 0
    },
    [getFieldErrors],
  )

  return (
    <FormErrorContext.Provider
      value={{
        apiError,
        setError,
        clearError,
        clearFieldError,
        getFieldErrors,
        hasFieldError,
      }}
    >
      {children}
    </FormErrorContext.Provider>
  )
}

/**
 * Hook to access form error context
 * Must be used within a FormErrorProvider
 */
export function useFormErrors() {
  const context = useContext(FormErrorContext)
  if (!context) {
    throw new Error("useFormErrors must be used within a FormErrorProvider")
  }
  return context
}
