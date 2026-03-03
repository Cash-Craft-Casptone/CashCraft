"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Brain, Clock, Star, Edit, Trash2, PlusCircle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  apiGetQuizzes,
  apiCreateQuiz,
  apiUpdateQuiz,
  apiDeleteQuiz,
  getAuthToken,
} from "@/lib/api"

export default function AdminQuizzesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<any>(null)
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
    loadQuizzes()
  }, [currentUser, isAllowed, router])

  const loadQuizzes = async () => {
    try {
      const token = getAuthToken()
      const data = await apiGetQuizzes(token!)
      setQuizzes(data)
    } catch (error) {
      console.error("Failed to load quizzes:", error)
    }
  }

  const [formData, setFormData] = useState({
    slug: "",
    titleEn: "",
    titleAr: "",
    difficulty: "Beginner",
    numQuestions: 10,
    isPublished: false,
    questions: [] as any[],
  })

  const calculatedPoints = formData.numQuestions * 10
  const estimatedTime = Math.round(formData.numQuestions * 1.5)

  const resetForm = () => {
    setFormData({
      slug: "",
      titleEn: "",
      titleAr: "",
      difficulty: "Beginner",
      numQuestions: 10,
      isPublished: false,
      questions: [],
    })
    setShowCreate(false)
    setEditingQuiz(null)
  }

  const addNewQuestion = () => {
    const newQuestion = {
      textEn: "",
      textAr: "",
      options: [
        { textEn: "", textAr: "", isCorrect: true },
        { textEn: "", textAr: "", isCorrect: false },
        { textEn: "", textAr: "", isCorrect: false },
        { textEn: "", textAr: "", isCorrect: false },
      ],
    }
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index)
    setFormData({ ...formData, questions: newQuestions })
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...formData.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setFormData({ ...formData, questions: newQuestions })
  }

  const updateOption = (qIndex: number, oIndex: number, field: string, value: any) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].options[oIndex] = {
      ...newQuestions[qIndex].options[oIndex],
      [field]: value,
    }
    setFormData({ ...formData, questions: newQuestions })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const handleCreate = async () => {
    console.log("🔵 handleCreate called")
    console.log("📋 formData:", formData)
    
    if (!formData.slug || !formData.titleEn || !formData.titleAr) {
      console.log("❌ Validation failed - missing required fields")
      toast({ title: "Error", description: "Slug and titles are required", variant: "destructive" })
      return
    }
    
    const payload = { 
      slug: formData.slug,
      titleEn: formData.titleEn,
      titleAr: formData.titleAr,
      questions: []
    }
    
    console.log("📤 Sending payload:", payload)
    
    try {
      setLoading(true)
      const token = getAuthToken()
      console.log("🔑 Token:", token ? "exists" : "missing")
      
      // Create quiz as private with empty questions - only send fields backend expects
      const result = await apiCreateQuiz(payload, token!)
      console.log("✅ Quiz created:", result)
      
      toast({ title: "Quiz created as private", description: "Add questions to publish it" })
      resetForm()
      loadQuizzes()
    } catch (error: any) {
      console.error("❌ Create quiz error:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingQuiz) return
    
    const filledQuestions = formData.questions.filter(q => 
      q.textEn && q.textAr && q.options.every((o: any) => o.textEn && o.textAr)
    )
    
    if (filledQuestions.length < formData.numQuestions) {
      toast({ 
        title: "Cannot publish", 
        description: `Fill all ${formData.numQuestions} questions to publish`, 
        variant: "destructive" 
      })
      return
    }

    try {
      setLoading(true)
      const token = getAuthToken()
      // Only send fields backend expects
      await apiUpdateQuiz(editingQuiz.id, {
        slug: formData.slug,
        titleEn: formData.titleEn,
        titleAr: formData.titleAr,
        questions: formData.questions
      }, token!)
      toast({ title: "Quiz updated successfully" })
      resetForm()
      loadQuizzes()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz)
    setFormData({
      slug: quiz.slug,
      titleEn: quiz.titleEn,
      titleAr: quiz.titleAr,
      difficulty: "Beginner",
      numQuestions: quiz.questions?.length || 10,
      isPublished: quiz.isPublished,
      questions: quiz.questions || [],
    })
    setShowCreate(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return
    try {
      const token = getAuthToken()
      await apiDeleteQuiz(id, token!)
      toast({ title: "Quiz deleted successfully" })
      loadQuizzes()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.titleAr.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAllowed) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Manage Quizzes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create, edit, and manage financial quizzes
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
              placeholder="Search quizzes..."
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
            Create Quiz
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
                  <span>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</span>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Quiz Info */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">Quiz Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="money-basics"
                      />
                    </div>
                    <div>
                      <Label>Number of Questions *</Label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.numQuestions}
                        onChange={(e) => setFormData({ ...formData, numQuestions: Number(e.target.value) })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        1-5: Beginner, 6-10: Intermediate, 11+: Advanced
                      </p>
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
                      <Label>Auto-Calculated Stats</Label>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">{estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{calculatedPoints} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions - Simplified for now */}
                {!editingQuiz ? (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>Quiz will be created as <span className="font-semibold text-red-600">PRIVATE</span>.</p>
                    <p className="text-sm">Click Edit after creation to add questions and publish.</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Difficulty is auto-calculated: 1-5 questions = Beginner, 6-10 = Intermediate, 11+ = Advanced
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Questions</h3>
                      <Button
                        type="button"
                        onClick={addNewQuestion}
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Add Question
                      </Button>
                    </div>

                    {formData.questions.map((question: any, qIndex: number) => (
                      <div key={qIndex} className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-emerald-600">Question {qIndex + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label>Question (English)</Label>
                            <Input
                              value={question.textEn}
                              onChange={(e) => updateQuestion(qIndex, "textEn", e.target.value)}
                              placeholder="What is a budget?"
                            />
                          </div>
                          <div>
                            <Label>Question (Arabic)</Label>
                            <Input
                              value={question.textAr}
                              onChange={(e) => updateQuestion(qIndex, "textAr", e.target.value)}
                              placeholder="ما هي الميزانية؟"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Options (First option is correct by default)</Label>
                            {question.options?.map((option: any, oIndex: number) => (
                              <div key={oIndex} className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() => {
                                    const newQuestions = [...formData.questions]
                                    newQuestions[qIndex].options.forEach((o: any, i: number) => {
                                      o.isCorrect = i === oIndex
                                    })
                                    setFormData({ ...formData, questions: newQuestions })
                                  }}
                                  className="w-4 h-4 text-emerald-600"
                                />
                                <Input
                                  value={option.textEn}
                                  onChange={(e) => updateOption(qIndex, oIndex, "textEn", e.target.value)}
                                  placeholder={`Option ${oIndex + 1} (English)`}
                                  className="flex-1"
                                />
                                <Input
                                  value={option.textAr}
                                  onChange={(e) => updateOption(qIndex, oIndex, "textAr", e.target.value)}
                                  placeholder={`خيار ${oIndex + 1} (Arabic)`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.questions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No questions yet. Click "Add Question" to start.
                      </div>
                    )}

                    <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg">
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        Status: {formData.questions.length} / {formData.numQuestions} questions added
                        {formData.questions.length >= formData.numQuestions ? (
                          <span className="ml-2 text-green-600 font-semibold">✓ Ready to publish</span>
                        ) : (
                          <span className="ml-2 text-red-600 font-semibold">⚠ Add more questions to publish</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!editingQuiz ? (
                    <Button
                      onClick={handleCreate}
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Create Quiz (Private)
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Publish
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz, index) => {
            const numQuestions = quiz.questions?.length || 0
            const points = numQuestions * 10
            const timeLimit = Math.round(numQuestions * 1.5)
            
            // Calculate difficulty based on number of questions
            let difficulty = "Beginner"
            if (numQuestions >= 11) {
              difficulty = "Advanced"
            } else if (numQuestions >= 6) {
              difficulty = "Intermediate"
            }

            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-emerald-100 dark:border-emerald-900 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? quiz.titleAr : quiz.titleEn}
                      </h3>
                      <Brain className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex gap-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                      {quiz.isPublished ? (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ✓ Published
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          🔒 Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{numQuestions}</div>
                    <div className="text-gray-600 dark:text-gray-300">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      {timeLimit} min
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {points}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Points</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(quiz)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(quiz.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredQuizzes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No quizzes found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your first quiz to get started
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
