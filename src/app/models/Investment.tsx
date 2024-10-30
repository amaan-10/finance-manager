// models/Investment.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

interface Investment extends Document {
  userId: string; // Reference to the user
  type: string; // Stocks, crypto, mutual funds, etc.
  name?: string;
  amount: number; // Initial investment amount
  date: Date; // Date of investment
  currentValue?: number; // Current value (optional)
  status?: string; // e.g., "active" or "sold"
}

const InvestmentSchema = new Schema<Investment>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  currentValue: { type: Number },
  status: { type: String, default: "active" },
});

const InvestmentModel =
  models.Investment || model<Investment>("Investment", InvestmentSchema);

export default InvestmentModel;
