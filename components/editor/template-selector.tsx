"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { blogTemplates, type BlogTemplate } from "./blog-templates"
import { Check } from 'lucide-react'
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
    { id: "corporate-event" as const, name: "Corporate Events", emoji: "🎪" },
  ]

  const filteredTemplates =
    selectedCategory === "all" ? blogTemplates : blogTemplates.filter((t) => t.category === selectedCategory)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] overflow-hidden flex flex-col p-8">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-3xl">Choose a Template</DialogTitle>
          <DialogDescription className="text-base">Select a professionally designed template to start your blog post</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="default"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "group border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:border-primary",
                  previewTemplate?.id === template.id && "ring-4 ring-primary border-primary",
                )}
                onClick={() => setPreviewTemplate(template)}
              >
                <div className="bg-white p-8 max-h-[50vh] overflow-y-auto border-b-4 border-gray-100">
                  <div dangerouslySetInnerHTML={{ __html: template.html }} />
                </div>
                <div className="p-6 bg-muted/30">
                  <h3 className="font-semibold text-xl mb-2">{template.name}</h3>
                  <p className="text-base text-muted-foreground mb-4">{template.description}</p>
                  <Button
                    size="lg"
                    className="w-full text-base"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTemplate(template)
                      onOpenChange(false)
                    }}
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {previewTemplate && (
            <div className="border-t-2 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">{previewTemplate.name}</h3>
                  <p className="text-base text-muted-foreground mt-1">{previewTemplate.description}</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    onSelectTemplate(previewTemplate)
                    onOpenChange(false)
                  }}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Use This Template
                </Button>
              </div>
              <div
                className="border-2 rounded-xl p-12 bg-white max-h-[90vh] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
              />
            </div>
          )}

          {/* Blank Template Option */}
          <div className="border-t-2 pt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-transparent text-base"
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
