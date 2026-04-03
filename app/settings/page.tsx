"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Lock, Bell, Palette, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { language, isDark, setIsDark, currentUser, setCurrentUser } = useApp()
  const router = useRouter()
  const isAr = language === "ar"

  const [profile, setProfile] = useState({ displayName: "", username: "", email: "", phoneNumber: "" })
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" })
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (!currentUser) { router.push("/login"); return }
    setProfile({
      displayName: currentUser.displayName || "",
      username: currentUser.username || "",
      email: currentUser.email || "",
      phoneNumber: (currentUser as any).phoneNumber || "",
    })
  }, [currentUser])

  const showMsg = (text: string, ok: boolean) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("cashcraft_accessToken")
      const res = await fetch("https://cashcraft.runasp.net/api/Users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ displayName: profile.displayName, username: profile.username, phoneNumber: profile.phoneNumber }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = { ...currentUser!, displayName: profile.displayName, username: profile.username }
      setCurrentUser(updated)
      localStorage.setItem("cashcraft_user", JSON.stringify(updated))
      showMsg(isAr ? "تم حفظ التغييرات بنجاح" : "Profile updated successfully", true)
    } catch (e: any) {
      showMsg(isAr ? "فشل الحفظ: " + e.message : "Failed to save: " + e.message, false)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      showMsg(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match", false)
      return
    }
    if (passwords.newPass.length < 6) {
      showMsg(isAr ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters", false)
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem("cashcraft_accessToken")
      const res = await fetch("https://cashcraft.runasp.net/api/Users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPasswords({ current: "", newPass: "", confirm: "" })
      showMsg(isAr ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully", true)
    } catch (e: any) {
      showMsg(isAr ? "فشل تغيير كلمة المرور" : "Failed to change password", false)
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${isAr ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#084f5a] dark:text-emerald-400">
            {isAr ? "الإعدادات" : "Settings"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? "إدارة حسابك وتفضيلاتك" : "Manage your account and preferences"}
          </p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.ok ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400"}`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Profile Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <User className="w-5 h-5 text-[#6099a5]" />
                  {isAr ? "معلومات الحساب" : "Account Information"}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {isAr ? "تعديل بياناتك الشخصية" : "Edit your personal details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">{isAr ? "الاسم المعروض" : "Display Name"}</Label>
                    <Input
                      value={profile.displayName}
                      onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))}
                      className="mt-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{isAr ? "اسم المستخدم" : "Username"}</Label>
                    <Input
                      value={profile.username}
                      onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                      className="mt-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      value={profile.email}
                      disabled
                      className="mt-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">{isAr ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed"}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
                    <Input
                      value={profile.phoneNumber}
                      onChange={e => setProfile(p => ({ ...p, phoneNumber: e.target.value }))}
                      className="mt-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2">
                    <div>
                      <span className="font-medium">{isAr ? "الدور:" : "Role:"}</span> {currentUser.role} &nbsp;|&nbsp;
                      <span className="font-medium">{isAr ? "عضو منذ:" : "Member since:"}</span> {new Date(currentUser.createdAt).toLocaleDateString()}
                    </div>
                    {(currentUser as any).authMethod === "google" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                        <img src="/google-logo.png" alt="Google" className="w-3.5 h-3.5" />
                        {isAr ? "تسجيل دخول بجوجل" : "Signed in with Google"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 rounded-full text-xs font-medium text-blue-700 dark:text-blue-400">
                        ✉️ {isAr ? "تسجيل دخول بالبريد" : "Signed in with Email"}
                      </span>
                    )}
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#084f5a] hover:bg-[#063d47] text-white">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التغييرات" : "Save Changes")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password - hidden for Google users */}
          {(currentUser as any).authMethod !== "google" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <Lock className="w-5 h-5 text-[#6099a5]" />
                  {isAr ? "تغيير كلمة المرور" : "Change Password"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(["current", "newPass", "confirm"] as const).map((field) => (
                  <div key={field}>
                    <Label className="dark:text-gray-300">
                      {field === "current" ? (isAr ? "كلمة المرور الحالية" : "Current Password")
                        : field === "newPass" ? (isAr ? "كلمة المرور الجديدة" : "New Password")
                        : (isAr ? "تأكيد كلمة المرور" : "Confirm Password")}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type={showPass[field] ? "text" : "password"}
                        value={passwords[field]}
                        onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                        className="pr-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(s => ({ ...s, [field]: !s[field] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <Button onClick={handleChangePassword} disabled={saving || !passwords.current || !passwords.newPass} className="bg-[#084f5a] hover:bg-[#063d47] text-white">
                  <Lock className="w-4 h-4 mr-2" />
                  {isAr ? "تغيير كلمة المرور" : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          )}

          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <Palette className="w-5 h-5 text-[#6099a5]" />
                  {isAr ? "المظهر" : "Appearance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-gray-100">{isAr ? "الوضع الداكن" : "Dark Mode"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{isAr ? "تبديل بين الوضع الفاتح والداكن" : "Toggle between light and dark theme"}</p>
                  </div>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isDark ? "bg-[#084f5a]" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${isDark ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
