"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Video, Clock, Edit, Trash2, PlusCircle, Save, X } from "lucide-react"
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
  apiGetVideos,
  apiCreateVideo,
  apiUpdateVideo,
  apiDeleteVideo,
  getAuthToken,
} from "@/lib/api"

export default function AdminVideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [videos, setVideos] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingVideo, setEditingVideo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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
    loadVideos()
  }, [currentUser, isAllowed, router])

  const loadVideos = async () => {
    try {
      const data = await apiGetVideos()
      setVideos(data)
    } catch (error) {
      console.error("Failed to load videos:", error)
    }
  }

  const [formData, setFormData] = useState({
    slug: "",
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    url: "",
    thumbnailUrl: "",
    durationSec: "",
  })

  const resetForm = () => {
    setFormData({
      slug: "",
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      url: "",
      thumbnailUrl: "",
      durationSec: "",
    })
    setShowCreate(false)
    setEditingVideo(null)
  }

  const handleCreate = async () => {
    if (!formData.slug || !formData.titleEn || !formData.titleAr || !formData.url) {
      toast({ title: "Error", description: "Slug, titles, and URL are required", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      const token = getAuthToken()
      await apiCreateVideo({
        ...formData,
        durationSec: formData.durationSec ? Number(formData.durationSec) : undefined,
      }, token!)
      toast({ title: "Video created successfully" })
      resetForm()
      loadVideos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingVideo) return
    try {
      setLoading(true)
      const token = getAuthToken()
      await apiUpdateVideo(editingVideo.id, {
        ...formData,
        durationSec: formData.durationSec ? Number(formData.durationSec) : undefined,
      }, token!)
      toast({ title: "Video updated successfully" })
      resetForm()
      loadVideos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return
    try {
      const token = getAuthToken()
      await apiDeleteVideo(id, token!)
      toast({ title: "Video deleted successfully" })
      loadVideos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const startEdit = (video: any) => {
    setFormData({
      slug: video.slug,
      titleEn: video.titleEn,
      titleAr: video.titleAr,
      descriptionEn: video.descriptionEn || "",
      descriptionAr: video.descriptionAr || "",
      url: video.url || "",
      thumbnailUrl: video.thumbnailUrl || "",
      durationSec: video.durationSec?.toString() || "",
    })
    setEditingVideo(video)
    setShowCreate(true)
  }

  const filteredVideos = videos.filter((video) =>
    video.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.titleAr.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAllowed) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Manage Videos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create, edit, and manage educational videos
          </p>
        </motion.div>

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
              placeholder="Search videos..."
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
            Create Video
          </Button>
        </motion.div>

        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
                <CardTitle className="flex items-center justify-between">
                  <span>{editingVideo ? "Edit Video" : "Create New Video"}</span>
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
                      placeholder="budgeting-basics"
                    />
                  </div>
                  <div>
                    <Label>Video URL *</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                    />
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
                    <Label>Thumbnail URL</Label>
                    <Input
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration (seconds)
                    </Label>
                    <Input
                      type="number"
                      value={formData.durationSec}
                      onChange={(e) => setFormData({ ...formData, durationSec: e.target.value })}
                      placeholder="780"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      rows={2}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Arabic)</Label>
                    <Textarea
                      rows={2}
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={editingVideo ? handleUpdate : handleCreate}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingVideo ? "Update" : "Create"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-emerald-100 dark:border-emerald-900"
            >
              <div className="relative">
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.titleEn}
                    className="w-full h-48 object-cover"
                  />
                )}
                {!video.thumbnailUrl && (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center">
                    <Video className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {language === "ar" ? video.titleAr : video.titleEn}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {language === "ar" ? video.descriptionAr : video.descriptionEn}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(video)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(video.id)}
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

        {filteredVideos.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No videos found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your first video to get started
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
