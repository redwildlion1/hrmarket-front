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
    const RawTool = (await import("@editorjs/raw")).default

    const editor = new EditorJS({
      holder,
      data: data || undefined,
      placeholder: "Start writing your blog post...",
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "marker", "underline"],
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "marker", "underline"],
        },
        list: {
          class: List,
          inlineToolbar: ["link", "bold", "italic", "inlineCode", "marker", "underline"],
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: ["link", "bold", "italic"],
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        warning: {
          class: WarningTool,
          inlineToolbar: ["link", "bold", "italic"],
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
        raw: {
          class: RawTool,
          config: {
            placeholder: "Enter raw HTML",
          },
        },
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
          inlineToolbar: ["link", "bold", "italic"],
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: ["link", "bold", "italic"],
          config: {
            rows: 2,
            cols: 3,
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
