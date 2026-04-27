// MOCK DATA — replace with API calls when backend is ready

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  author: string;
  imageUrl: any;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "Mastering the 50/30/20 Rule",
    excerpt: "Learn how to divide your income for maximum growth and stability.",
    content: "The 50/30/20 rule is a simple and effective budgeting strategy that can help you manage your money, pay down debt, and save for the future. The rule suggests that you divide your after-tax income into three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.\n\nNeeds are your essential expenses, like housing, food, transportation, and utilities. Wants are the fun things in life, like dining out, entertainment, and hobbies. Savings and debt repayment include building an emergency fund, investing for retirement, and paying off high-interest debt.\n\nBy following the 50/30/20 rule, you can ensure that you're meeting your basic needs while still enjoying your life and building wealth for the future. It's a flexible framework that you can adjust based on your individual goals and circumstances. Start by tracking your expenses and categorizing them into these three buckets. You might be surprised by where your money is going!",
    category: "Budgeting",
    readTime: 5,
    author: "Sarah Jenkins",
    imageUrl: require("@/assets/images/article-1.png"),
  },
  {
    id: "2",
    title: "The Power of Compound Interest",
    excerpt: "Why starting to invest early is the most important financial decision.",
    content: "Compound interest is often called the eighth wonder of the world, and for good reason. It's the concept of earning interest on your initial investment, as well as on the accumulated interest from previous periods. Over time, this compounding effect can lead to exponential growth in your wealth.\n\nThe key to maximizing the benefits of compound interest is to start investing as early as possible. Even small amounts invested regularly can grow significantly over decades. For example, if you invest $100 a month at an 8% annual return, you'll have over $300,000 in 30 years.\n\nDon't wait until you're older or earning more money to start investing. Time is your greatest asset when it comes to building wealth. Open an investment account today and start taking advantage of the power of compound interest. Your future self will thank you.",
    category: "Investing",
    readTime: 7,
    author: "David Chen",
    imageUrl: require("@/assets/images/article-3.png"),
  },
  {
    id: "3",
    title: "Building an Emergency Fund",
    excerpt: "How to prepare for life's unexpected expenses without stress.",
    content: "An emergency fund is a crucial component of a healthy financial plan. It's a stash of money set aside specifically for unexpected expenses, such as medical bills, car repairs, or job loss. Having an emergency fund can provide peace of mind and prevent you from going into debt when life throws you a curveball.\n\nFinancial experts generally recommend saving three to six months' worth of living expenses in an easily accessible account, such as a high-yield savings account. This may seem like a daunting goal, but you can start small. Set up automatic transfers from your checking account to your emergency fund each month, even if it's just $50 or $100.\n\nTreat your emergency fund as a non-negotiable expense, just like your rent or mortgage. By making it a priority, you'll be better prepared to handle whatever life brings your way. Remember, it's not a matter of if an emergency will happen, but when. Be ready.",
    category: "Saving",
    readTime: 4,
    author: "Emily Rodriguez",
    imageUrl: require("@/assets/images/article-2.png"),
  },
  {
    id: "4",
    title: "Crushing High-Interest Debt",
    excerpt: "Strategies for paying off credit cards and loans faster.",
    content: "High-interest debt, such as credit card balances, can be a major roadblock to achieving your financial goals. The longer you carry a balance, the more you pay in interest, making it harder to get ahead. If you're struggling with debt, it's essential to develop a strategy for paying it off as quickly as possible.\n\nTwo popular debt repayment methods are the snowball method and the avalanche method. The snowball method involves paying off your smallest debts first, while making minimum payments on the rest. This approach provides psychological wins that can keep you motivated. The avalanche method focuses on paying off the debts with the highest interest rates first, which saves you the most money in the long run.\n\nChoose the method that works best for your personality and financial situation. Cut back on unnecessary expenses, consider increasing your income through a side hustle, and direct any extra cash toward your debt. Stay disciplined and focused on your goal. You can become debt-free!",
    category: "Debt",
    readTime: 6,
    author: "Michael Thompson",
    imageUrl: require("@/assets/images/article-1.png"),
  },
  {
    id: "5",
    title: "Money Mindset Shift",
    excerpt: "Overcoming limiting beliefs to achieve financial abundance.",
    content: "Your relationship with money is largely shaped by your mindset and the beliefs you hold about wealth. If you constantly worry about not having enough or believe that rich people are greedy, you may inadvertently sabotage your own financial success. Cultivating a positive money mindset is essential for achieving abundance.\n\nStart by identifying your limiting beliefs about money. Are you afraid of success? Do you feel unworthy of wealth? Once you recognize these negative thought patterns, challenge them. Replace them with empowering beliefs, such as 'I am capable of creating wealth' and 'Money is a tool for good.'\n\nPractice gratitude for the money you currently have, and visualize yourself achieving your financial goals. Surround yourself with positive influences, read books about personal finance, and educate yourself about investing. By changing your mindset, you can open yourself up to new opportunities and attract abundance into your life.",
    category: "Mindset",
    readTime: 5,
    author: "Jessica Lee",
    imageUrl: require("@/assets/images/article-2.png"),
  },
  {
    id: "6",
    title: "Diversifying Your Portfolio",
    excerpt: "Why you shouldn't put all your financial eggs in one basket.",
    content: "Diversification is a fundamental principle of investing. It involves spreading your investments across different asset classes, such as stocks, bonds, and real estate, to reduce risk. By diversifying your portfolio, you can mitigate the impact of a decline in any single investment on your overall wealth.\n\nWhen building a diversified portfolio, consider your risk tolerance, investment goals, and time horizon. A younger investor with a long time horizon may choose to allocate a larger portion of their portfolio to stocks, which generally offer higher potential returns but also higher risk. An older investor nearing retirement may prefer a more conservative approach with a higher allocation to bonds.\n\nRegularly review and rebalance your portfolio to ensure it aligns with your goals and risk tolerance. Rebalancing involves selling investments that have performed well and buying more of those that have underperformed, to maintain your desired asset allocation. Diversification won't guarantee a profit or protect against a loss, but it's a proven strategy for managing risk over the long term.",
    category: "Investing",
    readTime: 8,
    author: "David Chen",
    imageUrl: require("@/assets/images/article-3.png"),
  },
];
