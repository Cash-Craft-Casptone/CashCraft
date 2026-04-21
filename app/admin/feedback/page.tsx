"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Trash2, MessageSquare, TrendingUp, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { apiGetAllFeedback, apiDeleteFeedback, FeedbackSummary } from "@/lib/api"

const categoryColors: Record<string, string> = {
  General: "bg-gray-100 text-gray-700",
  Bug: "bg-red-100 text-red-700",
  Suggestion: "bg-blue-100 text-blue-700",
  Compliment: "bg-green-100 text-green-700",
}

export default function AdminFeedbackPage() {
  const { currentUser } = useApp()
  const router = useRouter()
  const [data, setData] = useState<FeedbackSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterRating, setFilterRating] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"

  useEffect(() => {
    if (!currentUser) { router.push("/login"); return }
    if (!isAdmin) { router.push("/dashboard"); return }
    loadFeedback()
  }, [currentUser, filterCategory, filterRating])

  const loadFeedback = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      const result = await apiGetAllFeedback(token, filterCategory || undefined, filterRating || undefined)
      setData(result)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback?")) return
    setDeleting(id)
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      await apiDeleteFeedback(id, token)
      loadFeedback()
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#084f5a] dark:text-emerald-400 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            User Feedback
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage all user feedback</p>
        </motion.div>

        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-[#6099a5] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">{data.summary.total}</div>
                <div className="text-xs text-gray-500">Total Feedback</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">{data.summary.avgRating.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </CardContent>
            </Card>
            {data.summary.byCategory.slice(0, 2).map(bc => (
              <Card key={bc.category} className="dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-[#6099a5] mx-auto mb-1" />
                  <div className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">{bc.count}</div>
                  <div className="text-xs text-gray-500">{bc.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rating Distribution */}
        {data && (
          <Card className="dark:bg-gray-800 mb-8">
            <CardHeader><CardTitle className="text-sm dark:text-gray-100">Rating Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5,4,3,2,1].map(stars => {
                  const count = data.summary.byRating.find(r => r.stars === stars)?.count || 0
                  const pct = data.summary.total > 0 ? (count / data.summary.total) * 100 : 0
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex gap-0.5 w-20 flex-shrink-0">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
          </div>
          {["", "General", "Bug", "Suggestion", "Compliment"].map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filterCategory === cat ? "bg-[#084f5a] text-white border-[#084f5a]" : "border-gray-300 text-gray-600 hover:border-[#6099a5]"
              }`}>
              {cat || "All Categories"}
            </button>
          ))}
          <div className="flex gap-1 ml-2">
            {[0,1,2,3,4,5].map(r => (
              <button key={r} onClick={() => setFilterRating(r)}
                className={`px-2 py-1 rounded text-xs border transition-all ${
                  filterRating === r ? "bg-[#084f5a] text-white border-[#084f5a]" : "border-gray-300 text-gray-600 hover:border-[#6099a5]"
                }`}>
                {r === 0 ? "All ★" : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {data?.feedbacks.map(fb => (
              <motion.div key={fb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <Badge className={`text-xs ${categoryColors[fb.category] || categoryColors.General}`}>{fb.category}</Badge>
                          <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-3">{fb.message}</p>
                        {fb.user && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="w-6 h-6 rounded-full bg-[#6099a5] flex items-center justify-center text-white font-bold text-xs">
                              {fb.user.displayName?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium">{fb.user.displayName}</span>
                            <span>@{fb.user.username}</span>
                            <span>·</span>
                            <span>{fb.user.email}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(fb.id)}
                        disabled={deleting === fb.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-3 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {data?.feedbacks.length === 0 && (
              <div className="text-center py-12 text-gray-500">No feedback found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
