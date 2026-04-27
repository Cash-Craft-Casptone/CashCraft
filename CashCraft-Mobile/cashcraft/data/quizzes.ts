// MOCK DATA — replace with API calls when backend is ready

export type Question = {
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  questions: Question[];
};

export const quizzes: Quiz[] = [
  {
    id: "1",
    title: "Budgeting Basics",
    description: "Test your knowledge of fundamental budgeting principles like the 50/30/20 rule and expense tracking.",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    questions: [
      { prompt: "What does the '50' in the 50/30/20 budgeting rule represent?", options: ["Savings", "Wants", "Needs", "Investments"], correctAnswerIndex: 2, explanation: "In the 50/30/20 rule, 50% of your after-tax income should be allocated to your needs, such as housing and food." },
      { prompt: "Which of the following is considered a 'want' rather than a 'need'?", options: ["Groceries", "Dining out", "Rent", "Utility bills"], correctAnswerIndex: 1, explanation: "Dining out is considered a discretionary expense, or a 'want', whereas groceries are a basic 'need'." },
      { prompt: "Why is it important to track your expenses?", options: ["To increase your credit score", "To understand where your money goes", "To pay less taxes", "To earn more interest"], correctAnswerIndex: 1, explanation: "Tracking your expenses helps you identify spending habits and find areas where you can cut back." },
      { prompt: "What should be the first step in creating a budget?", options: ["Calculating your income", "Setting financial goals", "Cutting expenses", "Opening a savings account"], correctAnswerIndex: 0, explanation: "You must first know how much money is coming in before you can decide how to allocate it." },
    ],
  },
  {
    id: "2",
    title: "Saving Strategies",
    description: "Learn and test your knowledge on the best ways to save money, including emergency funds and automated saving.",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    questions: [
      { prompt: "How many months of living expenses should ideally be in an emergency fund?", options: ["1-2 months", "3-6 months", "9-12 months", "24 months"], correctAnswerIndex: 1, explanation: "Financial experts generally recommend having 3-6 months of living expenses saved in case of job loss or emergency." },
      { prompt: "What is the strategy of 'paying yourself first'?", options: ["Buying what you want before paying bills", "Automating savings before spending", "Keeping all cash at home", "Using credit cards for everything"], correctAnswerIndex: 1, explanation: "Paying yourself first means routing a portion of your paycheck directly into savings before you have a chance to spend it." },
      { prompt: "Which type of account typically offers the best interest rate for an emergency fund?", options: ["Checking account", "Certificate of Deposit (CD)", "High-Yield Savings Account", "Brokerage account"], correctAnswerIndex: 2, explanation: "High-Yield Savings Accounts offer better interest rates than standard savings while keeping funds easily accessible." },
      { prompt: "True or False: Once your emergency fund is full, you should stop saving.", options: ["True", "False", "Only if you have no debt", "Only if you are retiring soon"], correctAnswerIndex: 1, explanation: "False. Once the emergency fund is established, you should redirect those savings towards other financial goals like retirement or a house." },
    ],
  },
  {
    id: "3",
    title: "Investing 101",
    description: "Test your understanding of compound interest, stocks, bonds, and basic portfolio diversification.",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    questions: [
      { prompt: "What is compound interest?", options: ["Interest earned only on the principal", "Interest earned on both the principal and accumulated interest", "A fixed fee paid to a broker", "The rate at which inflation grows"], correctAnswerIndex: 1, explanation: "Compound interest is the interest on a deposit calculated based on both the initial principal and the accumulated interest from previous periods." },
      { prompt: "Which asset class generally carries the highest risk but highest potential return?", options: ["Government Bonds", "Savings Accounts", "Stocks (Equities)", "Certificates of Deposit"], correctAnswerIndex: 2, explanation: "Stocks generally offer higher returns over the long term compared to bonds or cash, but come with higher volatility and risk." },
      { prompt: "What is diversification?", options: ["Buying only tech stocks", "Spreading investments across different assets to reduce risk", "Investing in one single mutual fund", "Keeping all money in cash"], correctAnswerIndex: 1, explanation: "Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio." },
      { prompt: "What does a 401(k) plan primarily help you save for?", options: ["A new home", "College tuition", "Retirement", "Medical expenses"], correctAnswerIndex: 2, explanation: "A 401(k) is an employer-sponsored retirement savings plan." },
    ],
  },
  {
    id: "4",
    title: "Debt Management",
    description: "Understand the difference between good and bad debt, and the best strategies to pay off balances.",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    questions: [
      { prompt: "Which of the following is typically considered 'bad debt'?", options: ["A mortgage", "A student loan", "High-interest credit card debt", "A small business loan"], correctAnswerIndex: 2, explanation: "Credit card debt usually carries very high interest rates and is used for depreciating assets, making it 'bad debt'." },
      { prompt: "What is the 'Debt Snowball' method?", options: ["Paying off the debt with the highest interest rate first", "Paying off the debt with the smallest balance first", "Consolidating all debts into one", "Ignoring debt until it goes away"], correctAnswerIndex: 1, explanation: "The snowball method involves paying off the smallest debts first to build momentum and psychological wins." },
      { prompt: "How does the 'Debt Avalanche' method differ from the Snowball method?", options: ["It focuses on highest interest rates first", "It focuses on largest balances first", "It requires bankruptcy", "It involves taking out more loans"], correctAnswerIndex: 0, explanation: "The avalanche method targets debts with the highest interest rates first to save the most money mathematically over time." },
      { prompt: "Which factor has the biggest impact on your credit score?", options: ["Credit utilization ratio", "Length of credit history", "New credit inquiries", "Payment history"], correctAnswerIndex: 3, explanation: "Payment history (making payments on time) is the most significant factor, making up about 35% of a FICO credit score." },
    ],
  },
];
