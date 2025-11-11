"use client"

import { useEffect, useRef, useState } from "react"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
import { apiClient } from "@/lib/api/client"

interface EditorJSWrapperProps {
  data?: OutputData
  onChange?: (data: OutputData) => void
  holder: string
}

export function EditorJSWrapper({ data, onChange, holder }: EditorJSWrapperProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!editorRef.current) {
      initEditor()
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  const initEditor = async () => {
    const Header = (await import("@editorjs/header")).default
    const List = (await import("@editorjs/list")).default
    const Quote = (await import("@editorjs/quote")).default
    const Code = (await import("@editorjs/code")).default
    const Checklist = (await import("@editorjs/checklist")).default
    const Delimiter = (await import("@editorjs/delimiter")).default
    const Table = (await import("@editorjs/table")).default
    const Embed = (await import("@editorjs/embed")).default
    const LinkTool = (await import("@editorjs/link")).default
    const ImageTool = (await import("@editorjs/image")).default
    const Paragraph = (await import("@editorjs/paragraph")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const Marker = (await import("@editorjs/marker")).default
    const Underline = (await import("@editorjs/underline")).default
    const WarningTool = (await import("@editorjs/warning")).default
    const ColorPlugin = (await import("editorjs-text-color-plugin")).default
    const AlignmentBlockTune = (await import("editorjs-text-alignment-blocktune")).default
    const FontSize = (await import("editorjs-inline-font-size-tool")).default

    class RawHTMLTool {
      static get toolbox() {
        return {
          title: "Raw HTML",
          icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3.5 5L1.5 10L3.5 15M16.5 5L18.5 10L16.5 15M11.5 3L8.5 17"/></svg>',
        }
      }

      constructor({ data }: { data: { html: string } }) {
        this.data = data
        this.wrapper = null
      }

      render() {
        this.wrapper = document.createElement("div")
        this.wrapper.classList.add("raw-html-block")

        const input = document.createElement("textarea")
        input.classList.add("raw-html-input")
        input.placeholder = "Enter HTML code here..."
        input.value = this.data.html || ""
        input.style.cssText =
          "width: 100%; min-height: 150px; padding: 12px; font-family: monospace; font-size: 14px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; resize: vertical;"

        const preview = document.createElement("div")
        preview.classList.add("raw-html-preview")
        preview.style.cssText =
          "padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; min-height: 100px;"

        const updatePreview = () => {
          try {
            preview.innerHTML = input.value
          } catch (e) {
            preview.textContent = "Invalid HTML"
          }
        }

        input.addEventListener("input", () => {
          this.data.html = input.value
          updatePreview()
        })

        updatePreview()

        this.wrapper.appendChild(input)

        const previewLabel = document.createElement("div")
        previewLabel.textContent = "Preview:"
        previewLabel.style.cssText = "font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #64748b;"
        this.wrapper.appendChild(previewLabel)

        this.wrapper.appendChild(preview)

        return this.wrapper
      }

      save() {
        return {
          html: this.data.html,
        }
      }
    }

    const editor = new EditorJS({
      holder,
      data: data || undefined,
      placeholder: "Start writing your blog post...",
      tools: {
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#000000",
              "#374151",
              "#6b7280",
              "#9ca3af",
              "#ffffff",
              "#dc2626",
              "#ef4444",
              "#ea580c",
              "#f97316",
              "#f59e0b",
              "#fbbf24",
              "#facc15",
              "#84cc16",
              "#22c55e",
              "#10b981",
              "#14b8a6",
              "#06b6d4",
              "#0ea5e9",
              "#3b82f6",
              "#6366f1",
              "#8b5cf6",
              "#a855f7",
              "#d946ef",
              "#ec4899",
              "#f43f5e",
            ],
            defaultColor: "#000000",
            type: "text",
            customPicker: true,
          },
        },
        Marker: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#fef3c7",
              "#fecaca",
              "#fed7aa",
              "#fef9c3",
              "#d9f99d",
              "#bbf7d0",
              "#a7f3d0",
              "#99f6e4",
              "#bfdbfe",
              "#c7d2fe",
              "#ddd6fe",
              "#e9d5ff",
              "#f5d0fe",
              "#fbcfe8",
              "#fecdd3",
            ],
            defaultColor: "#fef3c7",
            type: "marker",
          },
        },
        fontSize: {
          class: FontSize,
          config: {
            sizeOptions: [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48],
            defaultSize: 16,
          },
        },
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "Color", "Marker", "underline", "fontSize"],
        },
        paragraph: {
          class: Paragraph,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "Color", "Marker", "underline", "fontSize"],
        },
        list: {
          class: List,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "Color", "Marker", "underline"],
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "Color", "Marker"],
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        warning: {
          class: WarningTool,
          inlineToolbar: ["link", "bold", "italic", "Color", "Marker"],
          config: {
            titlePlaceholder: "Title",
            messagePlaceholder: "Message",
          },
        },
        code: {
          class: Code,
          config: {
            placeholder: "Enter code",
          },
        },
        raw: RawHTMLTool,
        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+M",
        },
        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+H",
        },
        underline: {
          class: Underline,
          shortcut: "CMD+U",
        },
        checklist: {
          class: Checklist,
          inlineToolbar: ["link", "bold", "italic", "Color", "Marker"],
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: ["link", "bold", "italic", "Color", "Marker"],
          config: {
            rows: 2,
            cols: 3,
          },
        },
        alignment: {
          class: AlignmentBlockTune,
          config: {
            default: "left",
            blocks: {
              header: "left",
              paragraph: "left",
              list: "left",
              quote: "left",
            },
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              twitter: true,
              instagram: true,
              facebook: true,
              codepen: true,
            },
          },
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/fetch-url",
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                try {
                  const result = await apiClient.admin.blogs.uploadImage(file)
                  return {
                    success: 1,
                    file: {
                      url: result.url,
                    },
                  }
                } catch (error) {
                  console.error("[v0] Image upload error:", error)
                  return {
                    success: 0,
                    file: {
                      url: "",
                    },
                  }
                }
              },
              uploadByUrl: async (url: string) => {
                return {
                  success: 1,
                  file: {
                    url: url,
                  },
                }
              },
            },
          },
        },
      },
      onChange: async () => {
        if (editorRef.current && onChange) {
          const outputData = await editorRef.current.save()
          onChange(outputData)
        }
      },
      onReady: () => {
        setIsReady(true)
      },
    })

    editorRef.current = editor
  }

  return <div id={holder} className="editorjs-container" />
}
