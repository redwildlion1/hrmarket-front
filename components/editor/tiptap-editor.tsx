"use client"

import type React from "react"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Youtube from "@tiptap/extension-youtube"
import FontFamily from "@tiptap/extension-font-family"
import { Extension } from "@tiptap/core"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  YoutubeIcon,
  Code2,
  Palette,
  Type,
  Paintbrush,
  Settings2,
  FileCode,
} from "lucide-react"
import { useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Label } from "@/components/ui/label"

const PreserveInlineStyles = Extension.create({
  name: "preserveInlineStyles",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {}
              }
              return { style: attributes.style }
            },
          },
        },
      },
    ]
  },
})

const Div = Extension.create({
  name: "div",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: "block",

  content: "block+",

  parseHTML() {
    return [{ tag: "div" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },

  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {}
          }
          return { style: attributes.style }
        },
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {}
          }
          return { class: attributes.class }
        },
      },
    }
  },
})

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")

  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isColorOpen, setIsColorOpen] = useState(false)
  const [isHighlightOpen, setIsHighlightOpen] = useState(false)
  const [isBgColorOpen, setIsBgColorOpen] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [selectedFont, setSelectedFont] = useState("inherit")

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "w-full aspect-video rounded",
        },
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      PreserveInlineStyles,
      Div,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] [&_*]:all-revert [&_div]:block [&_p]:block [&_h1]:block [&_h2]:block [&_h3]:block",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const toggleHtmlMode = () => {
    if (!editor) return

    if (!isHtmlMode) {
      setHtmlContent(editor.getHTML())
    } else {
      editor.commands.setContent(htmlContent)
      onChange(htmlContent)
    }
    setIsHtmlMode(!isHtmlMode)
  }

  const handleHtmlChange = (value: string) => {
    setHtmlContent(value)
  }

  if (!editor) {
    return null
  }

  const handleImageUpload = async (file: File) => {
    try {
      const result = await apiClient.admin.blogs.uploadImage(file)
      editor.chain().focus().setImage({ src: result.url }).run()
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  }

  const applyAdvancedStyling = () => {
    const style = `font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}px;`
    editor.chain().focus().setMark("textStyle", { style }).run()
  }

  const colors = [
    "#000000",
    "#FFFFFF",
    "#9CA3AF",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#EAB308",
    "#84CC16",
    "#22C55E",
    "#10B981",
    "#14B8A6",
    "#06B6D4",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
  ]

  const highlights = ["#FEF3C7", "#DBEAFE", "#E0E7FF", "#FCE7F3", "#D1FAE5", "#FEE2E2", "#F3E8FF", "#FED7AA", "#FFEDD5"]

  const backgroundColors = [
    "#FFFFFF",
    "#F9FAFB",
    "#F3F4F6",
    "#E5E7EB",
    "#FEF2F2",
    "#FEF3C7",
    "#DBEAFE",
    "#EDE9FE",
    "#FCE7F3",
    "#D1FAE5",
  ]

  const fonts = [
    { value: "inherit", label: "Default" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Courier New", label: "Courier New" },
    { value: "Verdana", label: "Verdana" },
    { value: "Comic Sans MS", label: "Comic Sans" },
    { value: "Impact", label: "Impact" },
    { value: "Trebuchet MS", label: "Trebuchet" },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        {/* HTML mode toggle button */}
        <Button variant={isHtmlMode ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={toggleHtmlMode}>
          <FileCode className="h-4 w-4 mr-2" />
          HTML
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {!isHtmlMode && (
          <>
            {/* Text Formatting */}
            <MenuButton editor={editor} action="toggleBold" icon={<Bold className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleItalic" icon={<Italic className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleUnderline" icon={<UnderlineIcon className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleStrike" icon={<Strikethrough className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleCode" icon={<Code className="h-4 w-4" />} />

            <div className="w-px h-6 bg-border mx-1" />

            {/* Headings */}
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              icon={<Heading1 className="h-4 w-4" />}
              isActive={editor.isActive("heading", { level: 1 })}
            />
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              icon={<Heading2 className="h-4 w-4" />}
              isActive={editor.isActive("heading", { level: 2 })}
            />
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              icon={<Heading3 className="h-4 w-4" />}
              isActive={editor.isActive("heading", { level: 3 })}
            />

            <div className="w-px h-6 bg-border mx-1" />

            {/* Lists */}
            <MenuButton editor={editor} action="toggleBulletList" icon={<List className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleOrderedList" icon={<ListOrdered className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleBlockquote" icon={<Quote className="h-4 w-4" />} />
            <MenuButton editor={editor} action="toggleCodeBlock" icon={<Code2 className="h-4 w-4" />} />

            <div className="w-px h-6 bg-border mx-1" />

            {/* Alignment */}
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign("left").run()}
              icon={<AlignLeft className="h-4 w-4" />}
              isActive={editor.isActive({ textAlign: "left" })}
            />
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign("center").run()}
              icon={<AlignCenter className="h-4 w-4" />}
              isActive={editor.isActive({ textAlign: "center" })}
            />
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign("right").run()}
              icon={<AlignRight className="h-4 w-4" />}
              isActive={editor.isActive({ textAlign: "right" })}
            />
            <MenuButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign("justify").run()}
              icon={<AlignJustify className="h-4 w-4" />}
              isActive={editor.isActive({ textAlign: "justify" })}
            />

            <div className="w-px h-6 bg-border mx-1" />

            <Select
              value={selectedFont}
              onValueChange={(value) => {
                setSelectedFont(value)
                editor.chain().focus().setFontFamily(value).run()
              }}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <Type className="h-3 w-3 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Color */}
            <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Text Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run()
                          setIsColorOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={isBgColorOpen} onOpenChange={setIsBgColorOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paintbrush className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Background Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .setMark("textStyle", { style: `background-color: ${color}` })
                            .run()
                          setIsBgColorOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Highlight */}
            <Popover open={isHighlightOpen} onOpenChange={setIsHighlightOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Highlighter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Highlight</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {highlights.map((color) => (
                      <button
                        key={color}
                        className="w-12 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor.chain().focus().toggleHighlight({ color }).run()
                          setIsHighlightOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-border mx-1" />

            <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={10} max={72} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Line Height: {lineHeight}</Label>
                    <Slider
                      value={[lineHeight]}
                      onValueChange={([val]) => setLineHeight(val)}
                      min={1}
                      max={3}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Letter Spacing: {letterSpacing}px</Label>
                    <Slider
                      value={[letterSpacing]}
                      onValueChange={([val]) => setLetterSpacing(val)}
                      min={-2}
                      max={10}
                      step={0.5}
                    />
                  </div>
                  <Button size="sm" onClick={applyAdvancedStyling} className="w-full">
                    Apply Styling
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Link */}
            <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        editor.chain().focus().setLink({ href: linkUrl }).run()
                        setLinkUrl("")
                        setIsLinkOpen(false)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      editor.chain().focus().setLink({ href: linkUrl }).run()
                      setLinkUrl("")
                      setIsLinkOpen(false)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Image */}
            <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        editor.chain().focus().setImage({ src: imageUrl }).run()
                        setImageUrl("")
                        setIsImageOpen(false)
                      }
                    }}
                  />
                  <div className="text-center text-sm text-muted-foreground">or</div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file)
                        setIsImageOpen(false)
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* YouTube */}
            <Popover open={isYoutubeOpen} onOpenChange={setIsYoutubeOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <YoutubeIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2">
                  <Input
                    placeholder="YouTube URL"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        editor.commands.setYoutubeVideo({ src: youtubeUrl })
                        setYoutubeUrl("")
                        setIsYoutubeOpen(false)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      editor.commands.setYoutubeVideo({ src: youtubeUrl })
                      setYoutubeUrl("")
                      setIsYoutubeOpen(false)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Undo/Redo */}
            <MenuButton
              editor={editor}
              action="undo"
              icon={<Undo className="h-4 w-4" />}
              disabled={!editor.can().undo()}
            />
            <MenuButton
              editor={editor}
              action="redo"
              icon={<Redo className="h-4 w-4" />}
              disabled={!editor.can().redo()}
            />
          </>
        )}
      </div>

      {/* Editor Content */}
      <div className="p-4">
        {isHtmlMode ? (
          <Textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="min-h-[500px] font-mono text-sm"
            placeholder="Edit HTML directly..."
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  )
}

interface MenuButtonProps {
  editor: Editor
  action: string | (() => void)
  icon: React.ReactNode
  isActive?: boolean
  disabled?: boolean
}

function MenuButton({ editor, action, icon, isActive, disabled }: MenuButtonProps) {
  const handleClick = () => {
    if (typeof action === "string") {
      // @ts-ignore
      editor.chain().focus()[action]().run()
    } else {
      action()
    }
  }

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className="h-8 w-8 p-0"
      onClick={handleClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  )
}
