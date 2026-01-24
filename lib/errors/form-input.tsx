"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useFormErrors } from "./form-error-context"
import { Eye, EyeOff } from "lucide-react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  error?: string // Allow passing error directly
}

/**
 * Form input component that automatically displays validation errors
 * based on the input's id prop. Errors are managed by FormErrorProvider.
 *
 * Usage:
 * <FormErrorProvider>
 *   <FormInput id="email" label="Email" type="email" />
 *   <FormInput id="password" label="Password" type="password" />
 * </FormErrorProvider>
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  helperText,
  className = "",
  id,
  onChange,
  type,
  error,
  ...inputProps
}) => {
  const { getFieldErrors, clearFieldError } = useFormErrors()
  const [showPassword, setShowPassword] = useState(false)

  if (!id) {
    throw new Error("FormInput requires an id prop to match backend validation errors")
  }

  // Get errors from context OR use the passed error prop
  const contextErrors = getFieldErrors(id)
  const errors = error ? [error] : contextErrors
  const hasError = errors.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError) {
      clearFieldError(id)
    }

    onChange?.(e)
  }

  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {inputProps.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          name={id}
          type={inputType}
          className={`${hasError ? "border-destructive focus-visible:ring-destructive" : ""} ${isPassword ? "pr-10" : ""} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...inputProps}
          onChange={handleChange}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}
      </div>

      {hasError && (
        <div id={`${id}-error`} className="space-y-1" role="alert">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {!hasError && helperText && (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
