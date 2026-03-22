"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Lightbulb,
  Car,
  Home,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Heart,
  Shirt,
  MoreHorizontal,
  AlertCircle,
  Clock,
  BookOpen,
  ShoppingBag,
  Zap,
  Shield,
  PiggyBank,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { apiGetPlans, apiCreatePlan, apiCreateCategory, apiHealthCheck, getAuthToken, apiDeletePlan } from "@/lib/api"
import { AddCategoriesModal } from "@/components/AddCategoriesModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"

// Types
interface BudgetPlan {
  id: string
  name: string
  type: "monthly" | "yearly"
  currency: "USD" | "EUR" | "EGP"
  categories: BudgetCategory[]
  totalBudget: number
  totalSpent: number
  createdAt: Date
  isActive: boolean
}

interface BudgetCategory {
  id: string
  name: string
  icon: any
  budgetAmount: number
  spentAmount: number
  color: string
  isCustom?: boolean
}

interface DailyExpense {
  id: string
  categoryId: string
  amount: number
  description: string
  date: Date
  planId: string
}

// Mock data
const defaultCategories = [
  { name: "Food", icon: ShoppingCart, color: "#ef4444" },
  { name: "Transport", icon: Car, color: "#3b82f6" },
  { name: "Housing", icon: Home, color: "#10b981" },
  { name: "Entertainment", icon: Gamepad2, color: "#f59e0b" },
  { name: "Education", icon: GraduationCap, color: "#8b5cf6" },
  { name: "Healthcare", icon: Heart, color: "#ec4899" },
  { name: "Clothing", icon: Shirt, color: "#06b6d4" },
  { name: "Other", icon: MoreHorizontal, color: "#6b7280" },
]

const currencySymbols = {
  USD: "$",
  EUR: "€",
  EGP: "ج.م",
}

// Helper function to format numbers in English numerals regardless of language
const formatNumber = (num: number) => {
  return num.toLocaleString('en-US')
}

// Helper function to translate category names
const translateCategoryName = (name: string, language: string) => {
  const categoryTranslations: { [key: string]: { en: string; ar: string } } = {
    'Food & Dining': { en: 'Food & Dining', ar: 'الطعام والمطاعم' },
    'Transportation': { en: 'Transportation', ar: 'المواصلات' },
    'Housing': { en: 'Housing', ar: 'السكن' },
    'Entertainment': { en: 'Entertainment', ar: 'الترفيه' },
    'Healthcare': { en: 'Healthcare', ar: 'الرعاية الصحية' },
    'Education': { en: 'Education', ar: 'التعليم' },
    'Shopping': { en: 'Shopping', ar: 'التسوق' },
    'Utilities': { en: 'Utilities', ar: 'الفواتير' },
    'Insurance': { en: 'Insurance', ar: 'التأمين' },
    'Savings': { en: 'Savings', ar: 'المدخرات' },
  }
  
  // Check if the name exists in translations
  if (categoryTranslations[name]) {
    return language === 'ar' ? categoryTranslations[name].ar : categoryTranslations[name].en
  }
  
  // If not found, return the original name
  return name
}

// Helper function to get icon component from name
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    ShoppingCart,
    Car,
    Home,
    Gamepad2,
    GraduationCap,
    Heart,
    Shirt,
    MoreHorizontal,
    Target,
    TrendingDown,
    DollarSign,
    PieChart,
    BarChart3,
    Lightbulb,
    AlertCircle,
    Clock,
  }
  return iconMap[iconName] || MoreHorizontal
}

const savingTips = {
  Food: {
    en: [
      "Cook at home more often to save 40-60% on food costs",
      "Plan your meals weekly and make a shopping list",
      "Buy generic brands instead of name brands",
    ],
    ar: [
      "اطبخ في المنزل أكثر لتوفير 40-60% من تكاليف الطعام",
      "خطط لوجباتك أسبوعياً واصنع قائمة تسوق",
      "اشترِ العلامات التجارية العامة بدلاً من الماركات",
    ]
  },
  Transport: {
    en: [
      "Use public transportation or carpool to reduce fuel costs",
      "Walk or bike for short distances",
      "Combine multiple errands into one trip",
    ],
    ar: [
      "استخدم المواصلات العامة أو شارك السيارة لتقليل تكاليف الوقود",
      "امشِ أو استخدم الدراجة للمسافات القصيرة",
      "اجمع عدة مهام في رحلة واحدة",
    ]
  },
  Housing: {
    en: [
      "Reduce energy consumption by using LED bulbs",
      "Set thermostat 2-3 degrees lower in winter",
      "Fix leaks promptly to avoid water waste",
    ],
    ar: [
      "قلل استهلاك الطاقة باستخدام مصابيح LED",
      "اضبط الحرارة 2-3 درجات أقل في الشتاء",
      "أصلح التسريبات فوراً لتجنب هدر المياه",
    ]
  },
  Entertainment: {
    en: [
      "Look for free community events and activities",
      "Use streaming services instead of cable TV",
      "Take advantage of happy hour and discount days",
    ],
    ar: [
      "ابحث عن الفعاليات والأنشطة المجتمعية المجانية",
      "استخدم خدمات البث بدلاً من التلفزيون الكابلي",
      "استفد من ساعات التخفيض وأيام الخصومات",
    ]
  },
  Education: {
    en: [
      "Use free online resources and libraries",
      "Buy used textbooks or rent them",
      "Apply for scholarships and grants",
    ],
    ar: [
      "استخدم الموارد المجانية عبر الإنترنت والمكتبات",
      "اشترِ الكتب المستعملة أو استأجرها",
      "تقدم للمنح الدراسية والإعانات",
    ]
  },
  Healthcare: {
    en: [
      "Use preventive care to avoid costly treatments",
      "Compare prices for medications and procedures",
      "Consider generic medications when appropriate",
    ],
    ar: [
      "استخدم الرعاية الوقائية لتجنب العلاجات المكلفة",
      "قارن أسعار الأدوية والإجراءات الطبية",
      "فكر في الأدوية العامة عند الإمكان",
    ]
  },
  Clothing: {
    en: [
      "Shop during sales and clearance events",
      "Buy quality items that last longer",
      "Consider thrift stores and consignment shops",
    ],
    ar: [
      "تسوق خلال التخفيضات وعروض التصفية",
      "اشترِ منتجات عالية الجودة تدوم أطول",
      "فكر في متاجر الملابس المستعملة",
    ]
  },
  Shopping: {
    en: [
      "Track all expenses to identify spending patterns",
      "Set up automatic savings transfers",
      "Review and cancel unused subscriptions",
    ],
    ar: [
      "تتبع جميع النفقات لتحديد أنماط الإنفاق",
      "قم بإعداد تحويلات ادخار تلقائية",
      "راجع وألغِ الاشتراكات غير المستخدمة",
    ]
  },
  Other: {
    en: [
      "Track all expenses to identify spending patterns",
      "Set up automatic savings transfers",
      "Review and cancel unused subscriptions",
    ],
    ar: [
      "تتبع جميع النفقات لتحديد أنماط الإنفاق",
      "قم بإعداد تحويلات ادخار تلقائية",
      "راجع وألغِ الاشتراكات غير المستخدمة",
    ]
  },
}

export default function Dashboard() {
  const [plans, setPlans] = useState<BudgetPlan[]>([])
  const [activePlan, setActivePlan] = useState<BudgetPlan | null>(null)
  const [expenses, setExpenses] = useState<DailyExpense[]>([])
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [isIncomeOpen, setIsIncomeOpen] = useState(false)
  const [incomeData, setIncomeData] = useState<{ totalIncome: number; netSalary: number }>({ totalIncome: 0, netSalary: 0 })
  const [incomeForm, setIncomeForm] = useState({ totalIncome: "", netSalary: "" })
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })
  
  const router = useRouter()
  const { language, isDark, refreshUser, currentUser } = useApp()
  const t = translations[language]

  // Create Plan Form State
  const [newPlan, setNewPlan] = useState({
    name: "",
    type: "monthly" as "monthly" | "yearly",
    currency: "EGP" as "USD" | "EUR" | "EGP",
    planType: "normal" as "ai" | "normal",
    categories: [] as any[],
  })

  // Add Expense Form State
  const [newExpense, setNewExpense] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Load user data and plans from localStorage
  useEffect(() => {
    console.log("Dashboard - Loading user data and plans from localStorage")
    const userData = localStorage.getItem("cashcraft_user")
    
    if (userData) {
      console.log("Dashboard - User data found, loading plans from localStorage")
      
      // Load plans from database first, then localStorage as fallback
      const loadPlans = async () => {
        try {
          console.log("📡 Attempting to load plans from database...")
          
          const accessToken = localStorage.getItem('cashcraft_accessToken')
          if (accessToken) {
            try {
              const apiPlans = await apiGetPlans(accessToken)
              console.log("✅ Plans loaded from database:", apiPlans)
              
              if (apiPlans && apiPlans.length > 0) {
                // Transform the data to match frontend expectations
                const transformedPlans = transformApiPlans(apiPlans)
                
                setPlans(transformedPlans)
                setActivePlan(transformedPlans[0])
                console.log("✅ Active plan set from database:", transformedPlans[0])
                return
              } else {
                console.log("📭 No plans found in database")
                setPlans([])
                setActivePlan(null)
                return
              }
            } catch (apiError) {
              console.log("❌ Database load failed:", apiError)
              // Don't fall back to localStorage for new accounts
              console.log("📭 No plans found - database unavailable")
              setPlans([])
              setActivePlan(null)
              return
            }
          } else {
            console.log("🔑 No access token found")
            setPlans([])
            setActivePlan(null)
            return
          }
        } catch (error: any) {
          console.error("❌ Error loading plans:", error)
          console.error("❌ Error details:", {
            message: error?.message,
            stack: error?.stack
          })
          
          // Final fallback: Show test data only for testbudget@test.com account
          console.log("🔄 Falling back to test data...")
          
          const userData = JSON.parse(localStorage.getItem("cashcraft_user") || "{}")
          const isTestAccount = userData.email === "testbudget@test.com"
          
          if (isTestAccount) {
            console.log("✅ Loading test data for testbudget@test.com")
            const testPlan: BudgetPlan = {
              id: "test-plan-1",
              name: "Monthly Budget Plan",
              type: "monthly" as "monthly" | "yearly",
              currency: "EGP" as "USD" | "EUR" | "EGP",
              totalBudget: 5000,
              totalSpent: 1850,
              createdAt: new Date(),
              isActive: true,
              categories: [
                {
                  id: "cat-1",
                  name: "Food",
                  icon: ShoppingCart,
                  budgetAmount: 1500,
                  spentAmount: 250,
                  color: "#ef4444"
                },
                {
                  id: "cat-2",
                  name: "Transport",
                  icon: Car,
                  budgetAmount: 800,
                  spentAmount: 100,
                  color: "#3b82f6"
                },
                {
                  id: "cat-3",
                  name: "Housing",
                  icon: Home,
                  budgetAmount: 2000,
                  spentAmount: 1500,
                  color: "#10b981"
                },
                {
                  id: "cat-4",
                  name: "Entertainment",
                  icon: Gamepad2,
                  budgetAmount: 500,
                  spentAmount: 0,
                  color: "#f59e0b"
                },
                {
                  id: "cat-5",
                  name: "Other",
                  icon: MoreHorizontal,
                  budgetAmount: 200,
                  spentAmount: 0,
                  color: "#6b7280"
                }
              ]
            }
            
            setPlans([testPlan])
            setActivePlan(testPlan)
            console.log("✅ Test data loaded for test account")
          } else {
            console.log("📭 No plans found - new user account")
            setPlans([])
            setActivePlan(null)
          }
        }
      }
      
      loadPlans()
    } else {
      console.log("Dashboard - No user data found, redirecting to login")
      localStorage.removeItem('cashcraft_accessToken')
      localStorage.removeItem('cashcraft_refreshToken')
      localStorage.removeItem('cashcraft_user')
      window.location.href = '/'
    }
  }, [])

  // Load income data when active plan changes
  useEffect(() => {
    if (activePlan) {
      const saved = localStorage.getItem(`cashcraft_income_${activePlan.id}`)
      if (saved) {
        setIncomeData(JSON.parse(saved))
      } else {
        setIncomeData({ totalIncome: 0, netSalary: 0 })
      }
    }
  }, [activePlan?.id])
  const [isAddDetailsOpen, setIsAddDetailsOpen] = useState(false)
  const [isCreatingPlan, setIsCreatingPlan] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState<Array<{role: 'ai' | 'user', message: string}>>([])
  const [userInput, setUserInput] = useState("")
  const [aiChatStep, setAiChatStep] = useState(0)
  const [aiUserProfile, setAiUserProfile] = useState({
    occupation: "",
    income: "",
    familySize: "",
    goals: ""
  })

  // Generate AI budget categories from conversation
  const generateAIBudgetCategories = async (planName: string, planType: "monthly" | "yearly", currency: string, conversation: any[]) => {
    try {
      console.log("🤖 Generating AI budget from conversation...")
      
      const response = await fetch('/api/ai-generate-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation,
          planType,
          currency
        })
      })

      if (!response.ok) {
        throw new Error('Budget generation failed')
      }

      const data = await response.json()
      console.log("✅ AI categories generated:", data.categories)
      
      return data.categories
    } catch (error: any) {
      console.error("❌ AI generation failed:", error)
      throw error
    }
  }

  // AI Chat handler with 100% real AI conversation via API
  const handleAIChatMessage = async (message: string) => {
    // Add user message
    setAiChatMessages(prev => [...prev, { role: 'user', message }])
    setUserInput("")

    try {
      // Call our API endpoint (which calls Gemini)
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...aiChatMessages, { role: 'user', message }],
          userProfile: aiUserProfile
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', response.status, errorData)
        throw new Error(`AI API call failed: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()

      // Add AI response
      setTimeout(() => {
        setAiChatMessages(prev => [...prev, { role: 'ai', message: data.message }])

        // If AI is done gathering info, generate budget
        if (data.isDone) {
          setTimeout(() => {
            handleCreateAIPlan()
          }, 1500)
        }
      }, 800)

    } catch (error: any) {
      console.error("AI chat error:", error)
      setAiChatMessages(prev => [...prev, { 
        role: 'ai', 
        message: "I'm having trouble connecting right now. Could you please try again? Error: " + error.message
      }])
    }
  }

  // Extract user profile from conversation using AI
  const extractUserProfileFromConversation = (conversation: Array<{role: string, message: string}>) => {
    const fullConversation = conversation.map(msg => msg.message).join(' ')
    
    // Simple extraction (you can make this smarter with another AI call)
    return {
      occupation: fullConversation.match(/(?:i am|i'm|occupation|work as|job is)\s+(?:a\s+)?(\w+)/i)?.[1] || "Not specified",
      income: fullConversation.match(/(?:income|earn|salary|make)\s+(?:is\s+)?([^.]+)/i)?.[1] || "Not specified",
      familySize: fullConversation.match(/(\d+)\s+(?:people|person|member)/i)?.[1] || "Not specified",
      goals: fullConversation.match(/(?:goal|want to|plan to|saving for)\s+([^.]+)/i)?.[1] || "Not specified"
    }
  }

  // Start AI Chat with 100% AI
  const startAIChat = () => {
    setIsCreatePlanOpen(false)
    setIsAIChatOpen(true)
    setAiChatMessages([
      { 
        role: 'ai', 
        message: "Hi! 👋 I'm your AI financial advisor. I'll help you create a personalized budget plan by asking you some questions about your lifestyle and financial situation. Let's start - what do you do for a living?" 
      }
    ])
    setAiChatStep(0)
    setAiUserProfile({ occupation: "", income: "", familySize: "", goals: "" })
  }

  // Create AI Plan after chat
  const handleCreateAIPlan = async () => {
    const accessToken = getAuthToken()
    
    if (!accessToken) {
      console.error("No access token - user needs to log in")
      return
    }

    setIsCreatingPlan(true)

    try {
      // Create the plan
      const savedPlan = await apiCreatePlan(
        newPlan.name,
        newPlan.type,
        newPlan.currency,
        accessToken
      )
      
      console.log("✅ Plan created successfully:", savedPlan)

      // Generate AI categories from the entire conversation
      try {
        const aiCategories = await generateAIBudgetCategories(
          newPlan.name,
          newPlan.type,
          newPlan.currency,
          aiChatMessages
        )
        
        console.log("✅ AI categories generated:", aiCategories)
        
        // Add AI-generated categories to the plan
        for (const category of aiCategories) {
          await apiCreateCategory(
            savedPlan.id,
            category.name,
            category.budgetAmount,
            category.color,
            accessToken
          )
        }
        
        setAiChatMessages(prev => [...prev, { 
          role: 'ai', 
          message: "✅ Your personalized budget plan has been created successfully! Check your dashboard to see it." 
        }])
        
        setTimeout(() => {
          setIsAIChatOpen(false)
          setAiChatMessages([])
          
          // Reset form
          setNewPlan({
            name: "",
            type: "monthly",
            currency: "EGP",
            planType: "normal",
            categories: []
          })
          
          // Reload plans
          apiGetPlans(accessToken).then(apiPlans => {
            if (apiPlans && apiPlans.length > 0) {
              const transformedPlans = transformApiPlans(apiPlans)
              setPlans(transformedPlans)
              setActivePlan(transformedPlans[transformedPlans.length - 1])
            }
          })
        }, 2000)
        
      } catch (aiError: any) {
        console.error("❌ AI generation failed:", aiError)
        
        // Fallback: Use default categories
        const defaultCategories = [
          { name: "Food & Groceries", budgetAmount: 1500, color: "#ef4444" },
          { name: "Transportation", budgetAmount: 800, color: "#3b82f6" },
          { name: "Housing & Utilities", budgetAmount: 2000, color: "#10b981" },
          { name: "Entertainment", budgetAmount: 500, color: "#f59e0b" },
          { name: "Healthcare", budgetAmount: 400, color: "#ec4899" },
          { name: "Shopping", budgetAmount: 600, color: "#06b6d4" },
          { name: "Savings", budgetAmount: 1000, color: "#8b5cf6" },
        ]
        
        for (const category of defaultCategories) {
          await apiCreateCategory(
            savedPlan.id,
            category.name,
            category.budgetAmount,
            category.color,
            accessToken
          )
        }
        
        setAiChatMessages(prev => [...prev, { 
          role: 'ai', 
          message: "Your plan has been created with default categories. You can customize them anytime!" 
        }])
        
        setTimeout(() => {
          setIsAIChatOpen(false)
          setAiChatMessages([])
        }, 2000)
      }
      
    } catch (error: any) {
      console.error("❌ Plan creation failed:", error)
      setAiChatMessages(prev => [...prev, { 
        role: 'ai', 
        message: "Sorry, there was an error creating your plan. Please try again." 
      }])
    } finally {
      setIsCreatingPlan(false)
    }
  }

  // Helper function to transform API data to frontend format
  const transformApiPlans = (apiPlans: any[]) => {
    return apiPlans.map(plan => ({
      ...plan,
      totalBudget: plan.categories.reduce((sum: number, cat: any) => sum + cat.budgetedAmount, 0),
      totalSpent: 0, // We'll add this later when we implement expenses
      isActive: true,
      categories: plan.categories.map((category: any) => {
        // Assign appropriate icons based on category name
        let icon = ShoppingCart; // Default
        const name = category.name.toLowerCase();
        
        if (name.includes('food') || name.includes('dining') || name.includes('restaurant')) {
          icon = ShoppingCart;
        } else if (name.includes('transport') || name.includes('car') || name.includes('bus')) {
          icon = Car;
        } else if (name.includes('home') || name.includes('house') || name.includes('rent')) {
          icon = Home;
        } else if (name.includes('entertainment') || name.includes('movie') || name.includes('game')) {
          icon = Gamepad2;
        } else if (name.includes('health') || name.includes('medical')) {
          icon = Heart;
        } else if (name.includes('education') || name.includes('school') || name.includes('book')) {
          icon = BookOpen;
        } else if (name.includes('shopping') || name.includes('clothes')) {
          icon = ShoppingBag;
        } else if (name.includes('utility') || name.includes('electric') || name.includes('water')) {
          icon = Zap;
        } else if (name.includes('insurance')) {
          icon = Shield;
        } else if (name.includes('saving')) {
          icon = PiggyBank;
        }
        
        return {
          ...category,
          budgetAmount: category.budgetedAmount,
          color: category.colorHex,
          spentAmount: 0, // We'll add this later when we implement expenses
          icon: icon,
          isCustom: true
        }
      })
    }))
  }

  const handleCreatePlan = async () => {
    console.log("=== handleCreatePlan called ===")
    console.log("newPlan:", newPlan)
    
    if (!newPlan.name) {
      console.log("❌ Validation failed: plan name missing")
      return
    }

    console.log("✅ Validation passed")

    // Get access token
    const accessToken = getAuthToken()
    
    if (!accessToken) {
      console.log("🔑 No access token found")
      return
    }

    setIsCreatingPlan(true)

    try {
      console.log("📡 Creating plan in database...")
      
      // Create the plan (without categories)
      const savedPlan = await apiCreatePlan(
        newPlan.name,
        newPlan.type,
        newPlan.currency,
        accessToken
      )
      
      console.log("✅ Plan created successfully:", savedPlan)

      // If AI plan, generate categories automatically
      if (newPlan.planType === "ai") {
        console.log("🤖 Generating AI budget categories...")
        try {
          const aiCategories = await generateAIBudgetCategories(
            newPlan.name,
            newPlan.type,
            newPlan.currency,
            []  // Empty conversation for non-chat AI plans
          )
          
          console.log("✅ AI categories generated:", aiCategories)
          
          // Add AI-generated categories to the plan
          for (const category of aiCategories) {
            await apiCreateCategory(
              savedPlan.id,
              category.name,
              category.budgetAmount,
              category.color,
              accessToken
            )
          }
          
          console.log("✅ AI Plan created successfully with smart budget categories!")
        } catch (aiError: any) {
          console.error("❌ AI generation failed:", aiError)
          
          // Fallback: Use default categories
          console.log("🔄 Using fallback default categories...")
          const defaultCategories = [
            { name: "Food & Groceries", budgetAmount: 1500, color: "#ef4444" },
            { name: "Transportation", budgetAmount: 800, color: "#3b82f6" },
            { name: "Housing & Utilities", budgetAmount: 2000, color: "#10b981" },
            { name: "Entertainment", budgetAmount: 500, color: "#f59e0b" },
            { name: "Healthcare", budgetAmount: 400, color: "#ec4899" },
            { name: "Shopping", budgetAmount: 600, color: "#06b6d4" },
            { name: "Savings", budgetAmount: 1000, color: "#8b5cf6" },
          ]
          
          try {
            for (const category of defaultCategories) {
              await apiCreateCategory(
                savedPlan.id,
                category.name,
                category.budgetAmount,
                category.color,
                accessToken
              )
            }
            console.log("✅ Plan created with default budget categories (AI generation failed)")
          } catch (fallbackError) {
            console.error("❌ Fallback categories also failed:", fallbackError)
            console.log("⚠️ Plan created, but category generation failed")
          }
        }
      } else {
        console.log("✅ Plan created successfully!")
      }
      
      setIsCreatePlanOpen(false)
      
      // Reset the form
      setNewPlan({
        name: "",
        type: "monthly",
        currency: "EGP",
        planType: "normal",
        categories: []
      })
      
      // Reload plans from database
      try {
        const apiPlans = await apiGetPlans(accessToken)
        if (apiPlans && apiPlans.length > 0) {
          const transformedPlans = transformApiPlans(apiPlans)
          setPlans(transformedPlans)
          setActivePlan(transformedPlans[transformedPlans.length - 1])
        }
      } catch (reloadError) {
        console.error("Failed to reload plans:", reloadError)
      }
      
    } catch (error: any) {
      console.error("❌ Plan creation failed:", error)
      
      let errorMessage = "Failed to create plan. "
      
      if (error?.message?.includes("401") || error?.message?.includes("Unauthorized")) {
        errorMessage += "Authentication failed. Please log out and log back in."
        localStorage.removeItem('cashcraft_accessToken')
        localStorage.removeItem('cashcraft_refreshToken')
        localStorage.removeItem('cashcraft_user')
      } else if (error?.message?.includes("500")) {
        errorMessage += "Server error. Please try again later."
      } else if (error?.message?.includes("fetch")) {
        errorMessage += "Cannot connect to server. Please check if backend is running."
      } else {
        errorMessage += `Error: ${error?.message || 'Unknown error'}`
      }
      
      console.error("❌ Plan creation failed:", errorMessage)
    } finally {
      setIsCreatingPlan(false)
    }
  }

  const handleAddCategories = async (categories: Array<{ name: string; budgetAmount: number; color: string }>) => {
    if (!activePlan) {
      console.error("No plan selected for adding categories")
      return
    }

    const accessToken = getAuthToken()
    if (!accessToken) {
      console.error("Authentication required")
      return
    }

    try {
      console.log("📡 Adding categories to plan:", activePlan.id)
      
      // Add each category to the plan
      for (const category of categories) {
        if (category.name && category.budgetAmount) {
          await apiCreateCategory(
            activePlan.id,
            category.name,
            category.budgetAmount,
            category.color,
            accessToken
          )
          console.log(`✅ Category "${category.name}" added to plan`)
        }
      }
      
      console.log("✅ All categories added successfully!")
      // Removed alert - just close modal silently
      
      // Close modal
      setIsAddDetailsOpen(false)
      
      // Reload plans from database
      try {
        const apiPlans = await apiGetPlans(accessToken)
        if (apiPlans && apiPlans.length > 0) {
          // Transform the data to match frontend expectations
          const transformedPlans = transformApiPlans(apiPlans)
          
          setPlans(transformedPlans)
          // Keep the same active plan selected
          const updatedActivePlan = transformedPlans.find(p => p.id === activePlan.id)
          if (updatedActivePlan) {
            setActivePlan(updatedActivePlan)
          }
          console.log("✅ Plans reloaded from database")
        }
      } catch (reloadError) {
        console.error("❌ Failed to reload plans:", reloadError)
      }
      
    } catch (error: any) {
      console.error("❌ Failed to add categories:", error)
    }
  }

  const handleAddExpense = async () => {
    if (!newExpense.categoryId || !newExpense.amount || !activePlan) return

    const expense: DailyExpense = {
      id: Date.now().toString(),
      categoryId: newExpense.categoryId,
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date(newExpense.date),
      planId: activePlan.id,
    }

    try {
      // Save expense to database via API
      const response = await fetch('/api/budgets/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cashcraft_accessToken')}`
        },
        body: JSON.stringify({
          planId: activePlan.id,
          categoryId: newExpense.categoryId,
          amount: expense.amount,
          description: expense.description,
          date: expense.date.toISOString()
        })
      })

      if (response.ok) {
        const savedExpense = await response.json()
        expense.id = savedExpense.id // Use the ID from the database

    setExpenses([...expenses, expense])

    // Update category spent amount
    const updatedPlan = { ...activePlan }
    const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
    if (categoryIndex !== -1) {
      updatedPlan.categories[categoryIndex].spentAmount += expense.amount
      updatedPlan.totalSpent += expense.amount
      setActivePlan(updatedPlan)

      // Update plans array
      const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
      setPlans(updatedPlans)
    }

    setIsAddExpenseOpen(false)
    setNewExpense({
      categoryId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
      } else {
        console.error('Failed to save expense to database')
        // Still add the expense locally for now
        setExpenses([...expenses, expense])
        
        // Update category spent amount
        const updatedPlan = { ...activePlan }
        const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
        if (categoryIndex !== -1) {
          updatedPlan.categories[categoryIndex].spentAmount += expense.amount
          updatedPlan.totalSpent += expense.amount
          setActivePlan(updatedPlan)

          // Update plans array
          const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
          setPlans(updatedPlans)
        }

        setIsAddExpenseOpen(false)
        setNewExpense({
          categoryId: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        })
      }
    } catch (error) {
      console.error('Error saving expense:', error)
      // Still add the expense locally for now
      setExpenses([...expenses, expense])
      
      // Update category spent amount
      const updatedPlan = { ...activePlan }
      const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
      if (categoryIndex !== -1) {
        updatedPlan.categories[categoryIndex].spentAmount += expense.amount
        updatedPlan.totalSpent += expense.amount
        setActivePlan(updatedPlan)

        // Update plans array
        const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
        setPlans(updatedPlans)
      }

      setIsAddExpenseOpen(false)
      setNewExpense({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }


  const getRandomTip = (categoryName: string) => {
    // Map category names to tip keys
    const categoryMap: { [key: string]: string } = {
      'Food & Dining': 'Food',
      'الطعام والمطاعم': 'Food',
      'Transportation': 'Transport',
      'المواصلات': 'Transport',
      'Housing': 'Housing',
      'السكن': 'Housing',
      'Entertainment': 'Entertainment',
      'الترفيه': 'Entertainment',
      'Education': 'Education',
      'التعليم': 'Education',
      'Healthcare': 'Healthcare',
      'الرعاية الصحية': 'Healthcare',
      'Shopping': 'Shopping',
      'التسوق': 'Shopping',
      'Clothing': 'Clothing',
      'Utilities': 'Other',
      'الفواتير': 'Other',
    }
    
    const tipKey = categoryMap[categoryName] || 'Other'
    const tips = savingTips[tipKey as keyof typeof savingTips] || savingTips.Other
    const langTips = language === 'ar' ? tips.ar : tips.en
    return langTips[Math.floor(Math.random() * langTips.length)]
  }



  // Check if user is logged in
  if (!currentUser || !localStorage.getItem('cashcraft_accessToken')) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 pt-32">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-emerald-300 mb-4">
              {t.pleaseLogIn}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6">
              {t.needToLogIn}
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#6099a5] hover:bg-[#084f5a] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-8 py-3 text-lg"
            >
              {t.goToLogin}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Completely disable token validation - just check if user exists in localStorage
  useEffect(() => {
    const user = localStorage.getItem('cashcraft_user')
    if (!user) {
      console.log("No user data, redirecting to login")
      localStorage.removeItem('cashcraft_accessToken')
      localStorage.removeItem('cashcraft_refreshToken')
      localStorage.removeItem('cashcraft_user')
      window.location.href = '/'
    }
  }, [router])

  // If no active plan, show a simple message
  if (!activePlan) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 pt-32">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-emerald-300 mb-4">
              {t.noBudgetPlanFound}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-8">
              {t.createFirstBudget}
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsCreatePlanOpen(true)
              }}
              className="px-8 py-4 bg-[#6B9FAD] hover:bg-[#5A8A98] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg mx-auto cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.createBudgetPlan}
            </motion.button>
          </div>
        </div>

        {/* Create Plan Modal - MUST be here since we return early */}
        {isCreatePlanOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setIsCreatePlanOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Budget Plan</h2>
              
              {/* Plan Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly Budget 2025"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              {/* Currency */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Currency</label>
                <select
                  value={newPlan.currency}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, currency: e.target.value as "USD" | "EUR" | "EGP" }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="EGP">Egyptian Pound (ج.م)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              {/* Plan Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Plan Type</label>
                <select
                  value={newPlan.planType}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, planType: e.target.value as "ai" | "normal" }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="normal">Normal Plan</option>
                  <option value="ai">AI Plan</option>
                </select>
              </div>
              
              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, type: e.target.value as "monthly" | "yearly" }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCreatePlanOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Create Plan clicked from modal")
                    if (newPlan.planType === "ai") {
                      // Start AI chat instead of creating directly
                      startAIChat()
                    } else {
                      handleCreatePlan()
                    }
                  }}
                  disabled={!newPlan.name || isCreatingPlan}
                  className="px-4 py-2 bg-[#6B9FAD] hover:bg-[#5A8A98] text-white rounded-md shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPlan ? "Creating..." : newPlan.planType === "ai" ? "Start AI Chat" : "Create Plan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Chat Modal - Redesigned with Mint Green Theme */}
        {isAIChatOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden border-2 border-emerald-200 dark:border-emerald-800"
              style={{ height: '650px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header - Mint Green Gradient */}
              <div className="bg-[#6B9FAD] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI Budget Advisor</h2>
                      <p className="text-emerald-100 text-sm">Your personal financial assistant</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAIChatOpen(false)
                      setAiChatMessages([])
                      setIsCreatePlanOpen(true)
                    }}
                    disabled={isCreatingPlan}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Chat Messages - Improved Design */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/50 dark:to-gray-900">
                {aiChatMessages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                    )}
                    <div 
                      className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-emerald-100 dark:border-emerald-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center ml-2 flex-shrink-0">
                        <span className="text-white text-sm">👤</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isCreatingPlan && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-2">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-sm shadow-md border border-emerald-100 dark:border-emerald-900">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100 text-sm">Creating your personalized plan...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Chat Input - Mint Green Accent */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userInput.trim() && !isCreatingPlan) {
                        handleAIChatMessage(userInput.trim())
                      }
                    }}
                    placeholder="Type your answer here..."
                    disabled={isCreatingPlan}
                    className="flex-1 px-4 py-3 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <button
                    onClick={() => {
                      if (userInput.trim()) {
                        handleAIChatMessage(userInput.trim())
                      }
                    }}
                    disabled={!userInput.trim() || isCreatingPlan}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Press Enter to send • Be honest for the best results
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#084f5a] dark:text-emerald-400">{t.dashboard}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t.smartMoneyDesc}</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-6 py-3 border-2 border-[#6B9FAD] dark:border-[#6B9FAD] text-[#6B9FAD] dark:text-[#6B9FAD] hover:bg-[#6B9FAD]/10 dark:hover:bg-[#6B9FAD]/20 dark:hover:border-[#5A8A98] rounded-xl font-semibold transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.addExpense}
            </motion.button>
            {activePlan && (
            <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddDetailsOpen(true)}
              className="px-6 py-3 border-2 border-[#6B9FAD] dark:border-[#6B9FAD] text-[#6B9FAD] dark:text-[#6B9FAD] hover:bg-[#6B9FAD]/10 dark:hover:bg-[#6B9FAD]/20 dark:hover:border-[#5A8A98] rounded-xl font-semibold transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
                {language === 'ar' ? 'إضافة فئات' : 'Add Categories'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const confirmMsg = language === 'ar'
                  ? `هل أنت متأكد من حذف خطة "${activePlan.name}"؟ سيتم حذف جميع الفئات والنفقات المرتبطة بها.`
                  : `Are you sure you want to delete "${activePlan.name}"? All categories and expenses will be removed.`
                
                setConfirmDialog({
                  isOpen: true,
                  title: language === 'ar' ? 'حذف الخطة' : 'Delete Plan',
                  message: confirmMsg,
                  confirmText: language === 'ar' ? 'حذف' : 'Delete',
                  cancelText: language === 'ar' ? 'إلغاء' : 'Cancel',
                  isDanger: true,
                  onConfirm: async () => {
                    const token = localStorage.getItem('cashcraft_accessToken') || undefined
                    try {
                      console.log("🗑️ Deleting plan from backend:", activePlan.id)
                      await apiDeletePlan(activePlan.id, token)
                      console.log("✅ Plan deleted from backend successfully")
                      // Only remove from UI if backend deletion succeeded
                      const updatedPlans = plans.filter(p => p.id !== activePlan.id)
                      setPlans(updatedPlans)
                      if (updatedPlans.length > 0) {
                        setActivePlan(updatedPlans[0])
                      } else {
                        setActivePlan(null)
                      }
                      localStorage.setItem('cashcraft_plans', JSON.stringify(updatedPlans))
                      console.log(`✅ Plan "${activePlan.name}" deleted successfully`)
                    } catch (e: any) {
                      console.error("❌ Delete not supported by backend yet:", e?.message)
                      alert("Delete plan is not supported yet. Please contact the backend team to add DELETE /api/Budgets/plans/{id} endpoint.")
                    }
                  }
                })
              }}
              className="px-6 py-3 border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:border-red-300 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {language === 'ar' ? 'حذف الخطة' : 'Delete Plan'}
            </motion.button>
            </>
            )}
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Income Card - clickable to set income */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card
              className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => {
                setIncomeForm({ totalIncome: incomeData.totalIncome.toString(), netSalary: incomeData.netSalary.toString() })
                setIsIncomeOpen(true)
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{language === 'ar' ? 'إجمالي الدخل' : 'Total Income'}</p>
                    <p className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">
                      {incomeData.totalIncome > 0 ? `${currencySymbols[activePlan.currency]}${formatNumber(incomeData.totalIncome)}` : <span className="text-sm text-gray-400">Click to set</span>}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-500">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400">{language === 'ar' ? 'انقر للتعديل' : 'Click to edit'}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Net Salary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card
              className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => {
                setIncomeForm({ totalIncome: incomeData.totalIncome.toString(), netSalary: incomeData.netSalary.toString() })
                setIsIncomeOpen(true)
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{language === 'ar' ? 'صافي الراتب' : 'Net Salary'}</p>
                    <p className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">
                      {incomeData.netSalary > 0 ? `${currencySymbols[activePlan.currency]}${formatNumber(incomeData.netSalary)}` : <span className="text-sm text-gray-400">Click to set</span>}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-500">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  {incomeData.totalIncome > 0 && incomeData.netSalary > 0
                    ? `${Math.round((incomeData.netSalary / incomeData.totalIncome) * 100)}% of total income`
                    : language === 'ar' ? 'انقر للتعديل' : 'Click to edit'}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Remaining after expenses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{language === 'ar' ? 'المتبقي بعد المصروفات' : 'Remaining After Expenses'}</p>
                    <p className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">
                      {`${currencySymbols[activePlan.currency]}${formatNumber(activePlan.totalBudget - activePlan.totalSpent)}`}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-500">
                    <PiggyBank className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {activePlan.totalBudget > 0 ? `${Math.round(((activePlan.totalBudget - activePlan.totalSpent) / activePlan.totalBudget) * 100)}% remaining` : '0% remaining'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.monthlyExpenses}</p>
                    <p className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">{`${currencySymbols[activePlan.currency]}${formatNumber(activePlan.totalSpent)}`}</p>
                  </div>
                  <div className="p-3 rounded-full bg-red-500">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {t.budgetUsed}: {activePlan.totalBudget > 0 ? `${Math.round((activePlan.totalSpent / activePlan.totalBudget) * 100)}%` : '0%'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.totalBalance}</p>
                    <p className="text-2xl font-bold text-[#084f5a] dark:text-emerald-400">{`${currencySymbols[activePlan.currency]}${formatNumber(activePlan.totalBudget)}`}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-500">
                    <PieChart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {activePlan.categories.length} {language === 'ar' ? 'فئة' : 'categories'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Income Dialog */}
        <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
          <DialogContent className="sm:max-w-md dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">{language === 'ar' ? 'تعيين الدخل' : 'Set Income'}</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {language === 'ar' ? 'أدخل إجمالي دخلك وصافي راتبك' : 'Enter your total income and net salary'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="dark:text-gray-300">{language === 'ar' ? 'إجمالي الدخل' : 'Total Income'} ({currencySymbols[activePlan.currency]})</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={incomeForm.totalIncome}
                  onChange={e => setIncomeForm(f => ({ ...f, totalIncome: e.target.value }))}
                  className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{language === 'ar' ? 'صافي الراتب' : 'Net Salary'} ({currencySymbols[activePlan.currency]})</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={incomeForm.netSalary}
                  onChange={e => setIncomeForm(f => ({ ...f, netSalary: e.target.value }))}
                  className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <Button
                className="w-full bg-[#084f5a] hover:bg-[#063d47] text-white"
                onClick={() => {
                  const data = {
                    totalIncome: parseFloat(incomeForm.totalIncome) || 0,
                    netSalary: parseFloat(incomeForm.netSalary) || 0,
                  }
                  setIncomeData(data)
                  localStorage.setItem(`cashcraft_income_${activePlan.id}`, JSON.stringify(data))
                  setIsIncomeOpen(false)
                }}
              >
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <BarChart3 className="w-5 h-5 dark:text-emerald-400" />
                  {t.budget}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">{t.trackExpensesDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activePlan.categories.map((category, index) => {
                    const percentage = (category.spentAmount / category.budgetAmount) * 100
                    const isOverBudget = percentage > 100

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                              <category.icon className="w-5 h-5" style={{ color: category.color }} />
                            </div>
                            <div>
                              <h4 className="font-medium dark:text-gray-100">{translateCategoryName(category.name, language)}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                {currencySymbols[activePlan.currency]}
                                {formatNumber(category.spentAmount)} of {currencySymbols[activePlan.currency]}
                                {formatNumber(category.budgetAmount)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${isOverBudget ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-emerald-400"}`}>
                              {percentage.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {currencySymbols[activePlan.currency]}
                              {formatNumber(category.budgetAmount - category.spentAmount)} {language === 'ar' ? 'متبقي' : 'left'}
                            </p>
                          </div>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className="h-2"
                          style={{
                            backgroundColor: `${category.color}20`,
                          }}
                        />
                        {isOverBudget && (
                          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {language === 'ar' ? 'تجاوز الميزانية بمقدار' : 'Over budget by'} {currencySymbols[activePlan.currency]}
                            {formatNumber(parseFloat((category.spentAmount - category.budgetAmount).toFixed(2)))}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Money Saving Tips */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <Lightbulb className="w-5 h-5 dark:text-emerald-400" />
                  {t.boostKnowledge}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePlan.categories.slice(0, 3).map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-teal-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-teal-400 dark:border-emerald-500"
                    >
                      <h5 className="font-medium text-teal-800 dark:text-emerald-300 mb-1">{translateCategoryName(category.name, language)}</h5>
                      <p className="text-sm text-teal-700 dark:text-emerald-200">{getRandomTip(category.name)}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <Clock className="w-5 h-5 dark:text-emerald-400" />
                  {t.recentTransactions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 5).map((expense, index) => {
                    const category = activePlan.categories.find((cat) => cat.id === expense.categoryId)
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {category && (
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                              <category.icon className="w-4 h-4" style={{ color: category.color }} />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm dark:text-gray-100">{expense.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-300">{category ? translateCategoryName(category.name, language) : ''}</p>
                          </div>
                        </div>
                        <p className="font-medium text-red-500 dark:text-red-400">
                          -{currencySymbols[activePlan.currency]}
                          {formatNumber(expense.amount)}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Management Section */}
        {activePlan && (
          <div className="mt-8">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                      <PieChart className="w-5 h-5 dark:text-emerald-400" />
                      {language === 'ar' ? 'إدارة فئات الميزانية' : 'Manage Budget Categories'}
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      {language === 'ar' 
                        ? `إضافة أو تعديل أو إزالة فئات الميزانية لـ "${activePlan.name}"`
                        : `Add, edit, or remove budget categories for "${activePlan.name}"`
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activePlan.categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePlan.categories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="p-2 rounded-lg" 
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <category.icon 
                              className="w-5 h-5" 
                              style={{ color: category.color }} 
                            />
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-gray-100">{translateCategoryName(category.name, language)}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {currencySymbols[activePlan.currency]}{formatNumber(category.budgetAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              console.log("Edit category:", category.name)
                              // TODO: Implement edit functionality
                              console.log("Edit functionality coming soon")
                            }}
                          >
                            {language === 'ar' ? 'تعديل' : 'Edit'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => {
                              const translatedName = translateCategoryName(category.name, language)
                              const confirmMsg = language === 'ar'
                                ? `هل أنت متأكد من حذف "${translatedName}"؟`
                                : `Are you sure you want to remove "${translatedName}"?`
                              
                              setConfirmDialog({
                                isOpen: true,
                                title: language === 'ar' ? 'حذف الفئة' : 'Remove Category',
                                message: confirmMsg,
                                confirmText: language === 'ar' ? 'حذف' : 'Remove',
                                cancelText: language === 'ar' ? 'إلغاء' : 'Cancel',
                                isDanger: true,
                                onConfirm: () => {
                                  console.log("Removing category:", category.id)
                                  // Remove category from activePlan
                                  const updatedCategories = activePlan.categories.filter(c => c.id !== category.id)
                                  const updatedPlan = { ...activePlan, categories: updatedCategories }
                                  setActivePlan(updatedPlan)
                                  
                                  // Update plans array
                                  const updatedPlans = plans.map(p => 
                                    p.id === activePlan.id ? updatedPlan : p
                                  )
                                  setPlans(updatedPlans)
                                  
                                  // Save to localStorage
                                  localStorage.setItem('cashcraft_plans', JSON.stringify(updatedPlans))
                                  
                                  console.log(`✅ Category "${translatedName}" removed successfully`)
                                }
                              })
                            }}
                          >
                            {language === 'ar' ? 'حذف' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {language === 'ar' ? 'لا توجد فئات بعد' : 'No categories yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      {language === 'ar' 
                        ? 'أضف فئات الميزانية لبدء تتبع نفقاتك'
                        : 'Add budget categories to start tracking your expenses'
                      }
                    </p>
                    <Button
                      onClick={() => setIsAddDetailsOpen(true)}
                      className="bg-[#6099a5] hover:bg-[#084f5a] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'أضف فئتك الأولى' : 'Add Your First Category'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simple Create Plan Modal */}
        {isCreatePlanOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsCreatePlanOpen(false)}
          >
            <div 
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Create New Budget Plan</h2>
              
              {/* Plan Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly Budget 2025"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              {/* Currency */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={newPlan.currency}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, currency: e.target.value as "USD" | "EUR" | "EGP" }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="EGP">Egyptian Pound (ج.م)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              {/* Plan Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Plan Type</label>
                <select
                  value={newPlan.planType}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, planType: e.target.value as "ai" | "normal" }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="normal">Normal Plan</option>
                  <option value="ai">AI Plan</option>
                </select>
              </div>
              
              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Duration</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, type: e.target.value as "monthly" | "yearly" }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCreatePlanOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Create Plan clicked")
                    handleCreatePlan()
                  }}
                  disabled={!newPlan.name || isCreatingPlan}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-md shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isCreatingPlan ? "Creating..." : "Create Plan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Expense Dialog */}
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogContent className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add Daily Expense</DialogTitle>
              <DialogDescription className="text-base mt-2">Track your daily spending to stay within budget</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">Category</Label>
                <Select
                  value={newExpense.categoryId}
                  onValueChange={(value) => setNewExpense((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activePlan.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {translateCategoryName(category.name, language)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-medium">Amount ({currencySymbols[activePlan.currency]})</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What did you spend on?"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-medium">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-12"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddExpense}
                disabled={!newExpense.categoryId || !newExpense.amount}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-3 shadow-lg ${
                  !newExpense.categoryId || !newExpense.amount
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Categories Modal */}
        <AddCategoriesModal
          isOpen={isAddDetailsOpen}
          onClose={() => setIsAddDetailsOpen(false)}
          onSave={handleAddCategories}
          planName={newPlan.name || "Your Plan"}
        />

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          isDanger={confirmDialog.isDanger}
        />
      </div>
    </div>
  )
}
