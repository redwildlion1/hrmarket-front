"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegistrationProgressProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function RegistrationProgress({ currentStep, totalSteps, steps }: RegistrationProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    !isCompleted && !isCurrent && "border-muted bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-xs font-medium md:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div className={cn("mx-2 h-0.5 flex-1 transition-colors", isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
