"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Trophy, Star, Lock, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { apiGetQuizzes } from "@/lib/api"

export default function QuizPage() {
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useApp()
  const t = translations[language]

  useEffect(() => {
    setCompletedQuizzes(JSON.parse(localStorage.getItem("completedQuizzes") || "[]"))
    loadQuizzes()
  }, [])

  useEffect(() => {
    const handler = () => { if (!document.hidden) setCompletedQuizzes(JSON.parse(localStorage.getItem("completedQuizzes") || "[]")) }
    document.addEventListener("visibilitychange", handler)
    window.addEventListener("focus", handler)
    return () => { document.removeEventListener("visibilitychange", handler); window.removeEventListener("focus", handler) }
  }, [])

  const loadQuizzes = async () => {
    try { setLoading(true); setQuizzes(await apiGetQuizzes()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const getDifficultyColor = (d: string) => {
    const l = d.toLowerCase()
    if (l === "beginner" || l === "مبتدئ") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (l === "intermediate" || l === "متوسط") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    if (l === "advanced" || l === "متقدم") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }

  const quizLevels = quizzes.map(quiz => {
    const n = quiz.questions?.length || 0
    let difficulty = language === "ar" ? "مبتدئ" : "Beginner"
    if (n >= 11) difficulty = language === "ar" ? "متقدم" : "Advanced"
    else if (n >= 6) difficulty = language === "ar" ? "متوسط" : "Intermediate"
    return {
      id: quiz.id,
      title: language === "ar" ? quiz.titleAr : quiz.titleEn,
      difficulty,
      questions: n,
      timeLimit: `${Math.round(n * 1.5)} min`,
      points: n * 10,
      unlocked: true,
      completed: completedQuizzes.includes(quiz.id),
    }
  })

  if (loading) return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <Brain className="w-12 h-12 text-teal-600 animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4 sm:mb-12">
          <div className="flex justify-center mb-3 sm:mb-6">
            <div className="p-3 sm:p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full">
              <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#084f5a] dark:text-white mb-2 sm:mb-4">{t.financialQuizzes}</h1>
          <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto hidden sm:block">{t.financialQuizzesDesc}</p>
        </motion.div>

        {/* Progress Overview - compact on mobile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 mb-4 sm:mb-8 shadow-lg">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {[
              { icon: <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500" />, value: completedQuizzes.length, label: t.completedQuizzes },
              { icon: <Star className="w-5 h-5 sm:w-8 sm:h-8 text-teal-500" />, value: completedQuizzes.length * 125, label: t.pointsEarned },
              { icon: <Brain className="w-5 h-5 sm:w-8 sm:h-8 text-purple-500" />, value: `${Math.round((completedQuizzes.length / Math.max(quizLevels.length, 1)) * 100)}%`, label: t.completionRate },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-1 sm:mb-2">{item.icon}</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiz Grid - 2 cols on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {quizLevels.map((quiz, index) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg border-2 transition-all ${
                quiz.completed ? "border-green-200 dark:border-green-800"
                : quiz.unlocked ? "border-teal-200 dark:border-teal-800 hover:border-teal-300"
                : "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"}`}>
              <div className="flex items-start justify-between mb-2 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">{quiz.title}</h3>
                    {quiz.completed && <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />}
                    {!quiz.unlocked && <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />}
                  </div>
                  <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-4 mb-3 sm:mb-6 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{quiz.questions}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{t.questions}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                    <Clock className="w-3 h-3" />{quiz.timeLimit}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{t.time}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-500" />{quiz.points}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{t.points}</div>
                </div>
              </div>

              {quiz.unlocked ? (
                <Link href={`/quiz/${quiz.id}`} className="block">
                  <Button className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white text-xs sm:text-sm h-8 sm:h-10">
                    {quiz.completed ? t.retakeQuiz : t.startQuiz}
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full text-xs sm:text-sm h-8 sm:h-10">
                  <Lock className="w-3 h-3 mr-1" />{t.locked}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
