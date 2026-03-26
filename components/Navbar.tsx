"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Globe, Menu, X, User, LogOut } from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { useRouter } from "next/navigation"


export function Navbar() {
  const { language, setLanguage, isDark, setIsDark, currentUser, setCurrentUser, refreshUser } = useApp()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const t = translations[language]

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50)
    })
    return unsubscribe
  }, [scrollY])



  const navItems = [
    { key: "home", href: "/" },
    { key: "articles", href: "/articles" },
    { key: "videos", href: "/videos" },
    { key: "quizes", href: "/quiz" },
    { key: "dashboard", href: "/dashboard" },
  ]

  // Check if user is admin/editor
  const isAdminOrEditor = currentUser && (currentUser.role?.toLowerCase() === "admin" || currentUser.role?.toLowerCase() === "editor")
  
  // If admin, redirect to admin pages and remove dashboard
  // If regular user, keep dashboard and normal pages
  const displayNavItems = isAdminOrEditor 
    ? [
        { key: "home", href: "/" },
        { key: "articles", href: "/admin/articles" },
        { key: "videos", href: "/admin/videos" },
        { key: "quizes", href: "/admin/quizzes" },
      ]
    : navItems

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm py-3 px-4 border-b border-border ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className={`text-xl font-bold text-primary cursor-pointer hover:opacity-90 transition-opacity ${
              language === 'ar' ? 'font-tajawal text-2xl' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/")}
          >
            {language === 'ar' ? 'كاش كرافت' : 'CashCraft'}
          </motion.div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center ${language === "ar" ? "space-x-12" : "space-x-8"}`}>
            {displayNavItems.map((item) => (
              <motion.div
                key={item.key}
                onClick={() => router.push(item.href)}
                className="transition-colors relative cursor-pointer text-muted-foreground hover:text-foreground"
                whileHover={{ y: -2 }}
              >
                {t[item.key as keyof typeof t]}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="bg-[#6B9FAD] text-white border-[#6B9FAD] hover:bg-[#5A8A98] dark:bg-[#6B9FAD] dark:border-[#6B9FAD] dark:hover:bg-[#5A8A98] hidden sm:flex"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === "en" ? "العربية" : "English"}
            </Button>
            {/* Language icon-only on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="bg-[#6B9FAD] text-white border-[#6B9FAD] hover:bg-[#5A8A98] sm:hidden"
            >
              <Globe className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="bg-[#6B9FAD] text-white border-[#6B9FAD] hover:bg-[#5A8A98] dark:bg-[#6B9FAD] dark:border-[#6B9FAD] dark:hover:bg-[#5A8A98]"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User/Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-[#6B9FAD] hover:bg-[#5A8A98] text-white dark:bg-[#6B9FAD] dark:hover:bg-[#5A8A98] hidden sm:flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  {currentUser.displayName}
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-[#6B9FAD] hover:bg-[#5A8A98] text-white sm:hidden"
                  size="sm"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    localStorage.removeItem("cashcraft_accessToken")
                    localStorage.removeItem("cashcraft_refreshToken")
                    await refreshUser()
                    router.push("/")
                  }}
                  className="border-[#6B9FAD] text-[#6B9FAD] hover:bg-[#6B9FAD] hover:text-white dark:border-[#6B9FAD] dark:text-[#6B9FAD] dark:hover:bg-[#6B9FAD] dark:hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="bg-[#6B9FAD] hover:bg-[#5A8A98] text-white dark:bg-[#6B9FAD] dark:hover:bg-[#5A8A98]"
                size="sm"
              >
                {t.login}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden mt-4 ${isMobileMenuOpen ? "block" : "hidden"}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200 dark:border-gray-800">
            {displayNavItems.map((item) => (
              <motion.div
                key={item.key}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className="text-center py-2 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.05 }}
              >
                {t[item.key as keyof typeof t]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
