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
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '-5s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gradient">
                💰 Expensify
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Track, Analyze, and Master Your Finances
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-light px-4 py-2 rounded-full">
                <span className="text-sm text-gray-300">
                  {format(new Date(), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Budget Card */}
        <div className="mb-8 animate-slide-in">
          <BudgetCard
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            expenses={expenses}
          />
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8 animate-slide-in" style={{animationDelay: '0.1s'}}>
          <Analytics currentMonth={currentMonth} />
        </div>

        {/* Add/Edit Expense Form */}
        <div className="mb-8 animate-slide-in" style={{animationDelay: '0.2s'}}>
          <ExpenseForm
            expense={editingExpense}
            onSuccess={handleExpenseAdded}
            onCancel={() => setEditingExpense(null)}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 animate-slide-in" style={{animationDelay: '0.3s'}}>
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Expense List */}
        <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
          <ExpenseList
            expenses={filteredExpenses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="glass mt-12 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 <span className="text-gradient font-semibold">Expensify</span> - Your Personal Finance Manager
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with 💜 for better financial freedom
          </p>
        </div>
      </footer>
    </main>
  );
}
