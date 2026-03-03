"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, Clock, User, Edit, Trash2, PlusCircle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  apiGetArticles,
  apiCreateArticle,
  apiUpdateArticle,
  apiDeleteArticle,
  getAuthToken,
} from "@/lib/api"

export default function AdminArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [articles, setArticles] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)
  const { language, currentUser } = useApp()
  const { toast } = useToast()
  const router = useRouter()
  const t = translations[language]

  const isAllowed = currentUser && (currentUser.role?.toLowerCase() === "admin" || currentUser.role?.toLowerCase() === "editor")

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login")
      return
    }
    if (!isAllowed) {
      router.replace("/dashboard")
      return
    }
    loadArticles()
  }, [currentUser, isAllowed, router])

  const loadArticles = async () => {
    try {
      const data = await apiGetArticles()
      setArticles(data)
    } catch (error) {
      console.error("Failed to load articles:", error)
    }
  }

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

  const resetForm = () => {
    setFormData({
      slug: "",
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      coverUrl: "",
      bodyEn: "",
      bodyAr: "",
    })
    setShowCreate(false)
    setEditingArticle(null)
    setImagePreviewError(false)
  }

  const handleCreate = async () => {
    if (!formData.slug || !formData.titleEn || !formData.titleAr) {
      toast({ title: "Error", description: "Slug and titles are required", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      const token = getAuthToken()
      await apiCreateArticle(formData, token!)
      toast({ title: "Article created successfully" })
      resetForm()
      loadArticles()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingArticle) return
    try {
      setLoading(true)
      const token = getAuthToken()
      await apiUpdateArticle(editingArticle.id, formData, token!)
      toast({ title: "Article updated successfully" })
      resetForm()
      loadArticles()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      const token = getAuthToken()
      await apiDeleteArticle(id, token!)
      toast({ title: "Article deleted successfully" })
      loadArticles()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const startEdit = (article: any) => {
    setFormData({
      slug: article.slug,
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      descriptionEn: article.descriptionEn || "",
      descriptionAr: article.descriptionAr || "",
      coverUrl: article.coverUrl || "",
      bodyEn: article.bodyEn || "",
      bodyAr: article.bodyAr || "",
    })
    setEditingArticle(article)
    setShowCreate(true)
  }

  const filteredArticles = articles.filter((article) =>
    article.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.titleAr.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAllowed) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Manage Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create, edit, and manage educational articles
          </p>
        </motion.div>

        {/* Search and Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500"
            />
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        </motion.div>

        {/* Create/Edit Form */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
                <CardTitle className="flex items-center justify-between">
                  <span>{editingArticle ? "Edit Article" : "Create New Article"}</span>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="emergency-fund-basics"
                    />
                  </div>
                  <div>
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
                      <div className="mt-2">
                        {!imagePreviewError ? (
                          <div className="relative">
                            <img
                              src={formData.coverUrl}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border-2 border-emerald-200"
                              onError={() => setImagePreviewError(true)}
                              crossOrigin="anonymous"
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              ✓ Image loaded
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 rounded-lg flex items-center justify-center">
                            <div className="text-center p-4">
                              <p className="text-red-600 dark:text-red-400 text-sm font-medium">✗ Image failed to load</p>
                              <p className="text-xs text-red-500 mt-1">Check if URL is correct or try a different image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Title (English) *</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Title (Arabic) *</Label>
                    <Input
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      rows={2}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description (Arabic)</Label>
                    <Textarea
                      rows={2}
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    />
                  </div>
                </div>

                {/* Body Content - Only show in edit mode */}
                {editingArticle && (
                  <div className="space-y-4 border-t-2 border-emerald-200 pt-4">
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Article Content</h3>
                    <div>
                      <Label>Body Content (English)</Label>
                      <Textarea
                        rows={10}
                        value={formData.bodyEn}
                        onChange={(e) => setFormData({ ...formData, bodyEn: e.target.value })}
                        placeholder="Write your article content here... You can use markdown for formatting."
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Use **bold**, *italic*, # Heading, - List items
                      </p>
                    </div>
                    <div>
                      <Label>Body Content (Arabic)</Label>
                      <Textarea
                        rows={10}
                        value={formData.bodyAr}
                        onChange={(e) => setFormData({ ...formData, bodyAr: e.target.value })}
                        placeholder="اكتب محتوى المقال هنا..."
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                )}

                {!editingArticle && (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    <p className="font-semibold">Article will be created as <span className="text-red-600">PRIVATE</span></p>
                    <p className="text-sm">Click Edit after creation to add content and publish</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={editingArticle ? handleUpdate : handleCreate}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingArticle ? "Update & Publish" : "Create"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-emerald-100 dark:border-emerald-900"
            >
              <div className="relative">
                {article.coverUrl && (
                  <img
                    src={article.coverUrl}
                    alt={article.titleEn}
                    className="w-full h-48 object-cover"
                  />
                )}
                {!article.coverUrl && (
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {language === "ar" ? article.titleAr : article.titleEn}
                  </h3>
                  {article.publishedAt ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap">
                      ✓ Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap">
                      🔒 Private
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {language === "ar" ? article.descriptionAr : article.descriptionEn}
                </p>

                {/* Author and Read Time */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{currentUser?.displayName || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {(() => {
                        const wordCount = (article.bodyEn || "").split(/\s+/).filter(Boolean).length
                        const readTime = Math.max(1, Math.ceil(wordCount / 200))
                        return `${readTime} min read`
                      })()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(article.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your first article to get started
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
