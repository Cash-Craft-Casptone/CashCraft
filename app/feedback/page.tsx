"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Send, MessageSquare, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react"
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

// Multi-choice questions shown before the free-text message
const QUESTIONS = [
  {
    id: "ui",
    question: "How would you rate the UI design?",
    questionAr: "كيف تقيّم تصميم الواجهة؟",
    options: ["Excellent", "Good", "Average", "Needs improvement"],
    optionsAr: ["ممتاز", "جيد", "متوسط", "يحتاج تحسين"],
  },
  {
    id: "bugs",
    question: "Did you encounter any bugs?",
    questionAr: "هل واجهت أي أخطاء؟",
    options: ["No bugs at all", "Minor bugs", "Some bugs", "Many bugs"],
    optionsAr: ["لا أخطاء", "أخطاء بسيطة", "بعض الأخطاء", "أخطاء كثيرة"],
  },
  {
    id: "features",
    question: "Which features do you use most?",
    questionAr: "ما الميزات التي تستخدمها أكثر؟",
    options: ["Budget planner", "Articles & Videos", "Quizzes", "AI advisor"],
    optionsAr: ["مخطط الميزانية", "المقالات والفيديوهات", "الاختبارات", "المستشار الذكي"],
    multi: true,
  },
  {
    id: "recommend",
    question: "Would you recommend CashCraft to others?",
    questionAr: "هل ستوصي بـ CashCraft للآخرين؟",
    options: ["Definitely yes", "Probably yes", "Not sure", "No"],
    optionsAr: ["بالتأكيد نعم", "ربما نعم", "غير متأكد", "لا"],
  },
]

export default function FeedbackPage() {
  const { language, currentUser } = useApp()
  const router = useRouter()
  const isAr = language === "ar"

  // Step: 0=rating+category, 1..N=questions, last=message+submit
  const totalSteps = 2 + QUESTIONS.length // step 0, questions, step final
  const [step, setStep] = useState(0)

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [category, setCategory] = useState("General")
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myFeedback, setMyFeedback] = useState<FeedbackDto[]>([])

  useEffect(() => {
    if (!currentUser) { router.push("/login"); return }
    loadMyFeedback()
  }, [currentUser])

  const loadMyFeedback = async () => {
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      setMyFeedback(await apiGetMyFeedback(token))
    } catch (e) { console.error(e) }
  }

  const toggleAnswer = (qId: string, option: string, multi?: boolean) => {
    setAnswers(prev => {
      const current = prev[qId] || []
      if (multi) {
        return { ...prev, [qId]: current.includes(option) ? current.filter(o => o !== option) : [...current, option] }
      }
      return { ...prev, [qId]: [option] }
    })
  }

  const buildMessage = () => {
    const lines: string[] = []
    QUESTIONS.forEach(q => {
      const ans = answers[q.id]
      if (ans && ans.length > 0) {
        lines.push(`${isAr ? q.questionAr : q.question}: ${ans.join(", ")}`)
      }
    })
    if (message.trim()) lines.push(`\nAdditional comments: ${message.trim()}`)
    return lines.join("\n")
  }

  const handleSubmit = async () => {
    if (!rating) { setError(isAr ? "يرجى اختيار تقييم" : "Please select a rating"); return }
    const fullMessage = buildMessage()
    if (!fullMessage.trim()) { setError(isAr ? "يرجى الإجابة على الأسئلة أو كتابة رسالة" : "Please answer questions or write a message"); return }
    setError(null)
    setSubmitting(true)
    try {
      const token = localStorage.getItem("cashcraft_accessToken") || undefined
      await apiSubmitFeedback(rating, fullMessage, category, token)
      setSubmitted(true)
      setRating(0); setMessage(""); setCategory("General"); setAnswers({}); setStep(0)
      loadMyFeedback()
      setTimeout(() => setSubmitted(false), 4000)
    } catch (e: any) {
      setError(e.message || "Failed to submit feedback")
    } finally { setSubmitting(false) }
  }

  const canProceed = () => {
    if (step === 0) return rating > 0
    const qIndex = step - 1
    if (qIndex < QUESTIONS.length) {
      const q = QUESTIONS[qIndex]
      return q.multi ? true : (answers[q.id]?.length > 0) // multi is optional
    }
    return true
  }

  const currentQuestion = step > 0 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null
  const isFinalStep = step === QUESTIONS.length + 1

  if (!currentUser) return null

  return (
    <div className={`cc-page-shell ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cc-page-header mb-6">
          <span className="cc-kicker mb-4">{isAr ? "صوتك مهم" : "Your voice matters"}</span>
          <h1 className="flex items-center gap-3 text-2xl font-extrabold text-foreground sm:text-4xl">
            <MessageSquare className="w-7 h-7" />
            {isAr ? "التقييمات والملاحظات" : "Feedback"}
          </h1>
        </motion.div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-[#6099a5]" : "bg-gray-200 dark:bg-gray-700"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Rating + Category */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">{isAr ? "كيف كانت تجربتك؟" : "How was your experience?"}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{isAr ? "اختر تقييمك وفئة الملاحظة" : "Choose your rating and feedback category"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="dark:text-gray-300 mb-3 block">{isAr ? "التقييم العام" : "Overall Rating"}</Label>
                    <div className="flex gap-3 justify-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button"
                          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
                          onClick={() => setRating(star)} className="transition-transform hover:scale-125">
                          <Star className={`w-10 h-10 ${star <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="dark:text-gray-300 mb-3 block">{isAr ? "فئة الملاحظة" : "Feedback Category"}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} type="button" onClick={() => setCategory(cat)}
                          className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                            category === cat ? "border-[#084f5a] bg-[#084f5a]/10 text-[#084f5a] dark:text-emerald-400" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#6099a5]"
                          }`}>
                          {cat === "Bug" ? "🐛 Bug" : cat === "Suggestion" ? "💡 Suggestion" : cat === "Compliment" ? "⭐ Compliment" : "💬 General"}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Question steps */}
          {currentQuestion && (
            <motion.div key={`q${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="text-xs text-gray-400 mb-1">{isAr ? `سؤال ${step} من ${QUESTIONS.length}` : `Question ${step} of ${QUESTIONS.length}`}</div>
                  <CardTitle className="dark:text-gray-100 text-lg">
                    {isAr ? currentQuestion.questionAr : currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.multi && (
                    <CardDescription className="dark:text-gray-400">{isAr ? "يمكنك اختيار أكثر من إجابة" : "You can select multiple"}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(isAr ? currentQuestion.optionsAr : currentQuestion.options).map((opt, i) => {
                      const selected = answers[currentQuestion.id]?.includes(opt)
                      return (
                        <button key={i} type="button" onClick={() => toggleAnswer(currentQuestion.id, opt, currentQuestion.multi)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                            selected ? "border-[#084f5a] bg-[#084f5a]/10 text-[#084f5a] dark:text-emerald-400 dark:border-emerald-500" : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#6099a5]"
                          }`}>
                          <span className={`inline-block w-5 h-5 rounded-full border-2 mr-3 align-middle transition-all ${selected ? "bg-[#084f5a] border-[#084f5a]" : "border-gray-300"}`} />
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Final step: message + submit */}
          {isFinalStep && (
            <motion.div key="final" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">{isAr ? "أي تعليقات إضافية؟" : "Any additional comments?"}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{isAr ? "اختياري - شاركنا أي تفاصيل إضافية" : "Optional - share any extra details"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder={isAr ? "اكتب ملاحظاتك هنا..." : "Write your thoughts here..."}
                    rows={4} className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" />

                  {/* Summary */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}</div>
                    <div><Badge className={`text-xs ${categoryColors[category]}`}>{category}</Badge></div>
                    {Object.entries(answers).map(([qId, ans]) => {
                      const q = QUESTIONS.find(q => q.id === qId)
                      return q ? <div key={qId} className="truncate">{isAr ? q.questionAr : q.question}: <span className="font-medium">{ans.join(", ")}</span></div> : null
                    })}
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {submitted && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {isAr ? "تم إرسال تقييمك بنجاح!" : "Feedback submitted successfully!"}
                    </motion.div>
                  )}
                  <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-[#084f5a] hover:bg-[#063d47] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال التقييم" : "Submit Feedback")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="dark:border-gray-600 dark:text-gray-300">
            <ChevronLeft className="w-4 h-4 mr-1" />{isAr ? "السابق" : "Back"}
          </Button>
          {!isFinalStep && (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="bg-[#6099a5] hover:bg-[#084f5a] text-white">
              {isAr ? "التالي" : "Next"}<ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* My Previous Feedback */}
        {myFeedback.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {isAr ? "تقييماتي السابقة" : "My Previous Feedback"}
            </h2>
            <div className="space-y-3">
              {myFeedback.map(fb => (
                <Card key={fb.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${categoryColors[fb.category] || categoryColors.General}`}>{fb.category}</Badge>
                        <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{fb.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
