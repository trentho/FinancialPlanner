export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate?: string;
  category?: string;
  isRecurring?: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

export interface FinancialData {
  paycheck: number;
  bills: Bill[];
  expenses: Expense[];
  remainingMoney: number;
  savingsGoals?: SavingsGoal[];
}