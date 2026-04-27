export type Language = "en" | "ar";

export const languageMeta: Record<Language, { label: string; nativeLabel: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ar: { label: "Arabic (Egyptian)", nativeLabel: "العربية (مصري)", dir: "rtl" },
};

export const translations = {
  en: {
    common: {
      back: "Back",
      seeAll: "See all",
      minRead: "min read",
      min: "min",
      questions: "questions",
      thisMonth: "this month",
      profile: "Profile",
      all: "All",
    },
    tabs: {
      home: "Home",
      articles: "Articles",
      videos: "Videos",
      quizzes: "Quizzes",
      dashboard: "Dashboard",
    },
    home: {
      goodMorning: "Good morning,",
      heroTitle: "Master your money.",
      heroSubtitle: "Start your financial journey today with bite-sized lessons.",
      financialWisdom: "Financial Wisdom",
      continueLearning: "Continue learning",
      featured: "Featured",
    },
    articles: {
      title: "Articles",
      searchPlaceholder: "Search articles...",
    },
    videos: {
      title: "Videos",
      searchPlaceholder: "Search videos...",
    },
    quizzes: {
      title: "Quizzes",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    dashboard: {
      title: "Dashboard",
      totalBalance: "Total Balance",
      income: "Income",
      expenses: "Expenses",
      savingsGoals: "Savings Goals",
      spendingByCategory: "Spending by Category",
      recentTransactions: "Recent Transactions",
    },
    profile: {
      dayStreak: "Day Streak",
      quizzesStat: "Quizzes",
      articlesStat: "Articles",
      settings: "Settings",
      darkMode: "Dark Mode",
      language: "Language",
      notifications: "Notifications",
      about: "About",
      signOut: "Sign out",
      themeAuto: "System",
      themeLight: "Light",
      themeDark: "Dark",
    },
  },
  ar: {
    common: {
      back: "رجوع",
      seeAll: "عرض الكل",
      minRead: "دقيقة قراءة",
      min: "دقيقة",
      questions: "أسئلة",
      thisMonth: "الشهر ده",
      profile: "البروفايل",
      all: "الكل",
    },
    tabs: {
      home: "الرئيسية",
      articles: "مقالات",
      videos: "فيديوهات",
      quizzes: "اختبارات",
      dashboard: "لوحة التحكم",
    },
    home: {
      goodMorning: "صباح الفل،",
      heroTitle: "اتحكم في فلوسك.",
      heroSubtitle: "ابدأ رحلتك المالية النهارده بدروس قصيرة وسهلة.",
      featured: "مميز",
      financialWisdom: "حِكَم مالية",
      continueLearning: "كمّل تعلّمك",
    },
    articles: {
      title: "المقالات",
      searchPlaceholder: "ابحث في المقالات...",
    },
    videos: {
      title: "الفيديوهات",
      searchPlaceholder: "ابحث في الفيديوهات...",
    },
    quizzes: {
      title: "الاختبارات",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
    },
    dashboard: {
      title: "لوحة التحكم",
      totalBalance: "إجمالي الرصيد",
      income: "الدخل",
      expenses: "المصروفات",
      savingsGoals: "أهداف الادخار",
      spendingByCategory: "المصروفات حسب الفئة",
      recentTransactions: "آخر العمليات",
    },
    profile: {
      dayStreak: "أيام متواصلة",
      quizzesStat: "اختبارات",
      articlesStat: "مقالات",
      settings: "الإعدادات",
      darkMode: "الوضع الداكن",
      language: "اللغة",
      notifications: "الإشعارات",
      about: "عن التطبيق",
      signOut: "تسجيل الخروج",
      themeAuto: "تلقائي",
      themeLight: "فاتح",
      themeDark: "داكن",
    },
  },
} as const;

export type TranslationKey = typeof translations.en;
