"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { apiLogin, apiRegister, apiGoogleAuth } from "@/lib/api"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

type AuthMode = "login" | "register"

interface AuthScreenProps {
  initialMode: AuthMode
  wallpaperUrl?: string // used for login by default
  registerWallpaperUrl?: string
}

export function AuthScreen({ initialMode, wallpaperUrl = "/auth-wallpaper.jpg", registerWallpaperUrl }: AuthScreenProps) {
  const router = useRouter()
  const { language, currentUser, refreshUser, setCurrentUser } = useApp()
  const t = translations[language]
  const [mode, setMode] = useState<AuthMode>(initialMode)

  // keep RTL/LTR in sync
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const isLogin = mode === "login"
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OTP verification state
  const [otpStep, setOtpStep] = useState<"form" | "verify">("form")
  const [otpCode, setOtpCode] = useState("")
  const [otpSending, setOtpSending] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.35 } },
  }

  const loginBg = wallpaperUrl || "/auth-wallpaper.jpg"
  const registerBg = registerWallpaperUrl || wallpaperUrl || "/auth-wallpaper.jpg"

  // Cooldown timer for resend
  useEffect(() => {
    if (otpCooldown <= 0) return
    const t = setTimeout(() => setOtpCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [otpCooldown])

  async function handleSendOTP() {
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address first.")
      return
    }
    if (password !== confirmPassword) {
      setError(t.enterConfirmPassword || "Passwords do not match")
      return
    }
    if (!username.trim() || !displayName.trim()) {
      setError("Username and display name are required.")
      return
    }
    setOtpSending(true)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send code")
      setOtpStep("verify")
      setOtpCode("")
      setOtpCooldown(60)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setOtpSending(false)
    }
  }

  async function handleVerifyAndRegister() {
    setError(null)
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit code.")
      return
    }
    setSubmitting(true)
    try {
      // Verify OTP first
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid code")

      // OTP valid - proceed with registration
      await handleRegister()
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  async function handleLogin() {
    setError(null)
    setSubmitting(true)
    try {
      console.log("AuthScreen - Starting login process")
      const { accessToken, refreshToken } = await apiLogin(email, password)
      console.log("AuthScreen - Login successful, tokens received")
      localStorage.setItem("cashcraft_accessToken", accessToken)
      localStorage.setItem("cashcraft_refreshToken", refreshToken)
      console.log("AuthScreen - Tokens stored, extracting user data from token")
      // Extract user data from the JWT token
      let userRole = "user"
      try {
        const tokenParts = accessToken.split('.')
        if (tokenParts.length === 3) {
          const tokenData = JSON.parse(atob(tokenParts[1]))
          console.log("AuthScreen - Token data:", tokenData)
          
          // Extract role from token
          userRole = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                  || tokenData['role'] 
                  || tokenData['Role']
                  || 'user'
          
          const userData = {
            id: tokenData.sub || tokenData.userId || Date.now().toString(),
            email: tokenData.email || email,
            username: tokenData.username || tokenData.name || email.split('@')[0],
            displayName: tokenData.displayName || tokenData.name || email.split('@')[0],
            role: userRole,
            isPremium: tokenData.isPremium === 'true' || tokenData.isPremium === true || false,
            createdAt: tokenData.createdAt || new Date().toISOString()
          }
          setCurrentUser(userData)
          localStorage.setItem("cashcraft_user", JSON.stringify(userData))
          console.log("AuthScreen - User data extracted from token:", userData)
        } else {
          throw new Error("Invalid token format")
        }
      } catch (tokenError) {
        console.log("AuthScreen - Failed to extract user data from token, using fallback:", tokenError)
        // Fallback: use email as display name
        const userData = {
          id: Date.now().toString(),
          email: email,
          username: email.split('@')[0],
          displayName: email.split('@')[0],
          role: "user",
          isPremium: false,
          createdAt: new Date().toISOString()
        }
        setCurrentUser(userData)
        localStorage.setItem("cashcraft_user", JSON.stringify(userData))
        console.log("AuthScreen - Fallback user data set:", userData)
      }
      
      // Redirect based on role
      if (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "editor") {
        console.log("AuthScreen - Admin/Editor detected, redirecting to /admin")
        router.push("/admin")
      } else {
        console.log("AuthScreen - Regular user, redirecting to /dashboard")
        router.push("/dashboard")
      }
    } catch (e: any) {
      console.log("AuthScreen - Login error:", e)
      setError(e?.message || "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegister() {
    setError(null)
    if (password !== confirmPassword) {
      setError(t.enterConfirmPassword || "Passwords do not match")
      return
    }
    if (!username.trim()) {
      setError("Username is required")
      return
    }
    if (!displayName.trim()) {
      setError("Display name is required")
      return
    }
    setSubmitting(true)
    try {
      console.log("Attempting registration with:", { email, username, displayName, phoneNumber })
      
      const response = await apiRegister(email, username, password, displayName, phoneNumber)
      console.log("Registration response:", response)
      
      // Registration should always return tokens now
      if (response.accessToken && response.refreshToken) {
        console.log("Registration successful with tokens")
        localStorage.setItem("cashcraft_accessToken", response.accessToken)
        localStorage.setItem("cashcraft_refreshToken", response.refreshToken)
        
        // Extract user data from the JWT token (same as login)
        console.log("AuthScreen - Extracting user data from token")
        try {
          const tokenParts = response.accessToken.split('.')
          if (tokenParts.length === 3) {
            const tokenData = JSON.parse(atob(tokenParts[1]))
            console.log("AuthScreen - Token data from registration:", tokenData)
            const userData = {
              id: tokenData.sub || tokenData.nameid || Date.now().toString(),
              email: tokenData.email || email,
              username: username,
              displayName: displayName,
              role: tokenData.role || "user",
              isPremium: tokenData.isPremium || false,
              createdAt: tokenData.createdAt || new Date().toISOString()
            }
            setCurrentUser(userData)
            localStorage.setItem("cashcraft_user", JSON.stringify(userData))
            console.log("AuthScreen - User data extracted from token:", userData)
          } else {
            throw new Error("Invalid token format")
          }
        } catch (tokenError) {
          console.log("AuthScreen - Failed to extract user data from token, using fallback:", tokenError)
          // Fallback: use registration form data
          const userData = {
            id: Date.now().toString(),
            email: email,
            username: username,
            displayName: displayName,
            role: "user",
            isPremium: false,
            createdAt: new Date().toISOString()
          }
          setCurrentUser(userData)
          localStorage.setItem("cashcraft_user", JSON.stringify(userData))
          console.log("AuthScreen - Fallback user data set:", userData)
        }
        
        console.log("AuthScreen - Navigating to dashboard")
        router.push("/dashboard")
      } else {
        console.log("Unexpected response format:", response)
        setError("Registration completed but there was an issue. Please try logging in.")
      }
    } catch (e: any) {
      console.log("Registration error:", e)
      setError(e?.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse: any) {
    setError(null)
    setSubmitting(true)
    try {
      console.log("AuthScreen - Google login successful, credential received")
      const { accessToken, refreshToken } = await apiGoogleAuth(credentialResponse.credential)
      console.log("AuthScreen - Backend authentication successful")
      
      localStorage.setItem("cashcraft_accessToken", accessToken)
      localStorage.setItem("cashcraft_refreshToken", refreshToken)
      
      // Extract user data from JWT token
      try {
        const tokenParts = accessToken.split('.')
        if (tokenParts.length === 3) {
          const tokenData = JSON.parse(atob(tokenParts[1]))
          console.log("AuthScreen - Token data:", tokenData)
          
          const userRole = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                  || tokenData['role'] 
                  || tokenData['Role']
                  || 'user'
          
          const userData = {
            id: tokenData.sub || tokenData.userId || Date.now().toString(),
            email: tokenData.email,
            username: tokenData.username || tokenData.name || tokenData.email.split('@')[0],
            displayName: tokenData.displayName || tokenData.name || tokenData.email.split('@')[0],
            role: userRole,
            isPremium: tokenData.isPremium === 'true' || tokenData.isPremium === true || false,
            createdAt: tokenData.createdAt || new Date().toISOString()
          }
          setCurrentUser(userData)
          localStorage.setItem("cashcraft_user", JSON.stringify(userData))
          console.log("AuthScreen - User data set:", userData)
          
          // Redirect based on role
          if (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "editor") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        }
      } catch (tokenError) {
        console.error("Failed to parse token:", tokenError)
        setError("Authentication successful but failed to load user data")
      }
    } catch (e: any) {
      console.error("Google auth error:", e)
      setError(e?.message || "Google authentication failed")
    } finally {
      setSubmitting(false)
    }
  }

  function handleGoogleError() {
    console.error("Google login failed")
    setError("Google authentication failed. Please try again.")
  }

  function handleLogout() {
    localStorage.removeItem("cashcraft_accessToken")
    localStorage.removeItem("cashcraft_refreshToken")
    localStorage.removeItem("cashcraft_user")
    setCurrentUser(null) // Clear user data immediately
    setMode("login")
  }

  // Show user info if already logged in
  if (currentUser) {
    return (
      <div className={`min-h-screen relative ${language === "ar" ? "rtl" : "ltr"}`} suppressHydrationWarning>
        {/* Wallpaper background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
          aria-hidden
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" aria-hidden />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
            {/* Left: brand / pitch */}
            <div className="hidden md:flex flex-col justify-between bg-white/10 dark:bg-white/5 backdrop-blur-md p-8 text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">CashCraft</h1>
                <p className="text-white/90">
                  {t.smartMoneyDesc}
                </p>
              </div>
              <div className="text-sm text-white/80">
                {t.chooseYourPlan}
              </div>
            </div>

            {/* Right: user info card */}
            <div className="bg-white dark:bg-gray-900 p-8">
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t.welcomeBackUser.replace("{name}", currentUser.displayName)}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.loggedInAs} <span className="font-semibold">@{currentUser.username}</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="text-left space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{t.email}:</span> {currentUser.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{t.role}:</span> {currentUser.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{t.memberSince}:</span> {new Date(currentUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t.goToDashboard}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {t.logout}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId="299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com">
    <div className={`min-h-screen relative ${language === "ar" ? "rtl" : "ltr"}`} suppressHydrationWarning>
      {/* Wallpaper background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${isLogin ? loginBg : registerBg})` }}
        aria-hidden
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/60" aria-hidden />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left: brand / pitch */}
          <div className="hidden md:flex flex-col justify-between bg-white/10 dark:bg-white/5 backdrop-blur-md p-8 text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">CashCraft</h1>
              <p className="text-white/90">
                {t.smartMoneyDesc}
              </p>
            </div>
            <div className="text-sm text-white/80">
              {t.chooseYourPlan}
            </div>
          </div>

          {/* Right: auth card */}
          <div className="bg-white dark:bg-gray-900 p-8">
            {/* Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-2xl font-bold text-foreground">
                {isLogin ? t.welcomeBack : t.createAccount}
              </div>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => { setMode(isLogin ? "register" : "login"); setOtpStep("form"); setError(null) }}
              >
                {isLogin ? t.createNewAccount : t.signInHere}
              </Button>
            </div>

            <div className="relative min-h-[320px]">
              <AnimatePresence mode="wait" initial={false}>
                {isLogin ? (
                  <motion.div
                    key="login"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">{t.email}</label>
                      <Input type="email" placeholder={t.enterEmail} className="bg-white dark:bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">{t.password}</label>
                      <Input type="password" placeholder={t.enterPassword} className="bg-white dark:bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
                    <Button className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white" onClick={handleLogin} disabled={submitting}>
                      {t.signIn}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">{t.orContinueWith}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                      />
                    </div>
                    
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {t.dontHaveAccount} <button className="text-[#6099a5]" onClick={() => setMode("register")}>{t.createNewAccount}</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    {otpStep === "form" ? (
                      <>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.email}</label>
                          <Input type="email" placeholder={t.enterEmail} className="bg-background" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.username}</label>
                          <Input type="text" placeholder={t.enterUsername} className="bg-background" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.displayName}</label>
                          <Input type="text" placeholder={t.enterDisplayName} className="bg-background" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.phoneNumber}</label>
                          <Input type="tel" placeholder={t.enterPhoneNumber} className="bg-background" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.password}</label>
                          <Input type="password" placeholder={t.enterPassword} className="bg-background" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">{t.confirmPassword}</label>
                          <Input type="password" placeholder={t.enterConfirmPassword} className="bg-background" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
                        <Button className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white" onClick={handleSendOTP} disabled={otpSending}>
                          {otpSending ? "Sending code..." : "Send Verification Code"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            A 6-digit verification code was sent to
                          </p>
                          <p className="font-semibold text-[#084f5a] dark:text-emerald-400 mt-1">{email}</p>
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-foreground">Verification Code</label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            className="bg-background text-center text-2xl tracking-widest font-bold"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          />
                        </div>
                        {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
                        <Button className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white" onClick={handleVerifyAndRegister} disabled={submitting || otpCode.length !== 6}>
                          {submitting ? "Creating account..." : "Verify & Create Account"}
                        </Button>
                        <div className="flex items-center justify-between text-sm">
                          <button className="text-gray-500 hover:text-gray-700" onClick={() => { setOtpStep("form"); setError(null) }}>
                            ← Change email
                          </button>
                          <button
                            className={`text-[#6099a5] ${otpCooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
                            onClick={otpCooldown > 0 ? undefined : handleSendOTP}
                            disabled={otpCooldown > 0 || otpSending}
                          >
                            {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Resend code"}
                          </button>
                        </div>
                      </>
                    )}
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">{t.orContinueWith}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="signup_with"
                        shape="rectangular"
                      />
                    </div>
                    
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {t.alreadyHaveAccount} <button className="text-[#6099a5]" onClick={() => { setMode("login"); setOtpStep("form"); setError(null) }}>{t.signInHere}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Where to put the wallpaper */}
      {/* Place your image at: public/auth-wallpaper.jpg (or pass wallpaperUrl prop) */}
    </div>
    </GoogleOAuthProvider>
  )
}


