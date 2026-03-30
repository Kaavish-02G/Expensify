import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';

// GET budget for a specific month
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    let budget = await Budget.findOne({ month });

    // If no budget exists for this month, return default
    if (!budget) {
      budget = { month, monthlyBudget: 0 };
    }

    return NextResponse.json({ success: true, data: budget });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST - Create or update budget
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { month, monthlyBudget } = body;

    // Upsert: update if exists, create if doesn't
    const budget = await Budget.findOneAndUpdate(
      { month },
      { monthlyBudget },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: budget });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
