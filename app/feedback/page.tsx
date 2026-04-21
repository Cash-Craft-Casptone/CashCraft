"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Send, MessageSquare, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { apiSubmitFeedback, apiGetMyFeedback, FeedbackDto } from "@/lib/api"

const CATEGORIES = ["General", "Bug", "Suggestion", "Compliment"]

const categoryColors: Record<string, string> = {
  General: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  Bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Suggestion: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Compliment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
}

export default function FeedbackPage() {
  const { language, currentUser } = useApp()
  const router = useRouter()
  const isAr = language === "ar"

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("General")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myFeedback, setMyFeedback] = useState<FeedbackDto[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!currentUser) { router.push("/login"); return }
    loadMyFeedback()
  }, [currentUser])

  const loadMyFeedback = async () => {
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      const data = await apiGetMyFeedback(token)
      setMyFeedback(data)
    } catch (e) { console.error(e) }
    finally { setLoadingHistory(false) }
  }

  const handleSubmit = async () => {
    if (!rating) { setError(isAr ? "يرجى اختيار تقييم" : "Please select a rating"); return }
    if (!message.trim()) { setError(isAr ? "يرجى كتابة رسالة" : "Please write a message"); return }
    setError(null)
    setSubmitting(true)
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      await apiSubmitFeedback(rating, message.trim(), category, token)
      setSubmitted(true)
      setRating(0); setMessage(""); setCategory("General")
      loadMyFeedback()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (e: any) {
      setError(e.message || (isAr ? "فشل إرسال التقييم" : "Failed to submit feedback"))
    } finally { setSubmitting(false) }
  }

  if (!currentUser) return null

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#084f5a] dark:text-emerald-400 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            {isAr ? "التقييمات والملاحظات" : "Feedback"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? "شاركنا رأيك لنتحسن أكثر" : "Share your thoughts to help us improve"}
          </p>
        </motion.div>

        {/* Submit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="dark:bg-gray-800 dark:border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{isAr ? "إرسال تقييم جديد" : "Submit Feedback"}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {isAr ? "أخبرنا عن تجربتك" : "Tell us about your experience"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Star Rating */}
              <div>
                <Label className="dark:text-gray-300 mb-2 block">{isAr ? "التقييم" : "Rating"}</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110">
                      <Star className={`w-8 h-8 ${star <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                    </button>
                  ))}
                  {rating > 0 && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 self-center">{rating}/5</span>}
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="dark:text-gray-300 mb-2 block">{isAr ? "الفئة" : "Category"}</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        category === cat
                          ? "bg-[#084f5a] text-white border-[#084f5a]"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#6099a5]"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label className="dark:text-gray-300 mb-2 block">{isAr ? "الرسالة" : "Message"}</Label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={isAr ? "اكتب ملاحظاتك هنا..." : "Write your feedback here..."}
                  rows={4}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">{message.length}/500</p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {submitted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {isAr ? "تم إرسال تقييمك بنجاح!" : "Feedback submitted successfully!"}
                </motion.div>
              )}

              <Button onClick={handleSubmit} disabled={submitting || !rating || !message.trim()}
                className="bg-[#084f5a] hover:bg-[#063d47] text-white">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال" : "Submit")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Previous Feedback */}
        {myFeedback.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {isAr ? "تقييماتي السابقة" : "My Previous Feedback"}
            </h2>
            <div className="space-y-3">
              {myFeedback.map(fb => (
                <Card key={fb.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${categoryColors[fb.category] || categoryColors.General}`}>{fb.category}</Badge>
                        <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{fb.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
