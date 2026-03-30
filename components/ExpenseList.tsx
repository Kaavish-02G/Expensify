'use client';

import { format } from 'date-fns';
import { IExpense, EXPENSE_CATEGORIES } from '@/types';

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
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Expenses Yet</h3>
        <p className="text-gray-500">
          Start tracking your expenses by adding your first entry above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{categoryIcons[expense.category] || '📦'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{expense.title}</p>
                      {expense.description && (
                        <p className="text-sm text-gray-500">{expense.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getCategoryColor(expense.category) + '20',
                      color: getCategoryColor(expense.category),
                    }}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense._id!)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Total: <strong>{expenses.length}</strong> expense{expenses.length !== 1 ? 's' : ''}
          </span>
          <span className="text-gray-900 font-semibold">
            Total Amount: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper function to get category colors
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Food: '#f59e0b',
    Transport: '#3b82f6',
    Entertainment: '#8b5cf6',
    Shopping: '#ec4899',
    Bills: '#ef4444',
    Healthcare: '#10b981',
    Other: '#6b7280',
  };
  return colors[category] || '#6b7280';
}
