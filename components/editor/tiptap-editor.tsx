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
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
} from "lucide-react"
import { useState } from "react"
import { apiClient } from "@/lib/api/client"

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isColorOpen, setIsColorOpen] = useState(false)
  const [isHighlightOpen, setIsHighlightOpen] = useState(false)

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
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[500px] max-w-none",
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

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
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

        {/* Color */}
        <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
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
        <MenuButton editor={editor} action="undo" icon={<Undo className="h-4 w-4" />} disabled={!editor.can().undo()} />
        <MenuButton editor={editor} action="redo" icon={<Redo className="h-4 w-4" />} disabled={!editor.can().redo()} />
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
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
