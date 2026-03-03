"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, User, BookmarkCheck, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { Navbar } from "@/components/Navbar"
import { apiGetArticles } from "@/lib/api"

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useApp()
  const articleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<any>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    loadArticle()
    checkBookmark()
    markAsRead()
  }, [articleId])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const articles = await apiGetArticles()
      const found = articles.find((a: any) => a.id === articleId)
      
      if (!found) {
        setArticle(null)
        return
      }

      setArticle(found)
    } catch (error) {
      console.error("Failed to load article:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]")
    setBookmarked(bookmarks.includes(articleId))
  }

  const markAsRead = () => {
    const read = JSON.parse(localStorage.getItem("readArticles") || "[]")
    if (!read.includes(articleId)) {
      read.push(articleId)
      localStorage.setItem("readArticles", JSON.stringify(read))
    }
  }

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]")
    if (bookmarked) {
      const updated = bookmarks.filter((id: string) => id !== articleId)
      localStorage.setItem("bookmarkedArticles", JSON.stringify(updated))
      setBookmarked(false)
    } else {
      bookmarks.push(articleId)
      localStorage.setItem("bookmarkedArticles", JSON.stringify(bookmarks))
      setBookmarked(true)
    }
  }

  const calculateReadTime = (text: string) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <Button onClick={() => router.push("/articles")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const title = language === "ar" ? article.titleAr : article.titleEn
  const description = language === "ar" ? article.descriptionAr : article.descriptionEn
  const body = language === "ar" ? article.bodyAr : article.bodyEn
  const readTime = calculateReadTime(body || "")

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/articles")}
            className="text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "ar" ? "العودة للمقالات" : "Back to Articles"}
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {article.coverUrl && !imageError && (
            <img
              src={article.coverUrl}
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
            />
          )}
          
          {imageError && article.coverUrl && (
            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {language === "ar" ? "تعذر تحميل الصورة" : "Image could not be loaded"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === "ar" ? "قد تكون الصورة محمية أو غير متاحة" : "The image may be protected or unavailable"}
                </p>
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{language === "ar" ? "المؤلف" : "Author"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{readTime} {language === "ar" ? "دقيقة" : "min read"}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleBookmark}
              className="border-teal-500 text-teal-600 hover:bg-teal-50"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                  {language === "ar" ? "محفوظ" : "Bookmarked"}
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  {language === "ar" ? "حفظ" : "Bookmark"}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: body || description || "" }}
          />
        </motion.div>
      </div>
    </div>
  )
}
