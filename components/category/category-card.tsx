"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  name: string
  description?: string
  selected: boolean
  onClick: () => void
}

export function CategoryCard({ name, description, selected, onClick }: CategoryCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer border-2 p-4 transition-all hover:border-primary",
        selected && "border-primary bg-primary/5",
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" />
        </div>
      )}
      <h3 className="font-semibold">{name}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </Card>
  )
}
