'use client';

import { format } from 'date-fns';
import { IExpense, EXPENSE_CATEGORIES } from '@/types';

interface ExpenseListProps {
  expenses: IExpense[];
  loading: boolean;
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: 'bg-gradient-to-r from-orange-400 to-orange-500',
  Transport: 'bg-gradient-to-r from-blue-400 to-blue-500',
  Entertainment: 'bg-gradient-to-r from-purple-400 to-purple-500',
  Shopping: 'bg-gradient-to-r from-pink-400 to-pink-500',
  Bills: 'bg-gradient-to-r from-red-400 to-red-500',
  Healthcare: 'bg-gradient-to-r from-green-400 to-green-500',
  Other: 'bg-gradient-to-r from-gray-400 to-gray-500',
};

export default function ExpenseList({
  expenses,
  loading,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <div className="text-8xl mb-6 animate-float">📝</div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          No expenses yet
        </h3>
        <p className="text-gray-400 text-lg">
          Start by adding your first expense using the form above!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-5 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">📋</span>
          Expense List
          <span className="glass-light px-3 py-1 rounded-full text-sm ml-2">
            {expenses.length}
          </span>
        </h2>
      </div>
      
      {/* Expense Items */}
      <div className="divide-y divide-white/5">
        {expenses.map((expense, index) => (
          <div
            key={expense._id}
            className="p-5 hover:bg-white/5 transition-all duration-300 card-hover"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {expense.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {expense.description || 'No description'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg ${categoryColors[expense.category] || categoryColors.Other}`}
                    >
                      {expense.category}
                    </span>
                    
                    <div className="glass-light px-4 py-2 rounded-xl">
                      <span className="text-gray-300 text-sm">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <span className="text-2xl font-bold text-gradient">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-3 glass-light hover:bg-blue-500/30 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Edit expense"
                >
                  ✏️
                </button>
                <button
                  onClick={() => expense._id && onDelete(expense._id)}
                  className="p-3 glass-light hover:bg-red-500/30 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Summary */}
      <div className="glass-light px-6 py-5 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium text-lg">
            Total: {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-3xl font-bold text-gradient glow-blue px-4 py-2 glass rounded-xl">
              ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
