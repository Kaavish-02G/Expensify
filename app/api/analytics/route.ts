import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Budget from '@/models/Budget';
import { EXPENSE_CATEGORIES } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month'); // Format: YYYY-MM

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    // Get start and end of month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get all expenses for the month
    const expenses = await Expense.find({
      date: { $gte: startDate, $lt: endDate },
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category breakdown
    const categoryBreakdown = EXPENSE_CATEGORIES.map((category) => {
      const categoryExpenses = expenses.filter((exp) => exp.category === category);
      const amount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      };
    }).filter((item) => item.amount > 0);

    // Get budget info
    const budget = await Budget.findOne({ month });
    const monthlyBudget = budget?.monthlyBudget || 0;

    const budgetInfo = {
      budget: monthlyBudget,
      spent: totalExpenses,
      remaining: monthlyBudget - totalExpenses,
      percentageUsed: monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0,
    };

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const trendDate = new Date(startDate);
      trendDate.setMonth(trendDate.getMonth() - i);
      const trendMonth = trendDate.toISOString().slice(0, 7);
      
      const trendStart = new Date(trendMonth + '-01');
      const trendEnd = new Date(trendStart);
      trendEnd.setMonth(trendEnd.getMonth() + 1);

      const trendExpenses = await Expense.find({
        date: { $gte: trendStart, $lt: trendEnd },
      });

      const amount = trendExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      monthlyTrend.push({ month: trendMonth, amount });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalExpenses,
        categoryBreakdown,
        monthlyTrend,
        budgetInfo,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
