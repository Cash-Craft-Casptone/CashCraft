"use client"

import { useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/AppContext"
import { Navbar } from "@/components/Navbar"

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard" },
  { id: "vodafone", label: "Vodafone Cash", icon: "📱", desc: "Pay with your Vodafone wallet" },
  { id: "fawry", label: "Fawry", icon: "🏪", desc: "Pay at any Fawry outlet" },
  { id: "instapay", label: "InstaPay", icon: "⚡", desc: "Instant bank transfer" },
]

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)
  return digits
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, currentUser } = useApp()
  const isAr = language === "ar"

  const plan = searchParams.get("plan") || "platinum"
  const billing = searchParams.get("billing") || "monthly"
  const price = plan === "platinum" ? (billing === "annual" ? 700 : 70) : (billing === "annual" ? 500 : 50)
  const planName = plan === "platinum" ? "Platinum" : "Silver"

  const [method, setMethod] = useState("card")
  const [step, setStep] = useState<"method" | "details" | "success">("method")

  // Card fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "">("")

  // Mobile wallet
  const [phone, setPhone] = useState("")

  // Fawry ref
  const fawryRef = Math.floor(1000000000 + Math.random() * 9000000000).toString()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const detectCardType = (num: string) => {
    const n = num.replace(/\s/g, "")
    if (n.startsWith("4")) setCardType("visa")
    else if (n.startsWith("5") || n.startsWith("2")) setCardType("mastercard")
    else setCardType("")
  }

  const validateCard = () => {
    const e: Record<string, string> = {}
    if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number"
    if (!cardName.trim()) e.cardName = "Enter the cardholder name"
    if (expiry.length < 5) e.expiry = "Enter a valid expiry date"
    if (cvv.length < 3) e.cvv = "Enter a valid CVV"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePhone = () => {
    const e: Record<string, string> = {}
    if (phone.replace(/\D/g, "").length < 11) e.phone = "Enter a valid 11-digit phone number"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = () => {
    if (method === "card" && !validateCard()) return
    if ((method === "vodafone" || method === "instapay") && !validatePhone()) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep("success") }, 2000)
  }

  if (step === "success") {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${isAr ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-32 pb-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {isAr ? "تم الدفع بنجاح!" : "Payment Successful!"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {isAr ? `مرحباً بك في خطة ${planName}` : `Welcome to ${planName} plan!`}
            </p>
            <p className="text-sm text-gray-400 mb-8">
              {isAr ? "سيتم تفعيل اشتراكك خلال دقائق" : "Your subscription will be activated within minutes"}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-8 text-left border dark:border-gray-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{isAr ? "الخطة" : "Plan"}</span>
                <span className="font-semibold dark:text-white">{planName}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{isAr ? "المبلغ" : "Amount"}</span>
                <span className="font-semibold dark:text-white">{price} EGP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{isAr ? "طريقة الدفع" : "Method"}</span>
                <span className="font-semibold dark:text-white">{PAYMENT_METHODS.find(m => m.id === method)?.label}</span>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full bg-[#084f5a] hover:bg-[#063d47] text-white">
              {isAr ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-28 sm:pt-32 pb-16">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isAr ? "إتمام الدفع" : "Checkout"}</h1>
            <p className="text-sm text-gray-500">{isAr ? "آمن ومشفر" : "Secure & Encrypted"} 🔒</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-[#084f5a] to-[#0a6b7a] rounded-2xl p-5 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/70 text-sm">{isAr ? "ملخص الطلب" : "Order Summary"}</p>
              <p className="text-xl font-bold mt-1">{planName} Plan · {billing === "annual" ? (isAr ? "سنوي" : "Annual") : (isAr ? "شهري" : "Monthly")}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{price}</p>
              <p className="text-white/70 text-sm">EGP</p>
            </div>
          </div>
        </div>

        {/* Step 1: Payment Method */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#084f5a] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
            {isAr ? "طريقة الدفع" : "Payment Method"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${method === m.id ? "border-[#084f5a] bg-[#084f5a]/5 dark:bg-[#084f5a]/20" : "border-gray-200 dark:border-gray-600 hover:border-gray-300"}`}>
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{m.label}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#084f5a] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
            {isAr ? "تفاصيل الدفع" : "Payment Details"}
          </h2>

          <AnimatePresence mode="wait">
            {method === "card" && (
              <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Card Number */}
                <div>
                  <Label className="dark:text-gray-300 text-sm">{isAr ? "رقم البطاقة" : "Card Number"}</Label>
                  <div className="relative mt-1">
                    <Input
                      value={cardNumber}
                      onChange={e => { const v = formatCardNumber(e.target.value); setCardNumber(v); detectCardType(v) }}
                      placeholder="0000 0000 0000 0000"
                      className={`pr-12 font-mono tracking-widest dark:bg-gray-700 dark:text-white ${errors.cardNumber ? "border-red-400" : ""}`}
                      maxLength={19}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                      {cardType === "visa" ? "💳" : cardType === "mastercard" ? "🔴" : <CreditCard className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                {/* Cardholder Name */}
                <div>
                  <Label className="dark:text-gray-300 text-sm">{isAr ? "اسم حامل البطاقة" : "Cardholder Name"}</Label>
                  <Input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE" className={`mt-1 uppercase dark:bg-gray-700 dark:text-white ${errors.cardName ? "border-red-400" : ""}`} />
                  {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="dark:text-gray-300 text-sm">{isAr ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
                    <Input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY" maxLength={5}
                      className={`mt-1 font-mono dark:bg-gray-700 dark:text-white ${errors.expiry ? "border-red-400" : ""}`} />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <Label className="dark:text-gray-300 text-sm">CVV</Label>
                    <Input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••" type="password" maxLength={4}
                      className={`mt-1 font-mono dark:bg-gray-700 dark:text-white ${errors.cvv ? "border-red-400" : ""}`} />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                {/* Card preview */}
                {cardNumber && (
                  <div className="bg-gradient-to-r from-[#084f5a] to-[#1a7a8a] rounded-xl p-4 text-white mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-6 bg-yellow-400 rounded opacity-80" />
                      <span className="text-xs opacity-70">{cardType === "visa" ? "VISA" : cardType === "mastercard" ? "MASTERCARD" : ""}</span>
                    </div>
                    <p className="font-mono text-lg tracking-widest mb-3">{cardNumber || "0000 0000 0000 0000"}</p>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>{cardName || "CARDHOLDER NAME"}</span>
                      <span>{expiry || "MM/YY"}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {(method === "vodafone" || method === "instapay") && (
              <motion.div key="mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <Label className="dark:text-gray-300 text-sm">{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+20</span>
                    <Input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                      placeholder="01XXXXXXXXX" className={`pl-12 font-mono dark:bg-gray-700 dark:text-white ${errors.phone ? "border-red-400" : ""}`} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700 text-sm text-orange-700 dark:text-orange-400">
                  {method === "vodafone"
                    ? (isAr ? "ستتلقى رسالة تأكيد على رقمك لإتمام الدفع" : "You'll receive a confirmation SMS to complete payment")
                    : (isAr ? "سيتم تحويلك لتطبيق InstaPay لإتمام الدفع" : "You'll be redirected to InstaPay to complete payment")}
                </div>
              </motion.div>
            )}

            {method === "fawry" && (
              <motion.div key="fawry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="text-4xl mb-3">🏪</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {isAr ? "رقم مرجعي Fawry الخاص بك:" : "Your Fawry Reference Number:"}
                  </p>
                  <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-[#084f5a] rounded-xl p-4">
                    <p className="text-2xl font-bold font-mono text-[#084f5a] dark:text-emerald-400 tracking-widest">{fawryRef}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {isAr ? "توجه لأقرب منفذ Fawry وأعطِ الكاشير هذا الرقم" : "Go to any Fawry outlet and give this number to the cashier"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 justify-center">
          <Shield className="w-4 h-4" />
          <span>{isAr ? "مدفوعاتك محمية بتشفير SSL 256-bit" : "Your payment is protected by 256-bit SSL encryption"}</span>
        </div>

        {/* Pay Button */}
        <Button onClick={handlePay} disabled={loading} className="w-full bg-[#084f5a] hover:bg-[#063d47] text-white py-6 text-lg font-bold rounded-2xl shadow-lg">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isAr ? "جاري المعالجة..." : "Processing..."}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {method === "fawry"
                ? (isAr ? "تأكيد الطلب" : "Confirm Order")
                : `${isAr ? "ادفع" : "Pay"} ${price} EGP`}
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#084f5a] border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
