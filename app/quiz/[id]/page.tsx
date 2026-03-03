"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, Trophy, RotateCcw, Home, Target } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { apiGetQuizzes } from "@/lib/api"

const translations = {
  en: {
    quiz: "Quiz",
    question: "Question",
    of: "of",
    timeRemaining: "Time Remaining",
    nextQuestion: "Next Question",
    previousQuestion: "Previous Question",
    submitQuiz: "Submit Quiz",
    correct: "Correct",
    incorrect: "Incorrect",
    explanation: "Explanation",
    yourAnswer: "Your Answer",
    correctAnswer: "Correct Answer",
    quizComplete: "Quiz Complete!",
    yourScore: "Your Score",
    timeSpent: "Time Spent",
    questionsCorrect: "Questions Correct",
    retakeQuiz: "Retake Quiz",
    backToQuizzes: "Back to Quizzes",
    backToDashboard: "Back to Dashboard",
    excellent: "Excellent!",
    good: "Good Job!",
    needsImprovement: "Needs Improvement",
    keepTrying: "Keep Trying!",
    minutes: "minutes",
    seconds: "seconds",
    selectAnswer: "Please select an answer",
    loading: "Loading...",
  },
  ar: {
    quiz: "اختبار",
    question: "سؤال",
    of: "من",
    timeRemaining: "الوقت المتبقي",
    nextQuestion: "السؤال التالي",
    previousQuestion: "السؤال السابق",
    submitQuiz: "إرسال الاختبار",
    correct: "صحيح",
    incorrect: "خطأ",
    explanation: "التفسير",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    quizComplete: "اكتمل الاختبار!",
    yourScore: "نتيجتك",
    timeSpent: "الوقت المستغرق",
    questionsCorrect: "الأسئلة الصحيحة",
    retakeQuiz: "إعادة الاختبار",
    backToQuizzes: "العودة للاختبارات",
    backToDashboard: "العودة للوحة التحكم",
    excellent: "ممتاز!",
    good: "أحسنت!",
    needsImprovement: "يحتاج تحسين",
    keepTrying: "استمر في المحاولة!",
    minutes: "دقائق",
    seconds: "ثواني",
    selectAnswer: "يرجى اختيار إجابة",
    loading: "جاري التحميل...",
  },
}

// Mock quiz data
const mockQuizData = {
  1: {
    id: 1,
    title: "Budgeting Basics",
    description: "Test your knowledge of fundamental budgeting concepts and techniques.",
    category: "budgeting",
    difficulty: "beginner",
    timeLimit: 480, // 8 minutes in seconds
    questions: [
      {
        id: 1,
        question: "What is the 50/30/20 budgeting rule?",
        options: [
          "50% needs, 30% wants, 20% savings",
          "50% wants, 30% needs, 20% savings",
          "50% savings, 30% needs, 20% wants",
          "50% needs, 30% savings, 20% wants",
        ],
        correctAnswer: 0,
        explanation:
          "The 50/30/20 rule suggests allocating 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.",
      },
      {
        id: 2,
        question: "Which of the following is considered a 'need' in budgeting?",
        options: ["Netflix subscription", "Rent payment", "Dining out", "New clothes"],
        correctAnswer: 1,
        explanation:
          "Rent payment is a necessity for shelter, which is a basic need. The other options are typically considered wants.",
      },
      {
        id: 3,
        question: "How often should you review and adjust your budget?",
        options: ["Once a year", "Every 6 months", "Monthly", "Never"],
        correctAnswer: 2,
        explanation:
          "It's recommended to review your budget monthly to track spending, adjust for changes, and ensure you're meeting your financial goals.",
      },
      {
        id: 4,
        question: "What is zero-based budgeting?",
        options: [
          "Having zero money left over",
          "Starting with zero and adding expenses",
          "Assigning every dollar a purpose",
          "Spending nothing on wants",
        ],
        correctAnswer: 2,
        explanation:
          "Zero-based budgeting means assigning every dollar of income a specific purpose, so income minus expenses equals zero.",
      },
      {
        id: 5,
        question: "Which expense should be prioritized first in a budget?",
        options: ["Entertainment", "Emergency fund", "Essential needs", "Investments"],
        correctAnswer: 2,
        explanation:
          "Essential needs like housing, food, and utilities should be prioritized first to ensure basic survival and stability.",
      },
    ],
  },
}

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = params.id as string
  const [currentLang, setCurrentLang] = useState<"en" | "ar">("en")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quiz, setQuiz] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const t = translations[currentLang]
  const router = useRouter()

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setIsLoading(true)
      const quizzes = await apiGetQuizzes()
      const foundQuiz = quizzes.find((q: any) => q.id === quizId)
      
      if (!foundQuiz) {
        setError("Quiz not found")
        return
      }
      
      // Transform API data to match expected format
      const transformedQuiz = {
        title: currentLang === "ar" ? foundQuiz.titleAr : foundQuiz.titleEn,
        description: "",
        category: "financial",
        difficulty: "beginner",
        timeLimit: foundQuiz.questions.length * 90, // 1.5 minutes per question in seconds
        questions: foundQuiz.questions.map((q: any, index: number) => ({
          id: index + 1,
          question: currentLang === "ar" ? q.textAr : q.textEn,
          options: q.options.map((o: any) => currentLang === "ar" ? o.textAr : o.textEn),
          correctAnswer: q.options.findIndex((o: any) => o.isCorrect),
          explanation: ""
        }))
      }
      
      setQuiz(transformedQuiz)
      setTimeRemaining(transformedQuiz.timeLimit)
      setQuizStartTime(new Date())
    } catch (err: any) {
      setError(err.message || "Failed to load quiz")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (timeRemaining > 0 && !showResults && quiz) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !showResults && quiz) {
      handleSubmitQuiz()
    }
  }, [timeRemaining, showResults, quiz])

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
    
    // Save quiz completion to localStorage
    const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
    if (!completed.includes(quizId)) {
      completed.push(quizId)
      localStorage.setItem("completedQuizzes", JSON.stringify(completed))
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return t.excellent
    if (score >= 70) return t.good
    if (score >= 50) return t.needsImprovement
    return t.keepTrying
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeSpent = () => {
    if (!quizStartTime) return "0:00"
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - quizStartTime.getTime()) / 1000)
    return formatTime(diffInSeconds)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-xl font-semibold mb-4">{error || "Quiz not found"}</p>
          <Link href="/quiz">
            <Button>{t.backToQuizzes}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestionData = quiz.questions[currentQuestion]

  if (showResults) {
    const score = calculateScore()
    const correctAnswers = quiz.questions.filter(
      (_, index) => selectedAnswers[index] === quiz.questions[index].correctAnswer,
    ).length

    return (
      <div className={`min-h-screen bg-background ${currentLang === "ar" ? "rtl font-cairo" : "ltr"}`}>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className={`text-xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>{t.quizComplete}</h1>
            <Button variant="ghost" size="sm" onClick={() => setCurrentLang(currentLang === "en" ? "ar" : "en")}>
              {currentLang === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center mb-8">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl">{getScoreMessage(score)}</CardTitle>
                <CardDescription>
                  {quiz.title} - {t.quizComplete}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{score}%</div>
                    <p className="text-sm text-muted-foreground">{t.yourScore}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {correctAnswers}/{quiz.questions.length}
                    </div>
                    <p className="text-sm text-muted-foreground">{t.questionsCorrect}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{getTimeSpent()}</div>
                    <p className="text-sm text-muted-foreground">{t.timeSpent}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.reload()}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t.retakeQuiz}
                  </Button>
                  <Link href="/quiz">
                    <Button variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      {t.backToQuizzes}
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">
                      <Home className="w-4 h-4 mr-2" />
                      {t.backToDashboard}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className={`text-xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>Detailed Results</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {t.question} {index + 1}
                          </CardTitle>
                          <div className="flex items-center">
                            {isCorrect ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t.correct}
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                {t.incorrect}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{question.question}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {userAnswer !== undefined && (
                          <div>
                            <p className="font-medium text-sm mb-1">{t.yourAnswer}:</p>
                            <p className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                              {question.options[userAnswer]}
                            </p>
                          </div>
                        )}

                        {!isCorrect && (
                          <div>
                            <p className="font-medium text-sm mb-1">{t.correctAnswer}:</p>
                            <p className="text-sm text-green-600">{question.options[question.correctAnswer]}</p>
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-sm mb-1">{t.explanation}:</p>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className={`min-h-screen bg-background ${currentLang === "ar" ? "rtl font-cairo" : "ltr"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/quiz">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToQuizzes}
              </Button>
            </Link>
            <h1 className={`text-xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>
              {quiz.title} - {t.question} {currentQuestion + 1} {t.of} {quiz.questions.length}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeRemaining)}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentLang(currentLang === "en" ? "ar" : "en")}>
              {currentLang === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-2">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{quiz.category}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {t.question} {currentQuestion + 1} {t.of} {quiz.questions.length}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{currentQ.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion, Number.parseInt(value))}
                    className="space-y-4"
                  >
                    {currentQ.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.previousQuestion}
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {t.submitQuiz}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion] === undefined}>
                {t.nextQuestion}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
