'use client';

import { useState } from 'react';
import { IExpense } from '@/types';

interface BudgetCardProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  expenses: IExpense[];
}

export default function BudgetCard({ currentMonth, onMonthChange, expenses }: BudgetCardProps) {
  const [budget, setBudget] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate monthly expenses
  const monthlyExpenses = expenses.filter((exp) => {
    const expMonth = new Date(exp.date).toISOString().slice(0, 7);
    return expMonth === currentMonth;
  });

  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || parseFloat(budget) <= 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyBudget: parseFloat(budget),
          month: currentMonth,
        }),
      });

      if (response.ok) {
        setShowBudgetForm(false);
        // Trigger a page refresh or state update
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    onMonthChange(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    onMonthChange(date.toISOString().slice(0, 7));
  };

  const remaining = 0 - totalSpent; // This should be fetched from API
  const percentage = 0; // This should be fetched from API

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📊 Budget Overview</h2>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-gray-700 min-w-[120px] text-center">
            {currentMonth}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spent */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Spent</p>
          <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>

        {/* Monthly Budget */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Monthly Budget</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">
              ${budget ? parseFloat(budget).toFixed(2) : '0.00'}
            </p>
            <button
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
            >
              {showBudgetForm ? 'Cancel' : 'Set Budget'}
            </button>
          </div>
        </div>

        {/* Remaining */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Remaining</p>
          <p className="text-3xl font-bold">
            ${budget ? (parseFloat(budget) - totalSpent).toFixed(2) : totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Budget Form */}
      {showBudgetForm && (
        <form onSubmit={handleBudgetSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter monthly budget"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      )}

      {/* Budget Progress Bar */}
      {budget && parseFloat(budget) > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Used</span>
            <span>{Math.min(percentage, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                percentage > 90
                  ? 'bg-red-500'
                  : percentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
