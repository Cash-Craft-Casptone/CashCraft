"use client"

import { useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { Globe, LogOut, Menu, Moon, Settings, Sun, User, WalletCards, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"

export function Navbar() {
  const { language, setLanguage, isDark, setIsDark, currentUser, refreshUser } = useApp()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const t = translations[language]

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => setIsScrolled(latest > 50))
    return unsubscribe
  }, [scrollY])

  const userNavItems = [
    { key: "home", href: "/" },
    { key: "articles", href: "/articles" },
    { key: "videos", href: "/videos" },
    { key: "quizes", href: "/quiz" },
    { key: "dashboard", href: "/dashboard" },
    { label: "Feedback", href: "/feedback" },
  ]

  const adminNavItems = [
    { key: "home", href: "/" },
    { key: "articles", href: "/admin/articles" },
    { key: "videos", href: "/admin/videos" },
    { key: "quizes", href: "/admin/quizzes" },
    { label: "Feedback", href: "/admin/feedback" },
  ]

  const isAdminOrEditor =
    currentUser &&
    (currentUser.role?.toLowerCase() === "admin" || currentUser.role?.toLowerCase() === "editor")
  const displayNavItems = isAdminOrEditor ? adminNavItems : userNavItems

  const navLabel = (item: (typeof userNavItems)[number]) =>
    "key" in item ? t[item.key as keyof typeof t] : item.label

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 px-3 transition-all duration-300 sm:px-4 ${
        isScrolled ? "py-2" : "py-3"
      } ${language === "ar" ? "rtl" : "ltr"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="cc-container">
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/85 px-3 py-2 shadow-[0_16px_50px_rgba(9,47,63,0.12)] backdrop-blur-xl dark:bg-background/75">
          <motion.button
            type="button"
            className={`flex items-center gap-2 text-lg font-extrabold text-foreground transition-opacity hover:opacity-90 ${
              language === "ar" ? "font-tajawal text-2xl" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/")}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(19,124,135,0.24)]">
              <WalletCards className="size-5" />
            </span>
            <span>{language === "ar" ? "كاش كرافت" : "CashCraft"}</span>
          </motion.button>

          <div className="hidden items-center rounded-full border border-border/60 bg-card/70 p-1 text-sm shadow-sm md:flex">
            {displayNavItems.map((item) => (
              <motion.button
                type="button"
                key={item.href}
                onClick={() => router.push(item.href)}
                className="relative rounded-full px-3 py-2 font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                whileHover={{ y: -2 }}
              >
                {navLabel(item)}
              </motion.button>
            ))}
          </div>

          <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="hidden sm:flex"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "العربية" : "English"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="sm:hidden"
            >
              <Globe className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {currentUser ? (
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="hidden max-w-44 truncate sm:flex"
                >
                  <User className="w-4 h-4" />
                  {currentUser.displayName}
                </Button>
                <Button onClick={() => router.push("/dashboard")} className="sm:hidden" size="sm">
                  <User className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4" />
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
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => router.push("/login")} size="sm">
                {t.login}
              </Button>
            )}

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

        <motion.div
          className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.25 }}
        >
          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-lg backdrop-blur-xl">
            {displayNavItems.map((item) => (
              <motion.button
                type="button"
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className="cursor-pointer rounded-xl px-4 py-3 text-center font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                whileHover={{ scale: 1.02 }}
              >
                {navLabel(item)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
