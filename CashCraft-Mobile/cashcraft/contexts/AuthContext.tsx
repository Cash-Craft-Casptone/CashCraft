import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiLogin, apiRegister, apiGetCurrentUser } from "@/lib/api"

interface User {
  id: string
  email: string
  username: string
  displayName: string
  role: string
  isPremium: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, displayName: string, phoneNumber: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("cashcraft_token")
      const storedUser = await AsyncStorage.getItem("cashcraft_user")
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error("Failed to load auth:", e)
    } finally {
      setLoading(false)
    }
  }

  const saveAuth = async (accessToken: string) => {
    await AsyncStorage.setItem("cashcraft_token", accessToken)
    setToken(accessToken)
    // Extract user from JWT
    try {
      const parts = accessToken.split(".")
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || "user"
        const userData: User = {
          id: payload.sub || payload.nameid || Date.now().toString(),
          email: payload.email || "",
          username: payload.username || payload.name || "",
          displayName: payload.displayName || payload.name || "",
          role,
          isPremium: payload.isPremium === "true" || payload.isPremium === true || false,
          createdAt: payload.createdAt || new Date().toISOString(),
        }
        setUser(userData)
        await AsyncStorage.setItem("cashcraft_user", JSON.stringify(userData))
      }
    } catch (e) {
      console.error("Failed to parse token:", e)
    }
  }

  const login = async (email: string, password: string) => {
    const { accessToken, refreshToken } = await apiLogin(email, password)
    await AsyncStorage.setItem("cashcraft_refreshToken", refreshToken)
    await saveAuth(accessToken)
  }

  const register = async (email: string, username: string, password: string, displayName: string, phoneNumber: string) => {
    const { accessToken, refreshToken } = await apiRegister(email, username, password, displayName, phoneNumber)
    await AsyncStorage.setItem("cashcraft_refreshToken", refreshToken)
    await saveAuth(accessToken)
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(["cashcraft_token", "cashcraft_refreshToken", "cashcraft_user"])
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role?.toLowerCase() === "admin"

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
