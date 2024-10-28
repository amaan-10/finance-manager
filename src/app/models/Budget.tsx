// models/Budget.ts
import { Schema, model, models, Document } from "mongoose";

export interface Budget extends Document {
  amount: number;
  month: number; // You can also use a Date
  year: number;
  userId: string; // Add userId to associate with the user
}

const budgetSchema = new Schema<Budget>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true }, // e.g., '10'
  year: { type: Number, required: true }, // e.g., '2024'
});

const BudgetModel = models.Budget || model<Budget>("Budget", budgetSchema);

export default BudgetModel;
