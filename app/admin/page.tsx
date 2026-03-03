"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { useApp } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import { BookOpen, Video, Brain, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const { currentUser } = useApp()

  const isAllowed = currentUser && (currentUser.role?.toLowerCase() === "admin" || currentUser.role?.toLowerCase() === "editor")

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login")
      return
    }
    if (!isAllowed) {
      router.replace("/dashboard")
      return
    }
  }, [currentUser, isAllowed, router])

  if (!isAllowed) return null

  const adminSections = [
    {
      title: "Manage Articles",
      description: "Create, edit, and manage educational articles",
      icon: BookOpen,
      href: "/admin/articles",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Manage Videos",
      description: "Create, edit, and manage educational videos",
      icon: Video,
      href: "/admin/videos",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Manage Quizzes",
      description: "Create, edit, and manage financial quizzes",
      icon: Brain,
      href: "/admin/quizzes",
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your educational content
          </p>
        </motion.div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adminSections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={section.href}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-emerald-100 dark:border-emerald-900 hover:scale-105 cursor-pointer group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {section.description}
                  </p>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Manage
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
