"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { Extension } from '@tiptap/core'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, Type, Palette } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your article...',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
  })

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ]

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']
  
  const fonts = [
    { name: 'Default', value: 'inherit' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
  ]

  if (!editor) {
    return null
  }

  return (
    <div className="border-2 border-emerald-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b-2 border-emerald-200 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Font Family Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => {
              if (e.target.value === 'inherit') {
                editor.chain().focus().unsetFontFamily().run()
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run()
              }
            }}
            className="h-8 px-2 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Font Family"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setShowFontSize(!showFontSize)
              setShowColorPicker(false)
            }}
            className="h-8 px-2"
            title="Font Size"
          >
            <Type className="w-4 h-4 mr-1" />
            <span className="text-xs">Size</span>
          </Button>
          {showFontSize && (
            <div className="absolute top-10 left-0 z-50 bg-white dark:bg-gray-800 border-2 border-emerald-200 rounded-lg shadow-xl p-2 grid grid-cols-3 gap-1 min-w-[200px]">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontSize(size).run()
                    setShowFontSize(false)
                  }}
                  className="px-2 py-1.5 text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded font-medium text-gray-700 dark:text-gray-300"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setShowColorPicker(!showColorPicker)
              setShowFontSize(false)
            }}
            className="h-8 px-2"
            title="Text Color"
          >
            <Palette className="w-4 h-4 mr-1" />
            <span className="text-xs">Color</span>
          </Button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 z-50 bg-white dark:bg-gray-800 border-2 border-emerald-200 rounded-lg shadow-xl p-3 min-w-[180px]">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                    className="w-9 h-9 rounded-md border-2 border-gray-300 hover:border-emerald-500 hover:scale-110 transition-all shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setShowColorPicker(false)
                }}
                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-medium transition-colors"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white dark:bg-gray-800" />
    </div>
  )
}
