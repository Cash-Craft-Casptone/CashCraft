"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, Clock, User, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { apiGetArticles } from "@/lib/api"

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([])
  const [readArticles, setReadArticles] = useState<string[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language, isDark } = useApp()
  const t = translations[language]

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]")
    setBookmarkedArticles(savedBookmarks)
    
    const savedRead = JSON.parse(localStorage.getItem("readArticles") || "[]")
    setReadArticles(savedRead)
    
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const data = await apiGetArticles()
      setArticles(data)
    } catch (error) {
      console.error("Failed to load articles:", error)
    } finally {
      setLoading(false)
    }
  }

  // Reload read articles when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedRead = JSON.parse(localStorage.getItem("readArticles") || "[]")
        setReadArticles(savedRead)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleVisibilityChange)
    }
  }, [])

  const categories = [
    { id: "all", name: language === "ar" ? "الكل" : "All" },
    { id: "budgeting", name: language === "ar" ? "الميزانية" : "Budgeting" },
    { id: "saving", name: language === "ar" ? "الادخار" : "Saving" },
    { id: "investing", name: language === "ar" ? "الاستثمار" : "Investing" },
    { id: "credit", name: language === "ar" ? "الائتمان" : "Credit" },
    { id: "taxes", name: language === "ar" ? "الضرائب" : "Taxes" },
  ]

  const toggleBookmark = (articleId: string) => {
    const updatedBookmarks = bookmarkedArticles.includes(articleId)
      ? bookmarkedArticles.filter((id) => id !== articleId)
      : [...bookmarkedArticles, articleId]

    setBookmarkedArticles(updatedBookmarks)
    localStorage.setItem("bookmarkedArticles", JSON.stringify(updatedBookmarks))
  }

  const markAsRead = (articleId: string) => {
    if (!readArticles.includes(articleId)) {
      const updatedRead = [...readArticles, articleId]
      setReadArticles(updatedRead)
      localStorage.setItem("readArticles", JSON.stringify(updatedRead))
    }
  }

  const filteredArticles = articles.filter((article) => {
    const title = language === "ar" ? article.titleAr : article.titleEn
    const description = language === "ar" ? article.descriptionAr : article.descriptionEn
    
    const matchesSearch =
      title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description?.toLowerCase().includes(searchTerm.toLowerCase())
    // For now, show all categories since we don't have category field in DB
    const matchesCategory = selectedCategory === "all"
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#084f5a] dark:text-white mb-4">
            {t.educationalArticles}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.educationalArticlesDesc}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t.searchArticles}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => {
            const isRead = readArticles.includes(article.id)
            
            return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                isRead ? "border-2 border-green-200 dark:border-green-800" : ""
              }`}
              onClick={() => markAsRead(article.id)}
            >
              <div className="relative">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(article.id)
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  {bookmarkedArticles.includes(article.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                {isRead && (
                  <div className="absolute top-4 left-4 p-2 bg-green-500 rounded-full">
                    <BookmarkCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs">
                    {language === "ar" ? "مقال" : "Article"}
                  </span>
                  <Clock className="w-4 h-4" />
                  <span>5 min</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 flex items-center gap-2">
                  {language === "ar" ? article.titleAr : article.titleEn}
                  {isRead && <BookmarkCheck className="w-5 h-5 text-green-500 flex-shrink-0" />}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {language === "ar" ? article.descriptionAr : article.descriptionEn}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{language === "ar" ? "المؤلف" : "Author"}</span>
                  </div>

                  <Link href={`/articles/${article.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="bg-[#6099a5] hover:bg-[#084f5a] text-white">
                      {isRead ? (language === "ar" ? "إعادة القراءة" : "Read Again") : t.readMore}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            )
          })}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t.noArticlesFound}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.tryChangingSearch}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
