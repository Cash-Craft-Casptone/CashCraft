"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Play, User, BookmarkCheck, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { apiGetVideos } from "@/lib/api"

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useApp()
  const t = translations[language]

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedVideos") || "[]")
    setBookmarkedVideos(savedBookmarks)
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const data = await apiGetVideos()
      setVideos(data)
    } catch (error) {
      console.error("Failed to load videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: "all", name: language === "ar" ? "الكل" : "All" },
    { id: "budgeting", name: language === "ar" ? "الميزانية" : "Budgeting" },
    { id: "saving", name: language === "ar" ? "الادخار" : "Saving" },
    { id: "investing", name: language === "ar" ? "الاستثمار" : "Investing" },
    { id: "credit", name: language === "ar" ? "الائتمان" : "Credit" },
  ]

  const toggleBookmark = (videoId: string) => {
    const updatedBookmarks = bookmarkedVideos.includes(videoId)
      ? bookmarkedVideos.filter((id) => id !== videoId)
      : [...bookmarkedVideos, videoId]

    setBookmarkedVideos(updatedBookmarks)
    localStorage.setItem("bookmarkedVideos", JSON.stringify(updatedBookmarks))
  }

  const filteredVideos = videos.filter((video) => {
    const title = language === "ar" ? video.titleAr : video.titleEn
    const description = language === "ar" ? video.descriptionAr : video.descriptionEn
    const matchesSearch =
      title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#084f5a] dark:text-white mb-4">
            {t.educationalVideos}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.educationalVideosDesc}
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
                placeholder={t.searchVideos}
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative group">
                {video.thumbnailUrl || video.coverUrl ? (
                  <img
                    src={video.thumbnailUrl || video.coverUrl}
                    alt={language === "ar" ? video.titleAr : video.titleEn}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }}
                  />
                ) : null}
                <div className={`w-full h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-teal-600 flex items-center justify-center ${(video.thumbnailUrl || video.coverUrl) ? 'hidden' : ''}`}>
                  <Play className="w-16 h-16 text-white opacity-60" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                {video.durationSec && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {Math.floor(video.durationSec / 60)}:{String(video.durationSec % 60).padStart(2, '0')}
                  </div>
                )}
                <button
                  onClick={() => toggleBookmark(video.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  {bookmarkedVideos.includes(video.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs">
                    {language === "ar" ? "فيديو" : "Video"}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {language === "ar" ? video.titleAr : video.titleEn}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {language === "ar" ? video.descriptionAr : video.descriptionEn}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{language === "ar" ? "المؤلف" : "Author"}</span>
                  </div>

                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-[#6099a5] hover:bg-[#084f5a] text-white">
                      {t.watch}
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
