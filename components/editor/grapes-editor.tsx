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

    console.log("[v0] Initializing GrapesJS editor with", templates?.length || 0, "templates")

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: "100%",
      width: "auto",
      storageManager: false,
      avoidInlineStyle: false,
      protectedCss: '',
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        [gjsPresetWebpage as any]: {
          blocksBasicOpts: {
            blocks: ["column1", "column2", "column3", "column3-7", "text", "link", "image"],
            flexGrid: 1,
          },
          blocks: ["link-block", "quote", "text-basic"],
        },
      },
      deviceManager: {
        devices: [
          {
            id: "desktop",
            name: "Desktop",
            width: "100%",
          },
          {
            id: "tablet",
            name: "Tablet",
            width: "768px",
            widthMedia: "768px",
          },
          {
            id: "mobile",
            name: "Mobile",
            width: "375px",
            widthMedia: "375px",
          },
        ],
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        ],
        scripts: [],
      },
      cssComposer: {
        rules: []
      },
      styleManager: {
        sectors: [
          {
            name: "General",
            open: true,
            properties: [
              {
                type: "color",
                property: "background-color",
              },
              {
                type: "color",
                property: "color",
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
              "text-decoration",
              "text-transform",
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
              "display",
            ],
          },
          {
            name: "Flexbox",
            open: false,
            properties: [
              "flex-direction",
              "justify-content",
              "align-items",
              "flex-wrap",
              "gap",
              "align-content",
            ],
          },
          {
            name: "Position",
            open: false,
            properties: [
              "position",
              "top",
              "right",
              "bottom",
              "left",
              "z-index",
            ],
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: "basic-actions",
            el: ".panel__basic-actions",
            buttons: [
              {
                id: "visibility",
                active: true,
                className: "btn-toggle-borders",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/></svg>',
                command: "sw-visibility",
                attributes: { title: "Toggle Borders" },
              },
              {
                id: "preview",
                className: "btn-preview",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5Z"/></svg>',
                command: "preview",
                attributes: { title: "Preview" },
              },
              {
                id: "fullscreen",
                className: "btn-fullscreen",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>',
                command: "fullscreen",
                attributes: { title: "Fullscreen" },
              },
              {
                id: "undo",
                className: "btn-undo",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"/></svg>',
                command: "undo",
                attributes: { title: "Undo" },
              },
              {
                id: "redo",
                className: "btn-redo",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"/></svg>',
                command: "redo",
                attributes: { title: "Redo" },
              },
            ],
          },
          {
            id: "devices",
            el: ".panel__devices",
            buttons: [
              {
                id: "device-desktop",
                className: "btn-desktop",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/></svg>',
                command: "set-device-desktop",
                active: true,
                attributes: { title: "Desktop" },
              },
              {
                id: "device-tablet",
                className: "btn-tablet",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z"/></svg>',
                command: "set-device-tablet",
                attributes: { title: "Tablet (768px)" },
              },
              {
                id: "device-mobile",
                className: "btn-mobile",
                label: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/></svg>',
                command: "set-device-mobile",
                attributes: { title: "Mobile (375px)" },
              },
            ],
          },
        ],
      },
    })

    editor.Commands.add("set-device-desktop", {
      run: (editor) => editor.setDevice("desktop"),
    })
    editor.Commands.add("set-device-tablet", {
      run: (editor) => editor.setDevice("tablet"),
    })
    editor.Commands.add("set-device-mobile", {
      run: (editor) => editor.setDevice("mobile"),
    })

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

    if (templates && Array.isArray(templates)) {
      console.log("[v0] Loading", templates.length, "templates into editor")
      templates.forEach((template) => {
        try {
          editor.BlockManager.add(`template-${template.id}`, {
            label: template.name,
            category: "Templates",
            content: template.html,
            attributes: { class: "template-block" },
          })
        } catch (error) {
          console.error(`[v0] Error adding template ${template.id}:`, error)
        }
      })
    }

    if (content) {
      editor.setComponents(content)
      console.log("[v0] Loaded content with", editor.getComponents().length, "components")
    }

    editor.on("change:changesCount", () => {
      const html = editor.getHtml()
      const css = editor.getCss()
      
      // Combine CSS and HTML into a complete document
      const fullHtml = css ? `<style>${css}</style>\n${html}` : html
      
      console.log("[v0] ==> Content changed")
      console.log("[v0] ==> HTML:", html.substring(0, 200))
      console.log("[v0] ==> CSS:", css.substring(0, 500))
      console.log("[v0] ==> Combined length:", fullHtml.length)
      console.log("[v0] ==> Combined start:", fullHtml.substring(0, 300))
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

  useEffect(() => {
    if (editorInstanceRef.current && content && !editorInstanceRef.current.getComponents().length) {
      editorInstanceRef.current.setComponents(content)
    }
  }, [content])

  return (
    <div className="grapes-editor-wrapper">
      <div className="panel__top">
        <div className="panel__basic-actions"></div>
        <div className="panel__devices"></div>
      </div>
      <div className="editor-row">
        <div className="editor-canvas">
          <div ref={editorRef} />
        </div>
      </div>
    </div>
  )
}
