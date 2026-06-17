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
    setBookmarkedVideos(JSON.parse(localStorage.getItem("bookmarkedVideos") || "[]"))
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try { setLoading(true); setVideos(await apiGetVideos()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const categories = [
    { id: "all", name: language === "ar" ? "الكل" : "All" },
    { id: "budgeting", name: language === "ar" ? "الميزانية" : "Budgeting" },
    { id: "saving", name: language === "ar" ? "الادخار" : "Saving" },
    { id: "investing", name: language === "ar" ? "الاستثمار" : "Investing" },
    { id: "credit", name: language === "ar" ? "الائتمان" : "Credit" },
  ]

  const toggleBookmark = (id: string) => {
    const updated = bookmarkedVideos.includes(id) ? bookmarkedVideos.filter(b => b !== id) : [...bookmarkedVideos, id]
    setBookmarkedVideos(updated)
    localStorage.setItem("bookmarkedVideos", JSON.stringify(updated))
  }

  const filteredVideos = videos.filter(v => {
    const title = language === "ar" ? v.titleAr : v.titleEn
    const desc = language === "ar" ? v.descriptionAr : v.descriptionEn
    return title?.toLowerCase().includes(searchTerm.toLowerCase()) || desc?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <Play className="w-12 h-12 text-teal-600 animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className={`cc-page-shell ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="cc-container px-3 pb-10 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cc-page-header mb-5 text-center sm:mb-8">
          <span className="cc-kicker mb-4">{language === "ar" ? "شاهد" : "Watch"}</span>
          <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:mb-4 sm:text-5xl">{t.educationalVideos}</h1>
          <p className="mx-auto hidden max-w-3xl text-sm text-muted-foreground sm:block sm:text-xl">{t.educationalVideosDesc}</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="cc-toolbar mb-4 space-y-2 p-3 sm:mb-8 sm:space-y-4 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder={t.searchVideos} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9 sm:h-10 text-sm" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm"
                  onClick={() => setSelectedCategory(cat.id)} className="whitespace-nowrap text-xs h-8 px-2.5">
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Videos Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className="cc-card overflow-hidden">
              <div className="relative group">
                {video.thumbnailUrl || video.coverUrl ? (
                  <img src={video.thumbnailUrl || video.coverUrl} alt={language === "ar" ? video.titleAr : video.titleEn}
                    className="w-full h-24 sm:h-48 object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }} />
                ) : null}
                <div className={`w-full h-24 sm:h-48 bg-gradient-to-br from-blue-400 to-teal-600 flex items-center justify-center ${(video.thumbnailUrl || video.coverUrl) ? 'hidden' : ''}`}>
                  <Play className="w-8 sm:w-16 h-8 sm:h-16 text-white opacity-60" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 sm:w-12 h-8 sm:h-12 text-white" />
                </div>
                {video.durationSec && (
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs">
                    {Math.floor(video.durationSec / 60)}:{String(video.durationSec % 60).padStart(2, '0')}
                  </div>
                )}
                <button onClick={() => toggleBookmark(video.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur dark:bg-gray-800/90">
                  {bookmarkedVideos.includes(video.id)
                    ? <BookmarkCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-600" />
                    : <Bookmark className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />}
                </button>
              </div>
              <div className="p-2.5 sm:p-6">
                <h3 className="text-xs sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-3 line-clamp-2">
                  {language === "ar" ? video.titleAr : video.titleEn}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-base hidden sm:block">
                  {language === "ar" ? video.descriptionAr : video.descriptionEn}
                </p>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 w-full text-xs sm:h-9 sm:text-sm">
                    {t.watch}
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
