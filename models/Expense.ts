import mongoose, { Schema, Model } from 'mongoose';
import { IExpense, EXPENSE_CATEGORIES } from '@/types';

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the expense'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: EXPENSE_CATEGORIES,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
