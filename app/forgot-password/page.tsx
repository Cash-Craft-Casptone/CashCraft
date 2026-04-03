"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"

type Step = "email" | "otp" | "newpass" | "done"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { language } = useApp()
  const isAr = language === "ar"

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const sendOTP = async () => {
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isAr ? "أدخل بريدًا إلكترونيًا صحيحًا" : "Enter a valid email address")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send code")
      setStep("otp")
      setOtp("")
      setCooldown(60)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    setError(null)
    if (otp.length !== 6) {
      setError(isAr ? "أدخل الرمز المكون من 6 أرقام" : "Enter the 6-digit code")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid code")
      setStep("newpass")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setError(null)
    if (newPassword.length < 6) {
      setError(isAr ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("https://cashcraft.runasp.net/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      })
      console.log("Reset password response status:", res.status)
      const responseText = await res.text()
      console.log("Reset password response body:", responseText)
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}: ${responseText}`)
      setStep("done")
    } catch (e: any) {
      setError(e.message || (isAr ? "فشل إعادة تعيين كلمة المرور" : "Failed to reset password"))
    } finally {
      setLoading(false)
    }
  }

  const stepIcon = { email: <Mail className="w-8 h-8 text-[#6099a5]" />, otp: <KeyRound className="w-8 h-8 text-[#6099a5]" />, newpass: <Lock className="w-8 h-8 text-[#6099a5]" />, done: <span className="text-4xl">✅</span> }
  const stepTitle = {
    email: isAr ? "نسيت كلمة المرور؟" : "Forgot Password?",
    otp: isAr ? "تحقق من بريدك" : "Check Your Email",
    newpass: isAr ? "كلمة مرور جديدة" : "New Password",
    done: isAr ? "تم بنجاح!" : "All Done!",
  }
  const stepDesc = {
    email: isAr ? "أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق" : "Enter your email and we'll send you a verification code",
    otp: isAr ? `تم إرسال رمز مكون من 6 أرقام إلى ${email}` : `A 6-digit code was sent to ${email}`,
    newpass: isAr ? "اختر كلمة مرور جديدة قوية" : "Choose a strong new password",
    done: isAr ? "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن." : "Password changed successfully. You can now log in.",
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 flex items-center justify-center px-4 ${isAr ? "rtl" : "ltr"}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          {/* Back button */}
          {step !== "done" && (
            <button onClick={() => step === "email" ? router.push("/login") : setStep(step === "otp" ? "email" : "otp")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {isAr ? "رجوع" : "Back"}
            </button>
          )}

          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">{stepIcon[step]}</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{stepTitle[step]}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{stepDesc[step]}</p>
          </div>

          {/* Progress dots */}
          {step !== "done" && (
            <div className="flex justify-center gap-2 mb-6">
              {(["email", "otp", "newpass"] as Step[]).map(s => (
                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? "bg-[#6099a5]" : ["email", "otp", "newpass"].indexOf(s) < ["email", "otp", "newpass"].indexOf(step) ? "bg-[#084f5a]" : "bg-gray-200 dark:bg-gray-700"}`} />
              ))}
            </div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label className="dark:text-gray-300">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendOTP()}
                    placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    className="mt-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" />
                </div>
                <Button onClick={sendOTP} disabled={loading || !email} className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white">
                  {loading ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال رمز التحقق" : "Send Verification Code")}
                </Button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label className="dark:text-gray-300">{isAr ? "رمز التحقق" : "Verification Code"}</Label>
                  <Input type="text" inputMode="numeric" maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={e => e.key === "Enter" && otp.length === 6 && verifyOTP()}
                    placeholder="000000"
                    className="mt-1 text-center text-2xl tracking-widest font-bold dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" />
                </div>
                <Button onClick={verifyOTP} disabled={loading || otp.length !== 6} className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white">
                  {loading ? (isAr ? "جاري التحقق..." : "Verifying...") : (isAr ? "تحقق" : "Verify Code")}
                </Button>
                <div className="text-center">
                  <button onClick={cooldown > 0 ? undefined : sendOTP} disabled={cooldown > 0 || loading}
                    className={`text-sm ${cooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#6099a5] hover:underline cursor-pointer"}`}>
                    {cooldown > 0 ? `${isAr ? "إعادة الإرسال خلال" : "Resend in"} ${cooldown}s` : (isAr ? "إعادة إرسال الرمز" : "Resend code")}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "newpass" && (
              <motion.div key="newpass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label className="dark:text-gray-300">{isAr ? "كلمة المرور الجديدة" : "New Password"}</Label>
                  <div className="relative mt-1">
                    <Input type={showPass ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder={isAr ? "6 أحرف على الأقل" : "At least 6 characters"}
                      className="pr-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="dark:text-gray-300">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && resetPassword()}
                    placeholder={isAr ? "أعد كتابة كلمة المرور" : "Repeat password"}
                    className="mt-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" />
                </div>
                <Button onClick={resetPassword} disabled={loading || !newPassword || !confirmPassword} className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white">
                  {loading ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "تعيين كلمة المرور" : "Set New Password")}
                </Button>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                <Button onClick={() => router.push("/login")} className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white">
                  {isAr ? "تسجيل الدخول" : "Go to Login"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
