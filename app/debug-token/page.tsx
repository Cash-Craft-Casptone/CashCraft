"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"

export default function DebugTokenPage() {
  const { currentUser } = useApp()
  const [tokenData, setTokenData] = useState<any>(null)
  const [rawToken, setRawToken] = useState<string>("")
  const [roleInfo, setRoleInfo] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("cashcraft_accessToken")
    if (token) {
      setRawToken(token)
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]))
          setTokenData(decoded)
          
          // Check all possible role claim names
          const roleClaims = {
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            'role': decoded['role'],
            'Role': decoded['Role'],
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
          }
          
          const foundRole = Object.entries(roleClaims).find(([key, value]) => value !== undefined)
          
          setRoleInfo({
            allClaims: roleClaims,
            foundClaim: foundRole ? foundRole[0] : 'none',
            foundValue: foundRole ? foundRole[1] : 'none'
          })
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-4xl font-bold">🔍 JWT Token Debug</h1>
          <p className="text-emerald-100 mt-2">Inspect your authentication token and user data</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            👤 Current User from Context
          </h2>
          <pre className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 p-4 rounded-lg overflow-auto text-sm text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-emerald-800">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            🎭 Role Information
          </h2>
          <div className="space-y-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Found Role Claim:</p>
              <p className="text-xl font-bold">{roleInfo?.foundClaim}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Role Value:</p>
              <p className="text-2xl font-bold">{roleInfo?.foundValue}</p>
            </div>
          </div>
          <pre className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 p-4 rounded-lg overflow-auto text-sm text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-emerald-800">
            {JSON.stringify(roleInfo?.allClaims, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            📋 Decoded JWT Token (All Claims)
          </h2>
          <pre className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 p-4 rounded-lg overflow-auto text-sm text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-emerald-800">
            {JSON.stringify(tokenData, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            🔐 Raw Token
          </h2>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 p-4 rounded-lg overflow-auto break-all text-xs text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-emerald-800">
            {rawToken}
          </div>
        </div>
      </div>
    </div>
  )
}
