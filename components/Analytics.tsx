'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ExpenseAnalytics, EXPENSE_CATEGORIES } from '@/types';

// Category colors for charts
const COLORS = [
  '#f59e0b', // Food - amber
  '#3b82f6', // Transport - blue
  '#8b5cf6', // Entertainment - purple
  '#ec4899', // Shopping - pink
  '#ef4444', // Bills - red
  '#10b981', // Healthcare - green
  '#6b7280', // Other - gray
];

interface AnalyticsProps {
  currentMonth: string;
}

export default function Analytics({ currentMonth }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?month=${currentMonth}`);
        const data = await response.json();
        
        if (data.success) {
          setAnalytics(data.data);
        } else {
          setError(data.error || 'Failed to load analytics');
        }
      } catch (err) {
        setError('Error loading analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-red-500">{error || 'No analytics data available'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Total Expenses</p>
          <p className="text-2xl font-bold">${analytics.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Monthly Budget</p>
          <p className="text-2xl font-bold">${analytics.budgetInfo.budget.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Remaining</p>
          <p className="text-2xl font-bold">${analytics.budgetInfo.remaining.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Budget Used</p>
          <p className="text-2xl font-bold">{analytics.budgetInfo.percentageUsed.toFixed(1)}%</p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Usage</span>
          <span className="text-sm font-medium text-gray-700">
            ${analytics.budgetInfo.spent.toFixed(2)} / ${analytics.budgetInfo.budget.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              analytics.budgetInfo.percentageUsed > 100
                ? 'bg-red-500'
                : analytics.budgetInfo.percentageUsed > 80
                ? 'bg-orange-500'
                : 'bg-green-500'
            }`}
            style={{
              width: `${Math.min(analytics.budgetInfo.percentageUsed, 100)}%`,
            }}
          ></div>
        </div>
        {analytics.budgetInfo.percentageUsed > 100 && (
          <p className="text-sm text-red-500 mt-2">
            ⚠️ You've exceeded your budget by ${(analytics.budgetInfo.spent - analytics.budgetInfo.budget).toFixed(2)}!
          </p>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data for this month
            </div>
          )}
        </div>

        {/* Category Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                <YAxis type="category" dataKey="category" width={100} />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data for this month
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend (if available) */}
      {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
