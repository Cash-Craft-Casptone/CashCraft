// MOCK DATA — replace with API calls when backend is ready

export type Quote = {
  id: string;
  text: string;
  author: string;
};

export const quotes: Quote[] = [
  { id: "1", text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { id: "2", text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { id: "3", text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { id: "4", text: "Money grows on the tree of persistence.", author: "Japanese Proverb" },
  { id: "5", text: "Every time you borrow money, you're robbing your future self.", author: "Nathan W. Morris" },
  { id: "6", text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order.", author: "T.T. Munger" },
];
