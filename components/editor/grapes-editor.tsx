"use client"

import { useEffect, useRef } from "react"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"
import gjsPresetWebpage from "grapesjs-preset-webpage"
import { templates } from "./blog-templates"

interface GrapesEditorProps {
  content: string
  onChange: (html: string) => void
}

export function GrapesEditor({ content, onChange }: GrapesEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: "100%",
      width: "auto",
      storageManager: false,
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        [gjsPresetWebpage as any]: {
          blocksBasicOpts: {
            blocks: ["column1", "column2", "column3", "column3-7", "text", "link", "image"],
            flexGrid: 1,
          },
          blocks: ["link-block", "quote", "text-basic"],
          modalImportTitle: "Import Template",
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: (editor: any) => {
            return (
              editor.getHtml() +
              "<style>" +
              editor.getCss() +
              "</style>"
            )
          },
          importPlaceholder: "",
        },
      },
      canvas: {
        styles: [],
        scripts: [],
      },
      blockManager: {
        appendTo: ".blocks-container",
      },
      styleManager: {
        appendTo: ".styles-container",
        sectors: [
          {
            name: "General",
            open: true,
            properties: [
              {
                type: "color",
                property: "background-color",
                default: "#ffffff",
              },
              {
                type: "color",
                property: "color",
                default: "#000000",
              },
              {
                type: "slider",
                property: "opacity",
                defaults: 1,
                step: 0.01,
                max: 1,
                min: 0,
              },
            ],
          },
          {
            name: "Typography",
            open: false,
            properties: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "line-height",
              "text-align",
            ],
          },
          {
            name: "Decorations",
            open: false,
            properties: [
              "border-radius",
              "border",
              "box-shadow",
              "background",
            ],
          },
          {
            name: "Layout",
            open: false,
            properties: [
              "width",
              "height",
              "max-width",
              "min-height",
              "margin",
              "padding",
            ],
          },
          {
            name: "Flexbox",
            open: false,
            properties: [
              "display",
              "flex-direction",
              "justify-content",
              "align-items",
              "flex-wrap",
              "gap",
            ],
          },
        ],
      },
      layerManager: {
        appendTo: ".layers-container",
      },
      traitManager: {
        appendTo: ".traits-container",
      },
      selectorManager: {
        appendTo: ".selectors-container",
      },
      panels: {
        defaults: [],
      },
    })

    // Add custom HR-themed blocks
    editor.BlockManager.add("hr-hero-section", {
      label: "Hero Section",
      category: "HR Components",
      content: `
        <section style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 5rem 2rem; text-align: center;">
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">Welcome to HR Excellence</h1>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Transform your workplace with innovative HR solutions</p>
          <a href="#" style="display: inline-block; background: white; color: #dc2626; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Get Started</a>
        </section>
      `,
    })

    editor.BlockManager.add("hr-feature-card", {
      label: "Feature Card",
      category: "HR Components",
      content: `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="width: 3rem; height: 3rem; background: #fee2e2; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <span style="font-size: 1.5rem;">🎯</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #111827;">Feature Title</h3>
          <p style="color: #6b7280; line-height: 1.6;">Describe your amazing feature here with compelling copy that engages readers.</p>
        </div>
      `,
    })

    editor.BlockManager.add("hr-stats-section", {
      label: "Stats Section",
      category: "HR Components",
      content: `
        <section style="background: #f9fafb; padding: 4rem 2rem;">
          <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; text-align: center;">
            <div>
              <div style="font-size: 3rem; font-weight: bold; color: #dc2626; margin-bottom: 0.5rem;">500+</div>
              <div style="color: #6b7280; font-size: 1.125rem;">Happy Clients</div>
            </div>
            <div>
              <div style="font-size: 3rem; font-weight: bold; color: #dc2626; margin-bottom: 0.5rem;">98%</div>
              <div style="color: #6b7280; font-size: 1.125rem;">Success Rate</div>
            </div>
            <div>
              <div style="font-size: 3rem; font-weight: bold; color: #dc2626; margin-bottom: 0.5rem;">24/7</div>
              <div style="color: #6b7280; font-size: 1.125rem;">Support Available</div>
            </div>
          </div>
        </section>
      `,
    })

    editor.BlockManager.add("hr-cta-section", {
      label: "Call to Action",
      category: "HR Components",
      content: `
        <section style="background: #dc2626; color: white; padding: 4rem 2rem; text-align: center; border-radius: 1rem; margin: 2rem;">
          <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">Ready to Transform Your HR?</h2>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Join hundreds of companies already using our platform</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="display: inline-block; background: white; color: #dc2626; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Start Free Trial</a>
            <a href="#" style="display: inline-block; border: 2px solid white; color: white; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Contact Sales</a>
          </div>
        </section>
      `,
    })

    editor.BlockManager.add("hr-testimonial", {
      label: "Testimonial",
      category: "HR Components",
      content: `
        <div style="background: white; border-left: 4px solid #dc2626; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p style="font-size: 1.125rem; color: #374151; line-height: 1.6; margin-bottom: 1.5rem; font-style: italic;">"This is an amazing testimonial about how great your HR services are. Clients love sharing their success stories!"</p>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 600; color: #dc2626;">JD</div>
            <div>
              <div style="font-weight: 600; color: #111827;">John Doe</div>
              <div style="color: #6b7280; font-size: 0.875rem;">CEO, Company Name</div>
            </div>
          </div>
        </div>
      `,
    })

    // Add templates as blocks
    templates.forEach((template) => {
      editor.BlockManager.add(`template-${template.id}`, {
        label: template.name,
        category: "Templates",
        content: template.html,
        attributes: { class: "template-block" },
      })
    })

    // Set initial content
    if (content) {
      editor.setComponents(content)
    }

    // Listen for changes
    editor.on("change:changesCount", () => {
      const html = editor.getHtml()
      const css = editor.getCss()
      const fullHtml = `${html}<style>${css}</style>`
      onChange(fullHtml)
    })

    editorInstanceRef.current = editor

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
        editorInstanceRef.current = null
      }
    }
  }, [])

  // Update content when prop changes (for loading saved content)
  useEffect(() => {
    if (editorInstanceRef.current && content && !editorInstanceRef.current.getComponents().length) {
      editorInstanceRef.current.setComponents(content)
    }
  }, [content])

  return (
    <div className="grapes-editor-wrapper" style={{ height: "100%" }}>
      <div ref={editorRef} style={{ height: "100%" }} />
    </div>
  )
}
