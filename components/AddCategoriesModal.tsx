"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, ShoppingCart, Car, Home, Gamepad2, Heart, BookOpen, ShoppingBag, Zap, Shield, PiggyBank } from "lucide-react"
import { useApp } from "@/contexts/AppContext"

interface Category {
  name: string
  budgetAmount: number
  color: string
  icon?: any
}

interface AddCategoriesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categories: Category[]) => void
  planName: string
}

const predefinedCategories = [
  { nameEn: "Food & Dining", nameAr: "الطعام والمطاعم", color: "#10b981", icon: ShoppingCart },
  { nameEn: "Transportation", nameAr: "المواصلات", color: "#0ea5e9", icon: Car },
  { nameEn: "Housing", nameAr: "السكن", color: "#8b5cf6", icon: Home },
  { nameEn: "Entertainment", nameAr: "الترفيه", color: "#f59e0b", icon: Gamepad2 },
  { nameEn: "Healthcare", nameAr: "الرعاية الصحية", color: "#ef4444", icon: Heart },
  { nameEn: "Education", nameAr: "التعليم", color: "#06b6d4", icon: BookOpen },
  { nameEn: "Shopping", nameAr: "التسوق", color: "#ec4899", icon: ShoppingBag },
  { nameEn: "Utilities", nameAr: "الفواتير", color: "#84cc16", icon: Zap },
  { nameEn: "Insurance", nameAr: "التأمين", color: "#f97316", icon: Shield },
  { nameEn: "Savings", nameAr: "المدخرات", color: "#22c55e", icon: PiggyBank },
]

export function AddCategoriesModal({ isOpen, onClose, onSave, planName }: AddCategoriesModalProps) {
  const { language } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  
  const t = {
    en: {
      title: "Add Budget Categories",
      subtitle: "Set up spending categories for",
      quickAdd: "Quick Add Categories",
      yourCategories: "Your Categories",
      addCategory: "Add Category",
      noCategories: "No categories added yet. Click \"Add Category\" to get started!",
      categoryName: "Category name",
      totalBudget: "Total Budget:",
      cancel: "Cancel",
      save: "Save Categories"
    },
    ar: {
      title: "إضافة فئات الميزانية",
      subtitle: "إعداد فئات الإنفاق لـ",
      quickAdd: "إضافة سريعة للفئات",
      yourCategories: "فئاتك",
      addCategory: "إضافة فئة",
      noCategories: "لم تتم إضافة أي فئات بعد. انقر على \"إضافة فئة\" للبدء!",
      categoryName: "اسم الفئة",
      totalBudget: "إجمالي الميزانية:",
      cancel: "إلغاء",
      save: "حفظ الفئات"
    }
  }
  
  const translations = t[language as 'en' | 'ar'] || t.en

  const addCategory = () => {
    setCategories([...categories, { name: "", budgetAmount: 0, color: "#14b8a6", icon: ShoppingCart }])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: keyof Category, value: string | number) => {
    const updatedCategories = [...categories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    setCategories(updatedCategories)
  }

  const addPredefinedCategory = (predefined: { nameEn: string; nameAr: string; color: string; icon: any }) => {
    const categoryName = language === 'ar' ? predefined.nameAr : predefined.nameEn
    setCategories([...categories, { 
      name: categoryName, 
      budgetAmount: 0, 
      color: predefined.color,
      icon: predefined.icon
    }])
  }

  const handleSave = () => {
    const validCategories = categories.filter(cat => cat.name && cat.budgetAmount > 0)
    if (validCategories.length === 0) {
      const alertMsg = language === 'ar' 
        ? "الرجاء إضافة فئة واحدة على الأقل مع مبلغ الميزانية!"
        : "Please add at least one category with a budget amount!"
      alert(alertMsg)
      return
    }
    onSave(validCategories)
  }

  const getTotalBudget = () => {
    return categories.reduce((sum, cat) => sum + (cat.budgetAmount || 0), 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <div style={{ backgroundColor: "#14b8a6" }} className="text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{translations.title}</h2>
                    <p className="text-white/90 text-sm mt-1">
                      {translations.subtitle} "{planName}"
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Add Predefined Categories */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">{translations.quickAdd}</Label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedCategories.map((predefined, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addPredefinedCategory(predefined)}
                        className="flex items-center gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-950"
                      >
                        <predefined.icon className="w-4 h-4" />
                        {language === 'ar' ? predefined.nameAr : predefined.nameEn}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">{translations.yourCategories}</Label>
                    <Button onClick={addCategory} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      {translations.addCategory}
                    </Button>
                  </div>

                  {categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>{translations.noCategories}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map((category, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
                        >
                          {/* Icon with Color Background */}
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 shadow-md flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}30` }}
                          >
                            {category.icon && (
                              <category.icon 
                                className="w-5 h-5 dark:text-white" 
                                style={{ color: category.color }}
                              />
                            )}
                          </div>

                          {/* Category Name */}
                          <div className="flex-1">
                            <Input
                              placeholder={translations.categoryName}
                              value={category.name}
                              onChange={(e) => updateCategory(index, 'name', e.target.value)}
                              className="border-0 bg-transparent text-lg font-medium dark:text-white"
                            />
                          </div>

                          {/* Budget Amount */}
                          <div className="w-32">
                            <Input
                              type="number"
                              placeholder="0"
                              value={category.budgetAmount || ''}
                              onChange={(e) => updateCategory(index, 'budgetAmount', Number(e.target.value))}
                              className="text-right font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {categories.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300">{translations.totalBudget}</span>
                      <Badge variant="secondary" className="text-lg px-3 py-1 bg-emerald-600 dark:bg-emerald-500 text-white">
                        {language === 'ar' ? 'ج.م' : '$'}{getTotalBudget().toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                  <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                    {translations.cancel}
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={categories.length === 0}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:from-emerald-400 dark:to-teal-500"
                  >
                    {translations.save}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
