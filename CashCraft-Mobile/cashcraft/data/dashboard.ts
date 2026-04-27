// MOCK DATA — replace with API calls when backend is ready

export const dashboardData = {
  balance: {
    total: 12450.75,
    monthlyChange: 845.20,
    monthlyChangePercent: 7.2,
  },
  income: 4200.00,
  expenses: 3354.80,
  savingsGoals: [
    { id: "1", name: "Emergency Fund", current: 8000, target: 10000, icon: "shield" },
    { id: "2", name: "Vacation", current: 1200, target: 3000, icon: "sun" },
    { id: "3", name: "New Laptop", current: 850, target: 1500, icon: "monitor" },
  ],
  spendingCategories: [
    { id: "1", name: "Housing", amount: 1500, color: "#0F4C5C" },
    { id: "2", name: "Food", amount: 600, color: "#6099A5" },
    { id: "3", name: "Transport", amount: 300, color: "#E5484D" },
    { id: "4", name: "Entertainment", amount: 200, color: "#FBBF24" },
    { id: "5", name: "Shopping", amount: 754.80, color: "#8B5CF6" },
  ],
  transactions: [
    { id: "1", date: "Today", merchant: "Whole Foods Market", category: "Food", amount: -145.20, icon: "shopping-cart" },
    { id: "2", date: "Yesterday", merchant: "TechCorp Salary", category: "Income", amount: 2100.00, icon: "briefcase" },
    { id: "3", date: "Yesterday", merchant: "Netflix", category: "Entertainment", amount: -15.99, icon: "tv" },
    { id: "4", date: "Oct 12", merchant: "Uber", category: "Transport", amount: -24.50, icon: "navigation" },
    { id: "5", date: "Oct 10", merchant: "Starbucks", category: "Food", amount: -6.45, icon: "coffee" },
    { id: "6", date: "Oct 9", merchant: "Gym Membership", category: "Health", amount: -45.00, icon: "activity" },
    { id: "7", date: "Oct 5", merchant: "Electric Bill", category: "Housing", amount: -85.00, icon: "zap" },
    { id: "8", date: "Oct 2", merchant: "Amazon", category: "Shopping", amount: -32.10, icon: "package" },
    { id: "9", date: "Oct 1", merchant: "Rent", category: "Housing", amount: -1500.00, icon: "home" },
    { id: "10", date: "Sep 28", merchant: "TechCorp Salary", category: "Income", amount: 2100.00, icon: "briefcase" },
  ],
};
