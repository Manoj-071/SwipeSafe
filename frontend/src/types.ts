export interface PurchaseRecord {
  amount: number;
  date: string; // ISO date string
  verdict: 'safe' | 'caution' | 'risky' | 'blocked';
  utilizationBefore: number;
  utilizationAfter: number;
  reasoning: string;
}

export interface CardProfile {
  cardLimit: number; // Credit limit in ₹
  outstandingBalance: number; // Current outstanding balance in ₹
  dueDate: number; // Day of the month (1-31)
  repaymentPattern: 'full' | 'minimum' | 'depends';
  apr: number; // Annual percentage rate, e.g. 0.36
  purchaseHistory: PurchaseRecord[];
}
