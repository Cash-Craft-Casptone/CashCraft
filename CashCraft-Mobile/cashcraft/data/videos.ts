// MOCK DATA — replace with API calls when backend is ready

export type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  instructor: string;
  imageUrl: any;
};

export const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to the Stock Market",
    description: "Learn the basics of how the stock market works, what shares are, and how to start investing safely. This comprehensive guide covers everything from market exchanges to placing your first trade.",
    category: "Investing",
    duration: "15:24",
    instructor: "David Chen",
    imageUrl: require("@/assets/images/video-1.png"),
  },
  {
    id: "2",
    title: "Creating a Bulletproof Budget",
    description: "A step-by-step walkthrough on how to create a budget that actually works for your lifestyle. We cover tracking expenses, setting realistic goals, and using the 50/30/20 framework.",
    category: "Budgeting",
    duration: "12:10",
    instructor: "Sarah Jenkins",
    imageUrl: require("@/assets/images/video-2.png"),
  },
  {
    id: "3",
    title: "Understanding Credit Scores",
    description: "Demystifying the factors that make up your credit score and actionable strategies to improve it. Learn how utilization, payment history, and credit age impact your financial reputation.",
    category: "Debt",
    duration: "18:45",
    instructor: "Michael Thompson",
    imageUrl: require("@/assets/images/video-3.png"),
  },
  {
    id: "4",
    title: "The Psychology of Spending",
    description: "Explore why we buy the things we do and how to recognize emotional spending triggers. Discover techniques for mindful consumption and aligning your purchases with your values.",
    category: "Mindset",
    duration: "22:30",
    instructor: "Jessica Lee",
    imageUrl: require("@/assets/images/video-2.png"),
  },
  {
    id: "5",
    title: "Automating Your Savings",
    description: "Set it and forget it. Learn how to automate your finances so you save money without even thinking about it. We discuss 'pay yourself first' strategies and optimal account setups.",
    category: "Saving",
    duration: "10:15",
    instructor: "Emily Rodriguez",
    imageUrl: require("@/assets/images/video-1.png"),
  },
  {
    id: "6",
    title: "Retirement Accounts Explained",
    description: "A breakdown of 401(k)s, IRAs, Roth vs. Traditional accounts, and how to choose the right vehicles for your retirement savings. Start planning your future today.",
    category: "Investing",
    duration: "25:00",
    instructor: "David Chen",
    imageUrl: require("@/assets/images/video-3.png"),
  },
];
