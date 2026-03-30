'use client';

import { ExpenseFilters, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';

interface FiltersProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleChange = (
    key: keyof ExpenseFilters,
    value: string | Date | undefined
  ) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-3">
          <span className="text-2xl">🔍</span> Filter Expenses
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchTerm || ''}
              onChange={(e) => handleChange('searchTerm', e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-3 rounded-xl"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              handleChange('category', e.target.value as ExpenseCategory | undefined)
            }
            className="w-full px-4 py-3 rounded-xl"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={
              filters.startDate
                ? new Date(filters.startDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              handleChange('startDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            className="w-full px-4 py-3 rounded-xl"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={
              filters.endDate
                ? new Date(filters.endDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              handleChange('endDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            className="w-full px-4 py-3 rounded-xl"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <p className="text-sm text-gray-400 mb-3">Quick Filters:</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const today = new Date();
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              onFilterChange({
                ...filters,
                startDate: startOfMonth,
                endDate: undefined,
              });
            }}
            className="px-4 py-2 text-sm glass-light hover:bg-blue-500/30 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            📅 This Month
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              onFilterChange({
                ...filters,
                startDate: startOfWeek,
                endDate: undefined,
              });
            }}
            className="px-4 py-2 text-sm glass-light hover:bg-green-500/30 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            📆 This Week
          </button>
          <button
            onClick={() => {
              const today = new Date();
              onFilterChange({
                ...filters,
                startDate: undefined,
                endDate: today,
              });
            }}
            className="px-4 py-2 text-sm glass-light hover:bg-purple-500/30 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            📍 Today
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              onFilterChange({
                ...filters,
                startDate: last7Days,
                endDate: undefined,
              });
            }}
            className="px-4 py-2 text-sm glass-light hover:bg-orange-500/30 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            ⏰ Last 7 Days
          </button>
        </div>
      </div>
    </div>
  );
}
