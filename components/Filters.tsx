'use client';

import { ExpenseFilters, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';
import { format } from 'date-fns';

interface FiltersProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleChange = (key: keyof ExpenseFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate || filters.searchTerm;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="min-w-[150px]">
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value as ExpenseCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="min-w-[150px]">
          <input
            type="date"
            value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleChange('startDate', e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start Date"
          />
        </div>

        {/* End Date */}
        <div className="min-w-[150px]">
          <input
            type="date"
            value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleChange('endDate', e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="End Date"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.category && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Category: {filters.category}
            </span>
          )}
          {filters.startDate && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              From: {format(filters.startDate, 'MMM dd, yyyy')}
            </span>
          )}
          {filters.endDate && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              To: {format(filters.endDate, 'MMM dd, yyyy')}
            </span>
          )}
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Search: "{filters.searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
