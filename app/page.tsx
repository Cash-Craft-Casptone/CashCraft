"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import {
  Moon,
  Sun,
  Globe,
  DollarSign,
  TrendingUp,
  Clock,
  BookOpen,
  Video,
  Share2,
  BarChart3,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { MainNavigation } from "@/components/MainNavigation"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}





export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { language, isDark } = useApp()

  const t = translations[language]

  // Counter animation hook
  const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)

    const startCounting = () => {
      if (hasStarted) return
      setHasStarted(true)

      const startTime = Date.now()
      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        setCount(Math.floor(progress * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    return { count, startCounting }
  }

  const stat1 = useCountUp(150)
  const stat2 = useCountUp(200)
  const stat3 = useCountUp(50)

  useEffect(() => {
    // Loading animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <MainNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background gradient and patterns */}
        <div className="absolute inset-0 bg-[#f8f9fa] dark:bg-gray-950"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#6099a5] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6099a5] rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto relative z-10"
        >
          <motion.div
            className="inline-block px-6 py-2 bg-[#6099a5] text-white rounded-full text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            ✨ {t.smartFinancialPlatform}
          </motion.div>
          
          <motion.h1
            className={`text-4xl md:text-7xl font-bold mb-6 text-[#333] dark:text-white leading-tight`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t.smartMoneyManagement}
          </motion.h1>
          <motion.h2
            className={`text-2xl md:text-5xl font-bold mb-8 text-[#6099a5] dark:text-[#6099a5]`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t.achieveYourGoals}
          </motion.h2>
          <motion.p
            className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-[#333] dark:text-gray-300`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t.smartMoneyDesc}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              className="bg-[#6099a5] hover:bg-[#084f5a] text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push("/register")}
            >
              🚀 {t.tryNow}
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#6099a5] text-[#6099a5] hover:bg-[#6099a5] hover:text-white px-10 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push("/dashboard")}
            >
              📊 {t.viewDashboard}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Quote Cards Section */}
      <section className="py-24 px-4 bg-white dark:bg-black">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 text-[#333] dark:text-white`}>
              {t.financialWisdom}
            </h2>
            <p className={`text-xl text-[#333] dark:text-gray-300 max-w-2xl mx-auto`}>
              {t.financialWisdomDesc}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { quote: t.learnQuote, icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
              { quote: t.playQuote, icon: TrendingUp, gradient: "from-green-500 to-emerald-600" },
              { quote: t.mealQuote, icon: Clock, gradient: "from-green-500 to-emerald-600" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-800">
                  <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-white flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon size={32} className="text-[#6099a5] dark:text-[#6099a5]" />
                  </div>
                  <p className="text-xl font-semibold text-[#333] dark:text-gray-200 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-white dark:bg-black">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333] dark:text-white">
              {t.whatWeOffer}
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.comprehensiveTools}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { title: t.sharePlan, desc: t.sharePlanDesc, icon: Share2, gradient: "from-green-500 to-emerald-600" },
              { title: t.trackExpenses, desc: t.trackExpensesDesc, icon: BarChart3, gradient: "from-green-500 to-emerald-600" },
              { title: t.boostKnowledge, desc: t.boostKnowledgeDesc, icon: BookOpen, gradient: "from-green-500 to-emerald-600" },
              { title: t.saveMoneyVideos, desc: t.saveMoneyVideosDesc, icon: Video, gradient: "from-green-500 to-emerald-600" },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-5 group-hover:opacity-15 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-800">
                  <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className="text-[#6099a5] dark:text-[#6099a5]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#333] dark:text-gray-200">{service.title}</h3>
                  <p className="text-[#333] dark:text-gray-300 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#042a32] to-[#051a1f] dark:from-[#031e24] dark:to-[#021317] relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#6099a5] to-[#084f5a] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#084f5a] to-[#6099a5] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t.chooseYourPlan}
            </motion.h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t.choosePerfectPlan}
            </p>
          </motion.div>

          <motion.div className="flex justify-center gap-8 flex-wrap max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              className="group relative w-full sm:w-80"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6099a5] to-[#084f5a] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full hover:scale-105 transition-transform duration-300">
                <div className="p-8 text-center">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">{t.freePlan}</h3>
                    <div className="text-5xl font-bold text-[#084f5a] mb-2">EGP 0</div>
                    <p className="text-gray-500 font-medium">{t.foreverFree}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                  {[
                    t.basicExpenseTracking,
                    t.simpleBudgetCreation,
                    t.financialArticles,
                    t.educationalVideos,
                    t.basicFinancialQuiz,
                  ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                <Button
                    className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-300 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/register")}
                >
                  {t.tryNow}
                </Button>
                </div>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              className="group relative w-full sm:w-80"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6099a5] to-[#084f5a] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full hover:scale-105 transition-transform duration-300 border-2 border-[#084f5a]">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  {t.bestValue}
                  </span>
                </div>

                <div className="p-8 text-center">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">{t.premiumPlan}</h3>
                    <div className="text-5xl font-bold text-[#084f5a] mb-2">EGP 90</div>
                    <p className="text-gray-500 font-medium">{t.perMonth}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                  {[
                    t.advancedSavingsChallenges,
                    t.aiPoweredFinancialInsights,
                    t.personalizedFinancialCoaching,
                    t.exclusiveEducationalContent,
                    t.investmentSimulators,
                    t.priorityCustomerSupport,
                    t.advancedBudgetingTools,
                  ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>

                <Button
                    className="w-full bg-[#084f5a] text-white hover:bg-[#6099a5] py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/premium")}
                >
                  {t.goPremium}
                </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 px-4 ${isDark ? "bg-[#1a1f21]" : "bg-white"}`}>
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-[#084f5a]"}`}>
              {t.meetOurTeam}
            </motion.h2>
          </motion.div>

          <div className="flex justify-center gap-8 flex-wrap">
            {[
              {
                  name: "Mostafa Mohamed",
                  image: "/2d2e0517-6e9a-4f8e-a003-f716f8098ff9.jpeg",
                linkedin: "#",
                instagram: "#",
                github: "#",
              },
              {
                name: "Habiba Amr",
                  image: "/473406052_619555743878447_664832098335577281_n.jpg",
                linkedin: "#",
                instagram: "#",
                github: "#",
              },
              {
                name: "Safiya Hossam",
                  image: "/77665b4a-1a3d-4c86-84dc-e88bad2855c9.jpeg",
                linkedin: "#",
                instagram: "#",
                github: "#",
              },
              {
                name: "Abdelsalam Mohamed",
                  image: "/076d094f-125d-44df-be76-8cd3098e4d07.jpeg",
                linkedin: "#",
                instagram: "#",
                github: "#",
              },
                { name: "Ziad Hamdy", image: "/Capture.PNG", linkedin: "#", instagram: "#", github: "#" },
            ].map((member, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl shadow-lg text-center w-40 sm:w-48 transition-all duration-300 hover:scale-105 ${
                  isDark ? "bg-[#6099a5] text-white" : "bg-[#6099a5] text-white"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  whileHover={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="font-bold">{member.name}</h3>
                <div className="flex justify-center gap-3 mt-4">
                  <motion.a
                    href={member.linkedin}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin size={16} className="text-[#6099a5] hover:text-white" />
                  </motion.a>
                  <motion.a
                    href={member.instagram}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={16} className="text-[#6099a5] hover:text-white" />
                  </motion.a>
                  <motion.a
                    href={member.github}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github size={16} className="text-[#6099a5] hover:text-white" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer className="bg-[#222] text-[#6099a5] py-12 px-4">
        <div className="container mx-auto">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3 className="font-bold mb-4">CashCraft</motion.h3>
              <motion.p className="text-muted-foreground">{t.smartMoneyManagement}</motion.p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h4 className="font-semibold mb-4">{t.quickLinks}</motion.h4>
              <motion.ul className="space-y-2">
                <motion.li>
                  <motion.a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    {t.home}
                  </motion.a>
                </motion.li>
                <motion.li>
                  <motion.a href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                    {t.services}
                  </motion.a>
                </motion.li>
                <motion.li>
                  <motion.a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    {t.aboutUs}
                  </motion.a>
                </motion.li>
                <motion.li>
                  <motion.a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    {t.contact}
                  </motion.a>
                </motion.li>
              </motion.ul>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h4 className="font-semibold mb-4">{t.contactUs}</motion.h4>
              <motion.div className="space-y-2 text-muted-foreground">
                <motion.p>📞 +201223515162</motion.p>
                <motion.p>📧 cashcraft@gmail.com</motion.p>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h3 className="font-bold mb-4">{t.remainUpdated}</motion.h3>
              <motion.div className="flex gap-2">
                <motion.input
                  type="email"
                  placeholder={t.yourEmailAddress}
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 placeholder:text-gray-400"
                />
                <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/register")}>
                  {t.signUp}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p>{t.allRightsReserved}</motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
