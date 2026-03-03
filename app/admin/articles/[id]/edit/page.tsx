"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useApp } from "@/contexts/AppContext"
import SimpleTextEditor from "@/components/SimpleTextEditor"
import {
  apiGetArticles,
  apiUpdateArticle,
  getAuthToken,
} from "@/lib/api"

export default function ArticleEditorPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useApp()
  const articleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState<any>(null)
  const [imagePreviewError, setImagePreviewError] = useState(false)
  const [formData, setFormData] = useState({
    slug: "",
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    coverUrl: "",
    bodyEn: "",
    bodyAr: "",
  })

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const articles = await apiGetArticles()
      const found = articles.find((a: any) => a.id === articleId)
      
      if (!found) {
        toast({ title: "Article not found", variant: "destructive" })
        router.push("/admin/articles")
        return
      }

      setArticle(found)
      setFormData({
        slug: found.slug,
        titleEn: found.titleEn,
        titleAr: found.titleAr,
        descriptionEn: found.descriptionEn || "",
        descriptionAr: found.descriptionAr || "",
        coverUrl: found.coverUrl || "",
        bodyEn: found.bodyEn || "",
        bodyAr: found.bodyAr || "",
      })
    } catch (error) {
      console.error("Failed to load article:", error)
      toast({ title: "Failed to load article", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getAuthToken()
      await apiUpdateArticle(articleId, formData, token!)
      toast({ title: "Article saved successfully" })
      router.push("/admin/articles")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/articles")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Article
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save & Publish"}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-emerald-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Article Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title (English)</Label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                />
              </div>
              <div>
                <Label>Title (Arabic)</Label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={formData.coverUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, coverUrl: e.target.value })
                    setImagePreviewError(false)
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {formData.coverUrl && (
                  <div className="mt-3">
                    {!imagePreviewError ? (
                      <div className="relative">
                        <img
                          src={formData.coverUrl}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-emerald-300"
                          onError={() => setImagePreviewError(true)}
                          crossOrigin="anonymous"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-lg">
                          ✓ Image loaded successfully
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <p className="text-red-600 dark:text-red-400 font-medium mb-2">✗ Failed to load image</p>
                          <p className="text-sm text-red-500">
                            The image URL may be incorrect or the image may be protected by CORS policy.
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Try using images from: Unsplash, Pexels, or upload to a CDN
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* English Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-emerald-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Content (English)
            </h2>
            <SimpleTextEditor
              content={formData.bodyEn}
              onChange={(content) => setFormData({ ...formData, bodyEn: content })}
              placeholder="Write your article content in English..."
            />
          </div>

          {/* Arabic Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-emerald-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Content (Arabic)
            </h2>
            <SimpleTextEditor
              content={formData.bodyAr}
              onChange={(content) => setFormData({ ...formData, bodyAr: content })}
              placeholder="اكتب محتوى المقال بالعربية..."
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
