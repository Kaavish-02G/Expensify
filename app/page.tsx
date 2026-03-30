'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Analytics from '@/components/Analytics';
import BudgetCard from '@/components/BudgetCard';
import Filters from '@/components/Filters';
import { IExpense, ExpenseFilters } from '@/types';

export default function Home() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
        setFilteredExpenses(data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...expenses];

    if (filters.category) {
      filtered = filtered.filter((exp) => exp.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (exp) => new Date(exp.date) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter((exp) => new Date(exp.date) <= filters.endDate!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(term) ||
          exp.description?.toLowerCase().includes(term)
      );
    }

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  const handleExpenseAdded = () => {
    fetchExpenses();
    setEditingExpense(null);
  };

  const handleEdit = (expense: IExpense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            💰 Expensify
          </h1>
          <p className="text-gray-600 mt-2">Track, Analyze, and Manage Your Expenses</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Budget Card */}
        <div className="mb-8">
          <BudgetCard
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            expenses={expenses}
          />
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <Analytics currentMonth={currentMonth} />
        </div>

        {/* Add/Edit Expense Form */}
        <div className="mb-8">
          <ExpenseForm
            expense={editingExpense}
            onSuccess={handleExpenseAdded}
            onCancel={() => setEditingExpense(null)}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 Expensify - Your Personal Finance Manager</p>
        </div>
      </footer>
    </main>
  );
}
