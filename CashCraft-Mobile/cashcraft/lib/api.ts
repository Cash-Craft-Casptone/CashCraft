// CashCraft Mobile API Client
// Connects to: https://cashcraft.runasp.net/api

const API_BASE = "https://cashcraft.runasp.net/api"

async function request<T>(
  endpoint: string,
  options: { method?: string; body?: any; token?: string } = {}
): Promise<T> {
  const { method = "GET", body, token } = options
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return {} as T

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const d = await res.json(); msg = d.message || d.error || msg } catch {}
    throw new Error(msg)
  }

  return res.json()
}

// ===== AUTH =====
export const apiLogin = (email: string, password: string) =>
  request<{ accessToken: string; refreshToken: string }>("Auth/login", { method: "POST", body: { email, password } })

export const apiRegister = (email: string, username: string, password: string, displayName: string, phoneNumber: string) =>
  request<{ accessToken: string; refreshToken: string }>("Auth/register", { method: "POST", body: { email, username, password, displayName, phoneNumber } })

export const apiGoogleAuth = (idToken: string) =>
  request<{ accessToken: string; refreshToken: string }>("Auth/google", { method: "POST", body: { idToken } })

export const apiGetCurrentUser = (token: string) =>
  request<{ id: string; email: string; username: string; displayName: string; role: string; isPremium: boolean; createdAt: string }>("Users/me", { token })

// ===== ARTICLES =====
export interface Article {
  id: string; slug: string; titleEn: string; titleAr: string
  descriptionEn?: string; descriptionAr?: string; coverUrl?: string
  bodyEn?: string; bodyAr?: string; createdAt: string
}
export const apiGetArticles = () => request<Article[]>("Articles")
export const apiGetArticle = (id: string) => request<Article>(`Articles/${id}`)

// ===== VIDEOS =====
export interface Video {
  id: string; slug: string; titleEn: string; titleAr: string
  descriptionEn?: string; descriptionAr?: string; coverUrl?: string
  url: string; thumbnailUrl?: string; durationSec?: number; createdAt: string
}
export const apiGetVideos = () => request<Video[]>("Videos")

// ===== QUIZZES =====
export interface QuizOption { id: string; textEn: string; textAr: string; isCorrect: boolean }
export interface QuizQuestion { id: string; textEn: string; textAr: string; options: QuizOption[] }
export interface Quiz {
  id: string; slug: string; titleEn: string; titleAr: string
  isPublished: boolean; questions: QuizQuestion[]; createdAt: string
}
export const apiGetQuizzes = (token?: string) => request<Quiz[]>("Quizzes", { token })

// ===== BUDGET PLANS =====
export interface BudgetCategory { id: string; name: string; budgetedAmount: number; colorHex: string }
export interface BudgetPlan { id: string; name: string; type: string; currency: string; createdAt: string; categories: BudgetCategory[] }

export const apiGetPlans = (token: string) => request<BudgetPlan[]>("Budgets/plans", { token })
export const apiCreatePlan = (name: string, type: string, currency: string, token: string) =>
  request<BudgetPlan>("Budgets/plans", { method: "POST", body: { name, type, currency, createdAt: new Date().toISOString() }, token })
export const apiDeletePlan = (planId: string, token: string) =>
  request(`Budgets/plans/${planId}`, { method: "DELETE", token })

export const apiCreateCategory = (planId: string, name: string, budgetedAmount: number, colorHex: string, token: string) =>
  request<BudgetCategory>(`Budgets/plans/${planId}/categories`, { method: "POST", body: { name, budgetedAmount, colorHex }, token })
export const apiDeleteCategory = (categoryId: string, token: string) =>
  request(`Budgets/categories/${categoryId}`, { method: "DELETE", token })
export const apiUpdateCategory = (categoryId: string, name: string, budgetedAmount: number, token: string) =>
  request(`Budgets/categories/${categoryId}`, { method: "PUT", body: { name, budgetedAmount }, token })

// ===== EXPENSES =====
export interface Expense { id: string; amount: number; description: string; date: string }
export const apiGetExpenses = (categoryId: string, token: string) =>
  request<Expense[]>(`Budgets/categories/${categoryId}/expenses`, { token })
export const apiCreateExpense = (categoryId: string, amount: number, description: string, date: string, token: string) =>
  request<{ id: string }>(`Budgets/categories/${categoryId}/expenses`, { method: "POST", body: { amount, description, date }, token })
export const apiDeleteExpense = (categoryId: string, expenseId: string, token: string) =>
  request(`Budgets/categories/${categoryId}/expenses/${expenseId}`, { method: "DELETE", token })

// ===== INCOME =====
export const apiGetIncome = (planId: string, token: string) =>
  request<{ totalIncome: number; netSalary: number }>(`Budgets/plans/${planId}/income`, { token })
export const apiSaveIncome = (planId: string, totalIncome: number, netSalary: number, token: string) =>
  request(`Budgets/plans/${planId}/income`, { method: "POST", body: { totalIncome, netSalary }, token })

// ===== FEEDBACK =====
export const apiSubmitFeedback = (rating: number, message: string, category: string, token: string) =>
  request<{ message: string; id: string }>("feedback", { method: "POST", body: { rating, message, category }, token })
export const apiGetMyFeedback = (token: string) =>
  request<Array<{ id: string; rating: number; message: string; category: string; createdAt: string }>>("feedback/mine", { token })

// ===== RESET PASSWORD =====
export const apiResetPassword = (email: string, newPassword: string) =>
  request("Auth/reset-password", { method: "POST", body: { email, newPassword } })
