// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Expense Interface
export interface IExpense {
  _id?: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Budget Interface
export interface IBudget {
  _id?: string;
  monthlyBudget: number;
  month: string; // Format: "YYYY-MM"
  createdAt?: Date;
  updatedAt?: Date;
}

// Analytics Data
export interface ExpenseAnalytics {
  totalExpenses: number;
  categoryBreakdown: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    amount: number;
  }[];
  budgetInfo: {
    budget: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  };
}

// Filter Options
export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  category?: ExpenseCategory;
  searchTerm?: string;
}
