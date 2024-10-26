// models/Expense.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface Expense extends Document {
  category: string;
  amount: number;
  date: Date;
  notes?: string;
  userId: string; // Add userId to associate with the user
}

const expenseSchema = new Schema<Expense>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  userId: { type: String, required: true }, // Ensure userId is required
});

const ExpenseModel = models.Expense || model<Expense>("Expense", expenseSchema);

export default ExpenseModel;
