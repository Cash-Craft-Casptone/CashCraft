"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Target, BookOpen, Share2, RotateCcw } from "lucide-react"

interface QuizResult {
  id: string
  title: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: string
  level: string
  badge?: string
  answers: Array<{
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }>
}

export default function QuizResults() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  const [result, setResult] = useState<QuizResult | null>(null)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Mock quiz result data
    const mockResult: QuizResult = {
      id: quizId,
      title: language === "ar" ? "أساسيات الميزانية" : "Budgeting Basics",
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: "12:34",
      level: language === "ar" ? "مبتدئ" : "Beginner",
      badge: language === "ar" ? "خبير الميزانية" : "Budget Expert",
      answers: [
        {
          question:
            language === "ar"
              ? "ما هو الهدف الأساسي من إنشاء ميزانية؟"
              : "What is the primary purpose of creating a budget?",
          userAnswer: language === "ar" ? "تتبع الدخل والمصروفات" : "Track income and expenses",
          correctAnswer: language === "ar" ? "تتبع الدخل والمصروفات" : "Track income and expenses",
          isCorrect: true,
          explanation:
            language === "ar"
              ? "الميزانية تساعد في تتبع الأموال وتحقيق الأهداف المالية."
              : "A budget helps track money flow and achieve financial goals.",
        },
        {
          question:
            language === "ar" ? "كم يجب أن تكون نسبة المدخرات من الدخل؟" : "What percentage of income should be saved?",
          userAnswer: language === "ar" ? "10%" : "10%",
          correctAnswer: language === "ar" ? "20%" : "20%",
          isCorrect: false,
          explanation:
            language === "ar"
              ? "الخبراء ينصحون بادخار 20% من الدخل للطوارئ والأهداف المستقبلية."
              : "Experts recommend saving 20% of income for emergencies and future goals.",
        },
      ],
    }
    setResult(mockResult)
  }, [quizId, language])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  const scoreColor = result.score >= 80 ? "text-green-600" : result.score >= 60 ? "text-yellow-600" : "text-red-600"
  const badgeColor =
    result.score >= 80
      ? "bg-green-100 text-green-800"
      : result.score >= 60
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${language === "ar" ? "rotate-180" : ""}`} />
            {language === "ar" ? "العودة" : "Back"}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 text-center"
        >
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "تهانينا!" : "Congratulations!"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" ? "لقد أكملت اختبار" : "You completed"} {result.title}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className={`text-3xl font-bold ${scoreColor} mb-2`}>{result.score}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ar" ? "النتيجة النهائية" : "Final Score"}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ar" ? "إجابات صحيحة" : "Correct Answers"}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">{result.timeSpent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ar" ? "الوقت المستغرق" : "Time Spent"}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColor} mb-2`}>
                {result.badge}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ar" ? "الشارة المكتسبة" : "Badge Earned"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            {language === "ar" ? "مراجعة الإجابات" : "Answer Review"}
          </h2>

          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`border-l-4 ${answer.isCorrect ? "border-green-500" : "border-red-500"} pl-6 py-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? `السؤال ${index + 1}` : `Question ${index + 1}`}: {answer.question}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      answer.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {answer.isCorrect ? (language === "ar" ? "صحيح" : "Correct") : language === "ar" ? "خطأ" : "Wrong"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "إجابتك:" : "Your Answer:"}
                    </span>
                    <p className={`${answer.isCorrect ? "text-green-600" : "text-red-600"} font-medium`}>
                      {answer.userAnswer}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "الإجابة الصحيحة:" : "Correct Answer:"}
                    </span>
                    <p className="text-green-600 font-medium">{answer.correctAnswer}</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {language === "ar" ? "التفسير:" : "Explanation:"}
                  </span>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">{answer.explanation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push(`/quiz/${quizId}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            {language === "ar" ? "إعادة المحاولة" : "Retake Quiz"}
          </button>

          <button
            onClick={() => router.push("/quiz")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Target className="w-5 h-5" />
            {language === "ar" ? "اختبارات أخرى" : "More Quizzes"}
          </button>

          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Share2 className="w-5 h-5" />
            {language === "ar" ? "مشاركة النتيجة" : "Share Result"}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
