import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input {...props} className={cn(error && "border-destructive", className)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
