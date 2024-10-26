// models/Income.ts
import { Schema, model, Document } from "mongoose";

export interface Income extends Document {
  source: string;
  amount: number;
  date: Date;
}

const incomeSchema = new Schema<Income>({
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const IncomeModel = model<Income>("Income", incomeSchema);

export default IncomeModel;
