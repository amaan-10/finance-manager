// models/Budget.ts
import { Schema, model, Document } from "mongoose";

export interface Budget extends Document {
  category: string;
  amount: number;
  month: string; // You can also use a Date
}

const budgetSchema = new Schema<Budget>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., '2024-10'
});

const BudgetModel = model<Budget>("Budget", budgetSchema);

export default BudgetModel;
