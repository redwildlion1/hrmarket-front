"use client"

import type React from "react"
import { useFormErrors } from "@/lib/errors/form-error-context"
import { getAllValidationErrors, getGeneralErrors } from "@/lib/errors/types"

interface ErrorAlertProps {
  showValidationErrors?: boolean
  className?: string
}

/**
 * Alert component that automatically displays API errors from FormErrorProvider
 * Shows general errors and optionally validation errors
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ showValidationErrors = false, className = "" }) => {
  const { apiError, clearError } = useFormErrors()

  if (!apiError) return null

  const { problemDetails, isServerError } = apiError
  const generalErrors = getGeneralErrors(apiError)
  const validationErrors = showValidationErrors ? getAllValidationErrors(apiError) : []
  const allErrors = [...generalErrors, ...validationErrors]

  return (
    <div
      className={`rounded-md p-4 ${
        isServerError ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"
      } ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {isServerError ? (
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${isServerError ? "text-red-800" : "text-yellow-800"}`}>
            {problemDetails.title}
          </h3>

          {problemDetails.detail && (
            <div className={`mt-2 text-sm ${isServerError ? "text-red-700" : "text-yellow-700"}`}>
              <p>{problemDetails.detail}</p>
            </div>
          )}

          {allErrors.length > 0 && (
            <div className={`mt-2 text-sm ${isServerError ? "text-red-700" : "text-yellow-700"}`}>
              <ul className="list-disc pl-5 space-y-1">
                {allErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {problemDetails.traceId && process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-gray-500">Trace ID: {problemDetails.traceId}</div>
          )}
        </div>

        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={clearError}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isServerError
                  ? "text-red-500 hover:bg-red-100 focus:ring-red-600"
                  : "text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600"
              }`}
              aria-label="Dismiss"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
