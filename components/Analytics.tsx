'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ExpenseAnalytics, EXPENSE_CATEGORIES } from '@/types';

// Category colors for pie chart
const COLORS = [
  '#3B82F6', // Blue - Food
  '#10B981', // Green - Transport
  '#F59E0B', // Amber - Entertainment
  '#EC4899', // Pink - Shopping
  '#8B5CF6', // Purple - Bills
  '#EF4444', // Red - Healthcare
  '#6B7280', // Gray - Other
];

// Category icons
const categoryIcons: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Shopping: '🛒',
  Bills: '📄',
  Healthcare: '💊',
  Other: '📦',
};

interface AnalyticsProps {
  currentMonth: string;
}

export default function Analytics({ currentMonth }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChart, setActiveChart] = useState<'pie' | 'line'>('pie');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?month=${currentMonth}`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        } else {
          setError(data.error || 'Failed to fetch analytics');
        }
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  const pieData = analytics.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  const lineData = analytics.monthlyTrend.map((item) => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
    amount: item.amount,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-80 mb-1">Total Expenses</div>
          <div className="text-2xl font-bold">${analytics.totalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-80 mb-1">Budget Remaining</div>
          <div className="text-2xl font-bold">
            ${analytics.budgetInfo.remaining >= 0 ? '' : '-'}${Math.abs(analytics.budgetInfo.remaining).toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-80 mb-1">Budget Used</div>
          <div className="text-2xl font-bold">{analytics.budgetInfo.percentageUsed.toFixed(1)}%</div>
        </div>
      </div>

      {/* Chart Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveChart('pie')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'pie'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🥧 Category Breakdown
        </button>
        <button
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'line'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📈 Monthly Trend
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Breakdown */}
        {activeChart === 'pie' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Expenses by Category
            </h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, payload }) => `${name} (${(payload as any).percentage?.toFixed(1)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Category Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-gray-600">
                        {categoryIcons[item.name] || '📦'} {item.name}: ${item.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No expense data for this month
              </div>
            )}
          </div>
        )}

        {/* Line Chart - Monthly Trend */}
        {activeChart === 'line' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Monthly Spending Trend (Last 6 Months)
            </h3>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
                    contentStyle={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No trend data available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
