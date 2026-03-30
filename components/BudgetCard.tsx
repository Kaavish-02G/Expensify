'use client';

import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { IExpense, IBudget } from '@/types';

interface BudgetCardProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  expenses: IExpense[];
}

export default function BudgetCard({ currentMonth, onMonthChange, expenses }: BudgetCardProps) {
  const [budget, setBudget] = useState<IBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch budget for current month
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/budget?month=${currentMonth}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setBudget(data.data);
          setBudgetAmount(data.data.monthlyBudget.toString());
        } else {
          setBudget(null);
          setBudgetAmount('');
        }
      } catch (err) {
        console.error('Error fetching budget:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [currentMonth]);

  // Calculate expenses for current month
  const monthExpenses = expenses.filter((exp) => {
    const expenseMonth = format(new Date(exp.date), 'yyyy-MM');
    return expenseMonth === currentMonth;
  });

  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyBudget = budget?.monthlyBudget || 0;
  const remaining = monthlyBudget - totalSpent;
  const percentageUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  // Navigate months
  const goToPreviousMonth = () => {
    const date = parse(currentMonth, 'yyyy-MM', new Date());
    date.setMonth(date.getMonth() - 1);
    onMonthChange(format(date, 'yyyy-MM'));
  };

  const goToNextMonth = () => {
    const date = parse(currentMonth, 'yyyy-MM', new Date());
    date.setMonth(date.getMonth() + 1);
    onMonthChange(format(date, 'yyyy-MM'));
  };

  const goToCurrentMonth = () => {
    onMonthChange(format(new Date(), 'yyyy-MM'));
  };

  // Save budget
  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          monthlyBudget: parseFloat(budgetAmount),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBudget(data.data);
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setSaving(false);
    }
  };

  const monthName = format(parse(currentMonth, 'yyyy-MM', new Date()), 'MMMM yyyy');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ◀
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
          {currentMonth !== format(new Date(), 'yyyy-MM') && (
            <button
              onClick={goToCurrentMonth}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              Go to current month
            </button>
          )}
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Budget Status */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Budget Amount Display */}
          <div className="text-center mb-6">
            {monthlyBudget > 0 ? (
              <>
                <p className="text-gray-600 text-sm mb-1">Monthly Budget</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  ${monthlyBudget.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No budget set for this month</p>
            )}
          </div>

          {/* Budget Progress */}
          {monthlyBudget > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent: <strong className="text-gray-900">${totalSpent.toFixed(2)}</strong></span>
                <span className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    percentageUsed > 100
                      ? 'bg-red-500'
                      : percentageUsed > 80
                      ? 'bg-orange-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {percentageUsed.toFixed(1)}% of budget used
              </p>
            </div>
          )}

          {/* Set/Edit Budget Button */}
          <div className="text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {monthlyBudget > 0 ? '✏️ Edit Budget' : '💰 Set Budget'}
            </button>
          </div>

          {/* Budget Form */}
          {showForm && (
            <form onSubmit={handleSaveBudget} className="mt-4 pt-4 border-t">
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="Enter budget amount"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
