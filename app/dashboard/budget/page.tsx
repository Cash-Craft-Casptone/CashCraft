"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Edit, Trash2, TrendingDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    budgetPlanning: "Budget Planning",
    myBudgets: "My Budgets",
    createBudget: "Create Budget",
    expenseTracking: "Expense Tracking",
    budgetOverview: "Budget Overview",
    activeBudgets: "Active Budgets",
    budgetProgress: "Budget Progress",
    addExpense: "Add Expense",
    editBudget: "Edit Budget",
    deleteBudget: "Delete Budget",
    budgetName: "Budget Name",
    budgetType: "Budget Type",
    monthly: "Monthly",
    yearly: "Yearly",
    totalBudget: "Total Budget",
    currency: "Currency",
    categories: "Categories",
    addCategory: "Add Category",
    categoryName: "Category Name",
    amount: "Amount",
    description: "Description",
    date: "Date",
    category: "Category",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    spent: "Spent",
    remaining: "Remaining",
    overBudget: "Over Budget",
    onTrack: "On Track",
    warning: "Warning",
    success: "Success",
    groceries: "Groceries",
    transportation: "Transportation",
    entertainment: "Entertainment",
    utilities: "Utilities",
    healthcare: "Healthcare",
    education: "Education",
    shopping: "Shopping",
    dining: "Dining",
    backToDashboard: "Back to Dashboard",
  },
  ar: {
    budgetPlanning: "تخطيط الميزانية",
    myBudgets: "ميزانياتي",
    createBudget: "إنشاء ميزانية",
    expenseTracking: "تتبع المصروفات",
    budgetOverview: "نظرة عامة على الميزانية",
    activeBudgets: "الميزانيات النشطة",
    budgetProgress: "تقدم الميزانية",
    addExpense: "إضافة مصروف",
    editBudget: "تعديل الميزانية",
    deleteBudget: "حذف الميزانية",
    budgetName: "اسم الميزانية",
    budgetType: "نوع الميزانية",
    monthly: "شهرية",
    yearly: "سنوية",
    totalBudget: "إجمالي الميزانية",
    currency: "العملة",
    categories: "الفئات",
    addCategory: "إضافة فئة",
    categoryName: "اسم الفئة",
    amount: "المبلغ",
    description: "الوصف",
    date: "التاريخ",
    category: "الفئة",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    spent: "المصروف",
    remaining: "المتبقي",
    overBudget: "تجاوز الميزانية",
    onTrack: "على المسار الصحيح",
    warning: "تحذير",
    success: "نجح",
    groceries: "البقالة",
    transportation: "المواصلات",
    entertainment: "الترفيه",
    utilities: "الخدمات",
    healthcare: "الرعاية الصحية",
    education: "التعليم",
    shopping: "التسوق",
    dining: "الطعام",
    backToDashboard: "العودة للوحة التحكم",
  },
}

// Mock data for frontend-only demo
const mockBudgets = [
  {
    id: 1,
    name: "January 2025 Budget",
    type: "monthly",
    totalBudget: 4000,
    currency: "EGP",
    categories: [
      { name: "groceries", budgeted: 1000, spent: 800 },
      { name: "transportation", budgeted: 500, spent: 300 },
      { name: "entertainment", budgeted: 400, spent: 450 },
      { name: "utilities", budgeted: 300, spent: 200 },
    ],
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    name: "2025 Annual Budget",
    type: "yearly",
    totalBudget: 48000,
    currency: "EGP",
    categories: [
      { name: "groceries", budgeted: 12000, spent: 800 },
      { name: "transportation", budgeted: 6000, spent: 300 },
      { name: "entertainment", budgeted: 4800, spent: 450 },
      { name: "utilities", budgeted: 3600, spent: 200 },
    ],
    createdAt: "2025-01-01",
  },
]

const mockExpenses = [
  { id: 1, description: "Grocery Shopping", amount: 150, category: "groceries", date: "2025-01-20", budgetId: 1 },
  { id: 2, description: "Gas Station", amount: 100, category: "transportation", date: "2025-01-19", budgetId: 1 },
  { id: 3, description: "Movie Tickets", amount: 80, category: "entertainment", date: "2025-01-18", budgetId: 1 },
  { id: 4, description: "Electricity Bill", amount: 120, category: "utilities", date: "2025-01-17", budgetId: 1 },
]

export default function BudgetPlanningPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "ar">("en")
  const [budgets, setBudgets] = useState(mockBudgets)
  const [expenses, setExpenses] = useState(mockExpenses)
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState(mockBudgets[0])

  const t = translations[currentLang]

  const [newBudget, setNewBudget] = useState({
    name: "",
    type: "monthly",
    totalBudget: "",
    currency: "EGP",
    categories: [
      { name: "groceries", budgeted: "" },
      { name: "transportation", budgeted: "" },
      { name: "entertainment", budgeted: "" },
      { name: "utilities", budgeted: "" },
    ],
  })

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "groceries",
    date: new Date().toISOString().split("T")[0],
    budgetId: selectedBudget.id,
  })

  const handleCreateBudget = () => {
    const budget = {
      id: budgets.length + 1,
      name: newBudget.name,
      type: newBudget.type,
      totalBudget: Number.parseInt(newBudget.totalBudget),
      currency: newBudget.currency,
      categories: newBudget.categories.map((cat) => ({
        name: cat.name,
        budgeted: Number.parseInt(cat.budgeted) || 0,
        spent: 0,
      })),
      createdAt: new Date().toISOString().split("T")[0],
    }

    setBudgets([...budgets, budget])
    setIsCreateBudgetOpen(false)
    setNewBudget({
      name: "",
      type: "monthly",
      totalBudget: "",
      currency: "EGP",
      categories: [
        { name: "groceries", budgeted: "" },
        { name: "transportation", budgeted: "" },
        { name: "entertainment", budgeted: "" },
        { name: "utilities", budgeted: "" },
      ],
    })
  }

  const handleAddExpense = () => {
    const expense = {
      id: expenses.length + 1,
      description: newExpense.description,
      amount: Number.parseInt(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      budgetId: newExpense.budgetId,
    }

    setExpenses([...expenses, expense])

    // Update budget spent amounts
    const updatedBudgets = budgets.map((budget) => {
      if (budget.id === expense.budgetId) {
        const updatedCategories = budget.categories.map((cat) => {
          if (cat.name === expense.category) {
            return { ...cat, spent: cat.spent + expense.amount }
          }
          return cat
        })
        return { ...budget, categories: updatedCategories }
      }
      return budget
    })

    setBudgets(updatedBudgets)
    setSelectedBudget(updatedBudgets.find((b) => b.id === selectedBudget.id) || selectedBudget)
    setIsAddExpenseOpen(false)
    setNewExpense({
      description: "",
      amount: "",
      category: "groceries",
      date: new Date().toISOString().split("T")[0],
      budgetId: selectedBudget.id,
    })
  }

  const calculateBudgetProgress = (budget: any) => {
    const totalSpent = budget.categories.reduce((sum: number, cat: any) => sum + cat.spent, 0)
    const totalBudgeted = budget.categories.reduce((sum: number, cat: any) => sum + cat.budgeted, 0)
    return totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0
  }

  return (
    <div className={`min-h-screen bg-background ${currentLang === "ar" ? "rtl font-cairo" : "ltr"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToDashboard}
              </Button>
            </Link>
            <h1 className={`text-xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>{t.budgetPlanning}</h1>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setCurrentLang(currentLang === "en" ? "ar" : "en")}>
            {currentLang === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t.budgetOverview}</TabsTrigger>
            <TabsTrigger value="budgets">{t.myBudgets}</TabsTrigger>
            <TabsTrigger value="expenses">{t.expenseTracking}</TabsTrigger>
          </TabsList>

          {/* Budget Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {budgets.map((budget) => (
                <Card key={budget.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{budget.name}</span>
                      <Badge variant={budget.type === "monthly" ? "default" : "secondary"}>
                        {t[budget.type as keyof typeof t]}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {budget.totalBudget.toLocaleString()} {budget.currency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t.budgetProgress}</span>
                          <span>{Math.round(calculateBudgetProgress(budget))}%</span>
                        </div>
                        <Progress value={calculateBudgetProgress(budget)} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        {budget.categories.slice(0, 3).map((category, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="capitalize">{t[category.name as keyof typeof t] || category.name}</span>
                            <span className={category.spent > category.budgeted ? "text-red-600" : "text-green-600"}>
                              {category.spent}/{category.budgeted} {budget.currency}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedBudget(budget)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* My Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{t.activeBudgets}</h2>
              <Link href="/dashboard/budget/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t.createBudget}
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {budgets.map((budget) => (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{budget.name}</CardTitle>
                        <CardDescription>
                          Created on {new Date(budget.createdAt).toLocaleDateString()} •{" "}
                          {budget.totalBudget.toLocaleString()} {budget.currency}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {budget.categories.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">
                              {t[category.name as keyof typeof t] || category.name}
                            </span>
                            <span className={category.spent > category.budgeted ? "text-red-600" : "text-green-600"}>
                              {((category.spent / category.budgeted) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={(category.spent / category.budgeted) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {category.spent} / {category.budgeted} {budget.currency}
                            </span>
                            <span>
                              {category.budgeted - category.spent > 0
                                ? `${category.budgeted - category.spent} left`
                                : "Over budget"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* Expense Tracking Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>{t.expenseTracking}</h2>
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t.addExpense}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.addExpense}</DialogTitle>
                    <DialogDescription>Add a new expense to track your spending</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">{t.description}</Label>
                      <Input
                        id="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder="e.g., Grocery Shopping"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">{t.amount}</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">{t.date}</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">{t.category}</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="groceries">{t.groceries}</SelectItem>
                          <SelectItem value="transportation">{t.transportation}</SelectItem>
                          <SelectItem value="entertainment">{t.entertainment}</SelectItem>
                          <SelectItem value="utilities">{t.utilities}</SelectItem>
                          <SelectItem value="healthcare">{t.healthcare}</SelectItem>
                          <SelectItem value="education">{t.education}</SelectItem>
                          <SelectItem value="shopping">{t.shopping}</SelectItem>
                          <SelectItem value="dining">{t.dining}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                      {t.cancel}
                    </Button>
                    <Button onClick={handleAddExpense}>{t.save}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest spending activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()} •{" "}
                              <span className="capitalize">
                                {t[expense.category as keyof typeof t] || expense.category}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">
                            -{expense.amount} {selectedBudget.currency}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
