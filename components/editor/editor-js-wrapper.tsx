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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (!editorRef.current) {
      initEditor()
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [isMounted])

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
    const AlignmentBlockTune = (await import("editorjs-text-alignment-blocktune")).default

    class ColorPlugin {
      static get isInline() {
        return true
      }

      static get sanitize() {
        return {
          span: {
            style: true,
          },
        }
      }

      constructor({ api }: any) {
        this.api = api
        this.button = null
        this.tag = "SPAN"
        this.class = "color-plugin"
      }

      render() {
        this.button = document.createElement("button")
        this.button.type = "button"
        this.button.innerHTML = `
          <svg width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/>
          </svg>
        `
        this.button.classList.add("ce-inline-tool")

        return this.button
      }

      surround(range: Range) {
        if (!range) return

        const selectedText = range.extractContents()
        const span = document.createElement(this.tag)

        const color = prompt("Enter color (hex code like #ff0000 or color name like red):", "#000000")
        if (color) {
          span.style.color = color
          span.appendChild(selectedText)
          range.insertNode(span)

          this.api.selection.expandToTag(span)
        }
      }

      checkState() {
        const mark = this.api.selection.findParentTag(this.tag)
        if (mark) {
          this.button.classList.add("ce-inline-tool--active")
        } else {
          this.button.classList.remove("ce-inline-tool--active")
        }
      }
    }

    class HighlightPlugin {
      static get isInline() {
        return true
      }

      static get sanitize() {
        return {
          mark: {
            style: true,
          },
        }
      }

      constructor({ api }: any) {
        this.api = api
        this.button = null
        this.tag = "MARK"
      }

      render() {
        this.button = document.createElement("button")
        this.button.type = "button"
        this.button.innerHTML = `
          <svg width="20" height="18" viewBox="0 0 20 18">
            <path d="M15.5 11l2.5-2.5-6-6L9.5 5 4 10.5V17h6.5L15.5 11z"/>
          </svg>
        `
        this.button.classList.add("ce-inline-tool")

        return this.button
      }

      surround(range: Range) {
        if (!range) return

        const selectedText = range.extractContents()
        const mark = document.createElement(this.tag)

        const color = prompt("Enter background color (hex code like #ffff00 or yellow):", "#fef3c7")
        if (color) {
          mark.style.backgroundColor = color
          mark.appendChild(selectedText)
          range.insertNode(mark)

          this.api.selection.expandToTag(mark)
        }
      }

      checkState() {
        const mark = this.api.selection.findParentTag(this.tag)
        if (mark) {
          this.button.classList.add("ce-inline-tool--active")
        } else {
          this.button.classList.remove("ce-inline-tool--active")
        }
      }
    }

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
        color: ColorPlugin,
        highlight: HighlightPlugin,
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "color", "highlight", "underline"],
        },
        paragraph: {
          class: Paragraph,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "color", "highlight", "underline"],
        },
        list: {
          class: List,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "color", "highlight", "underline"],
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "color", "highlight"],
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        warning: {
          class: WarningTool,
          inlineToolbar: ["link", "bold", "italic", "color", "highlight"],
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
          inlineToolbar: ["link", "bold", "italic", "color", "highlight"],
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: ["link", "bold", "italic", "color", "highlight"],
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

  if (!isMounted) {
    return <div className="editorjs-container flex items-center justify-center py-12">Loading editor...</div>
  }

  return <div id={holder} className="editorjs-container" />
}
