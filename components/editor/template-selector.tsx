"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { blogTemplates, type BlogTemplate } from "./blog-templates"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: BlogTemplate) => void
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogTemplate["category"] | "all">("all")
  const [previewTemplate, setPreviewTemplate] = useState<BlogTemplate | null>(null)

  const categories = [
    { id: "all" as const, name: "All Templates", emoji: "📚" },
    { id: "professional" as const, name: "Professional", emoji: "🏢" },
    { id: "creative" as const, name: "Creative", emoji: "🎨" },
    { id: "minimal" as const, name: "Minimal", emoji: "⚪" },
    { id: "vibrant" as const, name: "Vibrant", emoji: "🎉" },
    { id: "tech" as const, name: "Tech", emoji: "💻" },
    { id: "editorial" as const, name: "Editorial", emoji: "📰" },
  ]

  const filteredTemplates =
    selectedCategory === "all" ? blogTemplates : blogTemplates.filter((t) => t.category === selectedCategory)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
          <DialogDescription>Select a professionally designed template to start your blog post</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "group border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary",
                  previewTemplate?.id === template.id && "ring-2 ring-primary",
                )}
                onClick={() => setPreviewTemplate(template)}
              >
                <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center text-6xl">
                  {template.preview}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTemplate(template)
                      onOpenChange(false)
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          {previewTemplate && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{previewTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
                </div>
                <Button
                  onClick={() => {
                    onSelectTemplate(previewTemplate)
                    onOpenChange(false)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Use This Template
                </Button>
              </div>
              <div
                className="border rounded-lg p-8 bg-white max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
              />
            </div>
          )}

          {/* Blank Template Option */}
          <div className="border-t pt-6">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                onSelectTemplate({
                  id: "blank",
                  name: "Blank",
                  description: "Start from scratch",
                  category: "minimal",
                  preview: "📄",
                  html: "<p>Start writing your content here...</p>",
                })
                onOpenChange(false)
              }}
            >
              Start with a Blank Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
