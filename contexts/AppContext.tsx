"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiGetCurrentUser } from '@/lib/api'

type Language = 'en' | 'ar'
type Theme = 'light' | 'dark'

interface User {
  id: string
  email: string
  username: string
  displayName: string
  role: string
  isPremium: boolean
  createdAt: string
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  setIsDark: (dark: boolean) => void
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [theme, setTheme] = useState<Theme>('light')
  const [isDark, setIsDark] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cashcraft_language') as Language
    const savedTheme = localStorage.getItem('cashcraft_theme') as Theme
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = savedLanguage === 'ar' ? 'ar' : 'en'
    }
    
    if (savedTheme) {
      setTheme(savedTheme)
      setIsDark(savedTheme === 'dark')
      
      // Apply dark mode class immediately
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  // Save language preference to localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('cashcraft_language', lang)
    
    // Update document direction for RTL support
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = 'en'
    }
  }

  // Save theme preference to localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    setIsDark(newTheme === 'dark')
    localStorage.setItem('cashcraft_theme', newTheme)
    
    // Update document class for dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Handle dark mode toggle
  const handleSetIsDark = (dark: boolean) => {
    setIsDark(dark)
    const newTheme = dark ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('cashcraft_theme', newTheme)
    
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Refresh user function
  const refreshUser = async () => {
    console.log("AppContext - refreshUser called")
    const accessToken = localStorage.getItem("cashcraft_accessToken")
    console.log("AppContext - accessToken:", accessToken ? "exists" : "not found")
    
    if (accessToken) {
      try {
        console.log("AppContext - Calling apiGetCurrentUser")
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
        const userPromise = apiGetCurrentUser(accessToken)
        
        const user = await Promise.race([userPromise, timeoutPromise]) as any
        console.log("AppContext - User data received:", user)
        setCurrentUser(user)
      } catch (error) {
        console.log("AppContext - API error:", error)
        // If API fails, try to get user data from the token itself
        try {
          const tokenParts = accessToken.split('.')
          if (tokenParts.length === 3) {
            const tokenData = JSON.parse(atob(tokenParts[1]))
            console.log("AppContext - Token data:", tokenData)
            
            // JWT uses specific claim names - check ALL possible role claim names
            const role = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                      || tokenData['role'] 
                      || tokenData['Role']
                      || tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
                      || 'User'
            
            console.log("🎭 Extracted role from API fallback:", role)
            
            const isPremium = tokenData.isPremium === 'true' 
                           || tokenData.isPremium === true 
                           || tokenData['isPremium'] === 'true'
                           || tokenData['isPremium'] === true
                           || false
            
            if (tokenData.name || tokenData.displayName || tokenData.email) {
              const user = {
                id: tokenData.sub || tokenData.userId,
                displayName: tokenData.displayName || tokenData.name || tokenData.email,
                email: tokenData.email,
                username: tokenData.username || tokenData.name || tokenData.displayName || tokenData.email,
                role: role,
                isPremium: isPremium,
                createdAt: tokenData.createdAt || new Date().toISOString()
              }
              console.log("👤 Setting user from API fallback:", user)
              setCurrentUser(user)
              return
            }
          }
        } catch (tokenError) {
          console.log("AppContext - Token parsing error:", tokenError)
        }
        // Don't clear currentUser if API fails - keep existing user data
        console.log("AppContext - Keeping existing user data due to API failure")
        return // Don't throw error, just return without changing currentUser
      }
    } else {
      console.log("AppContext - No access token, clearing user")
      setCurrentUser(null)
    }
  }

  // Check user on mount - only if there's a token AND no current user
  useEffect(() => {
    const token = localStorage.getItem("cashcraft_accessToken")
    if (token && !currentUser) {
      // Load user data from token directly to avoid API calls
      try {
        const tokenParts = token.split('.')
        if (tokenParts.length === 3) {
          const tokenData = JSON.parse(atob(tokenParts[1]))
          console.log("🔍 Full token data:", tokenData)
          
          // JWT uses specific claim names - check ALL possible role claim names
          const role = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                    || tokenData['role'] 
                    || tokenData['Role']
                    || tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
                    || 'User'
          
          console.log("🎭 Extracted role:", role)
          
          const isPremium = tokenData.isPremium === 'true' 
                         || tokenData.isPremium === true 
                         || tokenData['isPremium'] === 'true'
                         || tokenData['isPremium'] === true
                         || false
          
          if (tokenData.name || tokenData.displayName || tokenData.email) {
            const user = {
              id: tokenData.sub || tokenData.userId,
              displayName: tokenData.displayName || tokenData.name || tokenData.email,
              email: tokenData.email,
              username: tokenData.username || tokenData.name || tokenData.displayName || tokenData.email,
              role: role,
              isPremium: isPremium,
              createdAt: tokenData.createdAt || new Date().toISOString()
            }
            console.log("👤 Setting user:", user)
            setCurrentUser(user)
          }
        }
      } catch (error) {
        console.log("AppContext - Token parsing error:", error)
      }
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        theme,
        setTheme: handleSetTheme,
        isDark,
        setIsDark: handleSetIsDark,
        currentUser,
        setCurrentUser,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
