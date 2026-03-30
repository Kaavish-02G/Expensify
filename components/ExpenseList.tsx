'use client';

import { format } from 'date-fns';
import { IExpense, EXPENSE_CATEGORIES } from '@/types';

interface ExpenseListProps {
  expenses: IExpense[];
  loading: boolean;
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, loading, onEdit, onDelete }: ExpenseListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Expenses Found</h3>
        <p className="text-gray-500">
          Start by adding your first expense using the form above!
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
              <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(expense.date), 'EEEE')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{expense.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      expense.category === 'Food'
                        ? 'bg-orange-100 text-orange-800'
                        : expense.category === 'Transport'
                        ? 'bg-blue-100 text-blue-800'
                        : expense.category === 'Entertainment'
                        ? 'bg-purple-100 text-purple-800'
                        : expense.category === 'Shopping'
                        ? 'bg-pink-100 text-pink-800'
                        : expense.category === 'Bills'
                        ? 'bg-yellow-100 text-yellow-800'
                        : expense.category === 'Healthcare'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {expense.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense._id!)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{expenses.length}</span> expense
            {expenses.length !== 1 ? 's' : ''}
          </div>
          <div className="text-lg font-bold text-gray-900">
            Total: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
