'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IBudget, IExpense } from '@/types';

interface BudgetCardProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  expenses: IExpense[];
}

export default function BudgetCard({
  currentMonth,
  onMonthChange,
  expenses,
}: BudgetCardProps) {
  const [budget, setBudget] = useState<IBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const monthExpenses = expenses.filter((exp) => {
    const expenseMonth = format(new Date(exp.date), 'yyyy-MM');
    return expenseMonth === currentMonth;
  });

  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/budget?month=${currentMonth}`);
        const data = await response.json();
        if (data.success) {
          setBudget(data.data);
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [currentMonth]);

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyBudget: parseFloat(budgetAmount),
          month: currentMonth,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBudget(data.data);
        setShowBudgetForm(false);
        setBudgetAmount('');
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentMonth + '-01');
    if (direction === 'prev') {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    onMonthChange(format(currentDate, 'yyyy-MM'));
  };

  const percentageUsed = budget
    ? (totalSpent / budget.monthlyBudget) * 100
    : 0;
  const remaining = budget ? budget.monthlyBudget - totalSpent : 0;

  const displayMonth = format(new Date(currentMonth + '-01'), 'MMMM yyyy');

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">💵</span> Budget Overview
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMonthChange('prev')}
              className="p-2 glass-light hover:bg-white/20 rounded-lg transition-all duration-300 text-white"
            >
              ◀
            </button>
            <span className="glass-light px-4 py-2 rounded-full text-white font-semibold min-w-[140px] text-center">
              {displayMonth}
            </span>
            <button
              onClick={() => handleMonthChange('next')}
              className="p-2 glass-light hover:bg-white/20 rounded-lg transition-all duration-300 text-white"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-24 bg-white/10 rounded-2xl"></div>
          </div>
        ) : budget ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 text-center card-hover">
                <div className="text-sm text-blue-300 font-medium mb-2">Budget</div>
                <div className="text-2xl font-bold text-white">
                  ${budget.monthlyBudget.toFixed(2)}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 text-center card-hover">
                <div className="text-sm text-orange-300 font-medium mb-2">Spent</div>
                <div className="text-2xl font-bold text-white">
                  ${totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 text-center card-hover">
                <div className="text-sm text-green-300 font-medium mb-2">Remaining</div>
                <div className="text-2xl font-bold text-white">
                  ${remaining.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-300">
                  {percentageUsed.toFixed(1)}% used
                </span>
                <span className="text-gray-300">
                  {monthExpenses.length} expense{monthExpenses.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-full glass-light rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    percentageUsed > 100
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : percentageUsed > 80
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                      : 'bg-gradient-to-r from-green-400 to-green-500'
                  }`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Messages */}
            {percentageUsed > 100 && (
              <div className="glass rounded-xl p-4 border border-red-500/30">
                <p className="font-semibold text-red-400 flex items-center gap-2">
                  ⚠️ Budget Exceeded!
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  You've spent ${Math.abs(remaining).toFixed(2)} more than your budget.
                </p>
              </div>
            )}
            {percentageUsed >= 80 && percentageUsed <= 100 && (
              <div className="glass rounded-xl p-4 border border-orange-500/30">
                <p className="font-semibold text-orange-400 flex items-center gap-2">
                  ⚠️ Warning: Budget Almost Full!
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  You've used {percentageUsed.toFixed(1)}% of your budget.
                </p>
              </div>
            )}
            {percentageUsed < 80 && budget && (
              <div className="glass rounded-xl p-4 border border-green-500/30">
                <p className="font-semibold text-green-400 flex items-center gap-2">
                  ✅ On Track!
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  You've used {percentageUsed.toFixed(1)}% of your budget.
                </p>
              </div>
            )}

            {/* Edit Button */}
            <button
              onClick={() => {
                setBudgetAmount(budget.monthlyBudget.toString());
                setShowBudgetForm(true);
              }}
              className="w-full py-3 glass-light hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300"
            >
              ✏️ Edit Budget
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-7xl mb-5 animate-float">💰</div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Set Your Monthly Budget
            </h3>
            <p className="text-gray-400 mb-6">
              Start by setting a budget for {displayMonth}
            </p>
            <button
              onClick={() => setShowBudgetForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg glow-purple"
            >
              Set Budget
            </button>
          </div>
        )}

        {/* Budget Form */}
        {showBudgetForm && (
          <form onSubmit={handleBudgetSubmit} className="mt-6 p-5 glass rounded-2xl">
            <h4 className="font-semibold text-white mb-4">Set Monthly Budget</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowBudgetForm(false)}
                className="flex-1 py-3 px-4 glass-light text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
