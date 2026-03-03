"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { apiCreatePlan, getAuthToken } from "@/lib/api"
import { useApp } from "@/contexts/AppContext"

const translations = {
  en: {
    title: "Create Budget Plan",
    subtitle: "Set up a new budget plan to track your spending.",
    backToBudgets: "Back to Budgets",
    budgetName: "Budget Name",
    budgetNamePlaceholder: "e.g., January 2025 Budget",
    budgetType: "Budget Type",
    monthly: "Monthly",
    yearly: "Yearly",
    currency: "Currency",
    totalIncome: "Total Income (optional)",
    description: "Description (optional)",
    descriptionPlaceholder: "Short description of this budget...",
    createButton: "Create Budget",
  },
  ar: {
    title: "إنشاء خطة ميزانية",
    subtitle: "قم بإعداد خطة ميزانية جديدة لتتبع نفقاتك.",
    backToBudgets: "العودة للميزانيات",
    budgetName: "اسم الميزانية",
    budgetNamePlaceholder: "مثال: ميزانية يناير 2025",
    budgetType: "نوع الميزانية",
    monthly: "شهرية",
    yearly: "سنوية",
    currency: "العملة",
    totalIncome: "إجمالي الدخل (اختياري)",
    description: "الوصف (اختياري)",
    descriptionPlaceholder: "وصف قصير لهذه الميزانية...",
    createButton: "إنشاء الميزانية",
  },
}

export default function CreateBudgetPage() {
  const router = useRouter()
  const { language } = useApp()
  const { toast } = useToast()

  const t = translations[language] ?? translations.en

  const [name, setName] = useState("")
  const [type, setType] = useState<"monthly" | "yearly">("monthly")
  const [currency, setCurrency] = useState("EGP")
  const [totalIncome, setTotalIncome] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const trimmedName = name.trim()
    if (!trimmedName) {
      toast({
        title: "Missing budget name",
        description: "Please enter a name for your budget.",
        variant: "destructive",
      })
      return
    }

    const token = getAuthToken()
    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please sign in again to create a budget.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("[CreateBudget] Calling apiCreatePlan", { trimmedName, type, currency })

      await apiCreatePlan(trimmedName, type, currency, token)

      toast({
        title: "Budget created",
        description: "Your budget plan was created successfully.",
      })

      router.push("/dashboard/budget")
    } catch (error: any) {
      console.error("[CreateBudget] Failed", error)
      toast({
        title: "Failed to create budget",
        description: error?.message || "Please check that the backend is running on http://localhost:5005.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen bg-background ${language === "ar" ? "rtl font-cairo" : "ltr"}`}>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/budget">
              <Button variant="ghost" size="sm" type="button">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToBudgets}
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="budget-name">{t.budgetName}</Label>
                <Input
                  id="budget-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.budgetNamePlaceholder}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-type">{t.budgetType}</Label>
                  <Select value={type} onValueChange={(val: "monthly" | "yearly") => setType(val)}>
                    <SelectTrigger id="budget-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t.monthly}</SelectItem>
                      <SelectItem value="yearly">{t.yearly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">{t.currency}</Label>
                  <Select value={currency} onValueChange={(val) => setCurrency(val)}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">EGP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total-income">{t.totalIncome}</Label>
                <Input
                  id="total-income"
                  type="number"
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  <Check className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating..." : t.createButton}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
