// Types matching the backend ProblemDetails response

export interface ProblemDetails {
  title: string
  detail?: string
  status: number
  instance?: string
  timestamp: string
  traceId?: string
  validationErrors?: Record<string, string[]>
  errors?: string[]
}

export interface ApiError {
  problemDetails: ProblemDetails
  isValidationError: boolean
  isServerError: boolean
  isClientError: boolean
}

/**
 * Parse error response from API
 */
export const parseApiError = (error: any): ApiError => {
  // Handle axios error response
  const response = error.response?.data || error

  const problemDetails: ProblemDetails = {
    title: response.title || "An error occurred",
    detail: response.detail,
    status: response.status || error.response?.status || 500,
    instance: response.instance,
    timestamp: response.timestamp || new Date().toISOString(),
    traceId: response.traceId,
    validationErrors: response.validationErrors,
    errors: response.errors,
  }

  return {
    problemDetails,
    isValidationError: !!problemDetails.validationErrors,
    isServerError: problemDetails.status >= 500,
    isClientError: problemDetails.status >= 400 && problemDetails.status < 500,
  }
}

/**
 * Get error message for a specific field
 */
export const getFieldErrors = (apiError: ApiError | null, fieldName: string): string[] => {
  if (!apiError?.problemDetails.validationErrors) {
    return []
  }

  return apiError.problemDetails.validationErrors[fieldName] || []
}

/**
 * Get first error message for a specific field
 */
export const getFirstFieldError = (apiError: ApiError | null, fieldName: string): string | null => {
  const errors = getFieldErrors(apiError, fieldName)
  return errors.length > 0 ? errors[0] : null
}

/**
 * Check if a field has errors
 */
export const hasFieldError = (apiError: ApiError | null, fieldName: string): boolean => {
  return getFieldErrors(apiError, fieldName).length > 0
}

/**
 * Get all validation errors as a flat array
 */
export const getAllValidationErrors = (apiError: ApiError | null): string[] => {
  if (!apiError?.problemDetails.validationErrors) {
    return []
  }

  return Object.values(apiError.problemDetails.validationErrors).flat()
}

/**
 * Get general (non-field-specific) errors
 */
export const getGeneralErrors = (apiError: ApiError | null): string[] => {
  return apiError?.problemDetails.errors || []
}
