"use client"

// Temporary simple textarea component to replace tiptap-based RichTextEditor
// This avoids build issues with @tiptap packages on Vercel

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Start writing...'}
      className="w-full min-h-[500px] p-4 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-900 dark:text-white resize-y"
    />
  )
}
