'use client';

import { format } from 'date-fns';
import { IExpense } from '@/types';

interface ExpenseListProps {
  expenses: IExpense[];
  loading: boolean;
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string) => void;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Shopping: '🛒',
  Bills: '📄',
  Healthcare: '💊',
  Other: '📦',
};

export default function ExpenseList({ expenses, loading, onEdit, onDelete }: ExpenseListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading expenses...</span>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Expenses Yet</h3>
        <p className="text-gray-500">Start tracking your expenses by adding your first entry above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Expense List ({expenses.length})
        </h2>
        <div className="text-gray-600">
          Total: <span className="font-bold text-blue-600">
            ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Category Icon */}
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
                {categoryIcons[expense.category] || '📦'}
              </div>

              {/* Expense Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800 truncate">{expense.title}</h4>
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span>📅 {format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  {expense.description && (
                    <span className="truncate max-w-xs">{expense.description}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Amount and Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ${expense.amount.toFixed(2)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit expense"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(expense._id!)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
