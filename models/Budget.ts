import mongoose, { Schema, Model } from 'mongoose';
import { IBudget } from '@/types';

const BudgetSchema = new Schema<IBudget>(
  {
    monthlyBudget: {
      type: Number,
      required: [true, 'Please provide a monthly budget'],
      min: [0, 'Budget cannot be negative'],
    },
    month: {
      type: String,
      required: [true, 'Please provide a month'],
      unique: true,
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for month
BudgetSchema.index({ month: 1 });

const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
