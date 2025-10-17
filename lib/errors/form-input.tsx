"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormErrors } from "./form-error-context"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
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
  ...inputProps
}) => {
  const { getFieldErrors, clearFieldError } = useFormErrors()

  if (!id) {
    throw new Error("FormInput requires an id prop to match backend validation errors")
  }

  const errors = getFieldErrors(id)
  const hasError = errors.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError) {
      clearFieldError(id)
    }

    onChange?.(e)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {inputProps.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Input
        id={id}
        name={id}
        className={hasError ? "border-destructive focus-visible:ring-destructive" : ""}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...inputProps}
        onChange={handleChange}
      />

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
