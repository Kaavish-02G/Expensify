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
import { ExpenseAnalytics } from '@/types';

interface AnalyticsProps {
  currentMonth: string;
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee'];

export default function Analytics({ currentMonth }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?month=${currentMonth}`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-white/10 rounded-2xl"></div>
            <div className="h-80 bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-lg">Unable to load analytics</p>
      </div>
    );
  }

  const pieData = analytics.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  const trendData = analytics.monthlyTrend.map((item) => ({
    month: item.month,
    amount: item.amount,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 card-hover glow-blue">
          <div className="text-sm text-blue-300 mb-2 font-medium">Total Expenses</div>
          <div className="text-3xl font-bold text-white">${analytics.totalExpenses.toFixed(2)}</div>
        </div>
        
        <div className="glass rounded-2xl p-6 card-hover">
          <div className="text-sm text-green-300 mb-2 font-medium">Budget Remaining</div>
          <div className="text-3xl font-bold text-white">${analytics.budgetInfo.remaining.toFixed(2)}</div>
        </div>
        
        <div className="glass rounded-2xl p-6 card-hover glow-purple">
          <div className="text-sm text-purple-300 mb-2 font-medium">Budget Used</div>
          <div className="text-3xl font-bold text-white">{analytics.budgetInfo.percentageUsed.toFixed(1)}%</div>
        </div>
        
        <div className="glass rounded-2xl p-6 card-hover glow-pink">
          <div className="text-sm text-pink-300 mb-2 font-medium">Categories</div>
          <div className="text-3xl font-bold text-white">{analytics.categoryBreakdown.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📊</span> Expense Breakdown
          </h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                  formatter={(value) => `$${Number(value).toFixed(2)}`} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="glass-strong rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📈</span> Monthly Trend
          </h3>
          {analytics.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                  formatter={(value) => `$${Number(value).toFixed(2)}`} 
                />
                <Legend />
                <Bar dataKey="amount" fill="#a78bfa" name="Expenses" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-400">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Budget Progress */}
      <div className="glass-strong rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">💰</span> Budget Progress
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-300">
              ${analytics.budgetInfo.spent.toFixed(2)} of ${analytics.budgetInfo.budget.toFixed(2)}
            </span>
            <span className="font-semibold text-gradient">
              {analytics.budgetInfo.percentageUsed.toFixed(1)}% used
            </span>
          </div>
          <div className="w-full glass-light rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                analytics.budgetInfo.percentageUsed > 100
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : analytics.budgetInfo.percentageUsed > 80
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                  : 'bg-gradient-to-r from-green-400 to-green-500'
              }`}
              style={{ width: `${Math.min(analytics.budgetInfo.percentageUsed, 100)}%` }}
            ></div>
          </div>
          {analytics.budgetInfo.percentageUsed > 100 && (
            <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
              ⚠️ You've exceeded your budget by ${Math.abs(analytics.budgetInfo.remaining).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Category Details */}
      <div className="glass-strong rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">📋</span> Category Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-semibold text-gray-300">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-300">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-300">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categoryBreakdown.map((catItem, idx) => (
                <tr key={catItem.category} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                      <span className="font-medium text-white">{catItem.category}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-white">
                    ${catItem.amount.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-4 text-gray-400">
                    {catItem.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
