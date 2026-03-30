'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { IExpense, IBudget } from '@/types';

interface BudgetCardProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  expenses: IExpense[];
}

export default function BudgetCard({ currentMonth, onMonthChange, expenses }: BudgetCardProps) {
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  // Calculate monthly expenses
  const monthlyExpenses = expenses
    .filter((exp) => format(new Date(exp.date), 'yyyy-MM') === currentMonth)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const remaining = budget - monthlyExpenses;
  const percentageUsed = budget > 0 ? (monthlyExpenses / budget) * 100 : 0;

  // Fetch budget from API
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`/api/budget?month=${currentMonth}`);
        const data = await response.json();
        if (data.success && data.data?.monthlyBudget) {
          setBudget(data.data.monthlyBudget);
        } else {
          setBudget(0);
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
      }
    };
    fetchBudget();
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth + '-01');
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(format(prev, 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth + '-01');
    next.setMonth(next.getMonth() + 1);
    onMonthChange(format(next, 'yyyy-MM'));
  };

  const handleSaveBudget = async () => {
    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          monthlyBudget: budgetValue,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBudget(budgetValue);
        setShowEditBudget(false);
        setNewBudget('');
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = () => {
    if (percentageUsed >= 100) return 'bg-red-500';
    if (percentageUsed >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (budget === 0) return 'Set a budget to track your spending';
    if (percentageUsed >= 100) return '⚠️ Budget Exceeded!';
    if (percentageUsed >= 80) return '⚡ Approaching budget limit';
    return '✅ Within budget';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ◀
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Budget Display */}
      {showEditBudget ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget ($)
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Enter your budget"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveBudget}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Budget'}
            </button>
            <button
              onClick={() => {
                setShowEditBudget(false);
                setNewBudget('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Budget Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Monthly Budget</div>
              <div className="text-2xl font-bold text-blue-600">
                ${budget.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Spent</div>
              <div className="text-2xl font-bold text-green-600">
                ${monthlyExpenses.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Remaining */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">
              {remaining >= 0 ? '💵 Remaining' : '📉 Over Budget'}
            </div>
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </div>
          </div>

          {/* Progress Bar */}
          {budget > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Budget Used</span>
                <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${getProgressColor()} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Message */}
          <p className="text-center text-sm text-gray-600 mb-4">
            {getStatusText()}
          </p>

          {/* Edit Budget Button */}
          <button
            onClick={() => {
              setShowEditBudget(true);
              setNewBudget(budget.toString());
            }}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {budget === 0 ? '💰 Set Budget' : '✏️ Edit Budget'}
          </button>
        </>
      )}
    </div>
  );
}
