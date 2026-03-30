'use client';

import { useState } from 'react';
import { ExpenseFilters, EXPENSE_CATEGORIES } from '@/types';

interface FiltersProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === '' ? undefined : (category as any),
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (value) {
      onFilterChange({
        ...filters,
        [field]: new Date(value),
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters[field];
      onFilterChange(newFilters);
    }
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      searchTerm: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate || filters.searchTerm;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">🔍 Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Controls */}
      <div className={`${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑️ Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
