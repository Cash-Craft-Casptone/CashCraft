"use client"

interface SimpleTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function SimpleTextEditor({ content, onChange, placeholder }: SimpleTextEditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Start writing...'}
      className="w-full min-h-[500px] p-4 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-900 dark:text-white resize-y"
    />
  )
}
