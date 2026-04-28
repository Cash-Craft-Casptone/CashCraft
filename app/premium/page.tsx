"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Crown, Zap, Shield, Star, Sparkles, TrendingUp, BookOpen, Headphones } from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { Navbar } from "@/components/Navbar"

const PLANS = {
  monthly: {
    silver: { price: 50, period: "month", label: null },
    platinum: { price: 70, period: "month", label: "Best Value" },
  },
  annual: {
    silver: { price: 500, period: "year", label: "Save 100 EGP", monthlyEquiv: 41.7 },
    platinum: { price: 700, period: "year", label: "Most Popular · Save 140 EGP", monthlyEquiv: 58.3 },
  },
}

const SILVER_FEATURES = [
  { icon: Shield, text: "No Ads on Videos" },
  { icon: TrendingUp, text: "Advanced Savings Challenges" },
  { icon: Headphones, text: "Priority Support" },
]

const PLATINUM_FEATURES = [
  { icon: Shield, text: "No Ads on Videos" },
  { icon: TrendingUp, text: "Advanced Savings Challenges" },
  { icon: Headphones, text: "Priority Support" },
  { icon: Sparkles, text: "AI Financial Insights" },
  { icon: TrendingUp, text: "Investment Simulators" },
  { icon: BookOpen, text: "Exclusive Educational Content" },
]

export default function PremiumPage() {
  const router = useRouter()
  const { language, currentUser } = useApp()
  const isAr = language === "ar"
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
  const [selected, setSelected] = useState<"silver" | "platinum">("platinum")
  const [loading, setLoading] = useState(false)

  const plans = PLANS[billing]

  const handleSubscribe = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(isAr ? "شكراً! سيتم تفعيل اشتراكك قريباً." : "Thank you! Your subscription will be activated soon.")
    }, 1500)
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 sm:pt-32 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Crown className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#084f5a] dark:text-white mb-3">
            {isAr ? "اختر خطتك" : "Choose Your Plan"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {isAr ? "استثمر في مستقبلك المالي" : "Invest in your financial future"}
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium ${billing === "monthly" ? "text-[#084f5a] dark:text-white" : "text-gray-400"}`}>
            {isAr ? "شهري" : "Monthly"}
          </span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billing === "annual" ? "bg-[#084f5a]" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${billing === "annual" ? "translate-x-8" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium ${billing === "annual" ? "text-[#084f5a] dark:text-white" : "text-gray-400"}`}>
            {isAr ? "سنوي" : "Annual"}
          </span>
          {billing === "annual" && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
              {isAr ? "وفّر أكثر!" : "Save more!"}
            </motion.span>
          )}
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Silver Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            onClick={() => setSelected("silver")}
            className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 ${
              selected === "silver" ? "border-[#6099a5] shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <Shield className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Silver</h3>
                {plans.silver.label && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">{plans.silver.label}</span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-800 dark:text-white">{plans.silver.price}</span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">EGP / {isAr ? (billing === "monthly" ? "شهر" : "سنة") : plans.silver.period}</span>
              </div>
              {billing === "annual" && (
                <p className="text-xs text-gray-400 mt-1">{isAr ? "يعادل" : "≈"} {PLANS.annual.silver.monthlyEquiv} EGP/{isAr ? "شهر" : "mo"}</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {SILVER_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{f.text}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              {isAr ? "اختر Silver" : "Choose Silver"}
            </Button>
          </motion.div>

          {/* Platinum Card - DECOY: visually dominant */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            onClick={() => setSelected("platinum")}
            className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
              selected === "platinum"
                ? "border-[#084f5a] shadow-2xl bg-gradient-to-br from-[#084f5a] to-[#0a6b7a] text-white scale-[1.02]"
                : "border-[#084f5a]/40 shadow-xl bg-gradient-to-br from-[#084f5a] to-[#0a6b7a] text-white hover:scale-[1.01]"
            }`}>

            {/* Recommended badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-[#084f5a] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {isAr ? "الأكثر قيمة" : "Recommended"}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Crown className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Platinum</h3>
                {plans.platinum.label && (
                  <span className="text-xs text-yellow-300 font-medium">{plans.platinum.label}</span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">{plans.platinum.price}</span>
                <span className="text-white/80 mb-1">EGP / {isAr ? (billing === "monthly" ? "شهر" : "سنة") : plans.platinum.period}</span>
              </div>
              {billing === "annual" && (
                <p className="text-xs text-white/60 mt-1">{isAr ? "يعادل" : "≈"} {PLANS.annual.platinum.monthlyEquiv} EGP/{isAr ? "شهر" : "mo"}</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {PLATINUM_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < 3 ? "bg-white/20" : "bg-yellow-400/30"}`}>
                    <Check className={`w-3 h-3 ${i < 3 ? "text-white" : "text-yellow-300"}`} />
                  </div>
                  <span className={`text-sm ${i < 3 ? "text-white/80" : "text-white font-medium"}`}>{f.text}</span>
                  {i >= 3 && <span className="text-xs bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full ml-auto">New</span>}
                </div>
              ))}
            </div>

            <Button
              onClick={e => { e.stopPropagation(); handleSubscribe() }}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#084f5a] font-bold shadow-lg"
            >
              {loading ? (isAr ? "جاري المعالجة..." : "Processing...") : (isAr ? "اشترك الآن" : "Subscribe Now")}
            </Button>
          </motion.div>
        </div>

        {/* Free tier note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-center mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl max-w-3xl mx-auto">
          <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
            📺 {isAr ? "المستخدمون المجانيون يشاهدون إعلانات على الفيديوهات" : "Free tier users see ads on videos"}
          </p>
          <p className="text-xs text-orange-500 dark:text-orange-500 mt-1">
            {isAr ? "اشترك للاستمتاع بتجربة خالية من الإعلانات" : "Subscribe for an ad-free experience"}
          </p>
        </motion.div>

        {/* Comparison note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center mt-6">
          <p className="text-xs text-gray-400">
            {isAr ? "جميع الخطط تشمل الوصول الكامل للمقالات والاختبارات" : "All plans include full access to articles and quizzes"}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
