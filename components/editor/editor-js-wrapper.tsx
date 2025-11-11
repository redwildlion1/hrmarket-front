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
    const Paragraph = (await import("@editorjs/paragraph")).default
    const List = (await import("@editorjs/list")).default
    const Quote = (await import("@editorjs/quote")).default
    const Code = (await import("@editorjs/code")).default
    const Checklist = (await import("@editorjs/checklist")).default
    const Delimiter = (await import("@editorjs/delimiter")).default
    const Table = (await import("@editorjs/table")).default
    const Embed = (await import("@editorjs/embed")).default
    const LinkTool = (await import("@editorjs/link")).default
    const ImageTool = (await import("@editorjs/image")).default
    const SimpleImage = (await import("@editorjs/simple-image")).default
    const WarningTool = (await import("@editorjs/warning")).default

    // Inline tools
    const InlineCode = (await import("@editorjs/inline-code")).default
    const Marker = (await import("@editorjs/marker")).default
    const Underline = (await import("@editorjs/underline")).default
    const Bold = (await import("@editorjs/bold")).default
    const Italic = (await import("@editorjs/italic")).default

    // Advanced tools
    const AlignmentBlockTune = (await import("editorjs-alignment-blocktune")).default
    const ColorPlugin = (await import("editorjs-text-color-plugin")).default
    const BackgroundColorPlugin = (await import("editorjs-text-background-color-plugin")).default
    const Button = (await import("editorjs-button")).default
    const Carousel = (await import("editorjs-carousel")).default
    const Columns = (await import("@calumk/editorjs-columns")).default

    const editor = new EditorJS({
      holder,
      data: data || undefined,
      placeholder: "Start writing your blog post...",
      tools: {
        // Inline formatting tools
        bold: Bold,
        italic: Italic,
        underline: Underline,
        inlineCode: InlineCode,
        marker: Marker,
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#EC7878",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#0070FF",
              "#03A9F4",
              "#00BCD4",
              "#4CAF50",
              "#8BC34A",
              "#CDDC39",
              "#FFF",
            ],
            defaultColor: "#000000",
            type: "text",
            customPicker: true,
          },
        },
        Marker: {
          class: BackgroundColorPlugin,
          config: {
            defaultColor: "#FFBF00",
            type: "marker",
            colorCollections: ["#FFBF00", "#FEF3C7", "#DBEAFE", "#E0E7FF", "#FCE7F3", "#D1FAE5", "#FEE2E2", "#F3E8FF"],
            customPicker: true,
          },
        },

        // Block tools with comprehensive inline toolbars
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "underline", "inlineCode", "Color", "Marker"],
        },
        paragraph: {
          class: Paragraph,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "underline", "inlineCode", "Color", "Marker"],
        },
        list: {
          class: List,
          tunes: ["alignment"],
          inlineToolbar: ["link", "bold", "italic", "underline", "Color", "Marker"],
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

        // Media and layout tools
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
                  console.error("Image upload error:", error)
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
        simpleImage: SimpleImage,
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
        button: {
          class: Button,
          inlineToolbar: false,
          config: {
            css: {
              btnColor: "btn--gray",
            },
          },
        },
        carousel: Carousel,
        columns: {
          class: Columns,
          config: {
            EditorJsLibrary: EditorJS,
            tools: {
              header: Header,
              paragraph: Paragraph,
              list: List,
              quote: Quote,
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
                        return {
                          success: 0,
                          file: {
                            url: "",
                          },
                        }
                      }
                    },
                  },
                },
              },
            },
          },
        },

        // Alignment tune for all applicable blocks
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
