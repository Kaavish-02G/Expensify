'use client';

import { useState, useEffect } from 'react';
import { IExpense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';

interface ExpenseFormProps {
  expense?: IExpense | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '' as ExpenseCategory | '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const url = expense?._id ? `/api/expenses/${expense._id}` : '/api/expenses';
      const method = expense?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          description: formData.description,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
        setFormData({
          title: '',
          amount: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Healthcare: '💊',
    Other: '📦',
  };

  return (
    <div className="glass-strong rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">{expense ? '✏️' : '➕'}</span>
        {expense ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Grocery Shopping"
            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Amount and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount ($) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 ${
                  formData.category === cat
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105 shadow-lg glow-blue'
                    : 'glass-light hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{categoryIcons[cat]}</span>
                <span className="text-sm font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add any additional notes..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-lg glow-purple"
          >
            {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
          </button>
          
          {expense && (
            <button
              type="button"
              onClick={onCancel}
              className="py-4 px-6 glass-light text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
