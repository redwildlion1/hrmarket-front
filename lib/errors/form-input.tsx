"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiError } from "@/lib/api/client"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  apiError?: ApiError | null
  helperText?: string
  onErrorClear?: (fieldName: string) => void
}

/**
 * Form input component that displays validation errors from the API
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  apiError,
  helperText,
  onErrorClear,
  className = "",
  ...inputProps
}) => {
  const errors = apiError?.validationErrors?.[name] || []
  const hasError = errors.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear field error when user starts typing
    if (hasError && onErrorClear) {
      onErrorClear(name)
    }

    inputProps.onChange?.(e)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {inputProps.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        className={hasError ? "border-destructive focus-visible:ring-destructive" : ""}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        {...inputProps}
        onChange={handleChange}
      />

      {hasError && (
        <div id={`${name}-error`} className="space-y-1" role="alert">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {!hasError && helperText && (
        <p id={`${name}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
