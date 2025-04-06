// models/SplitUp.ts
import { Schema, model, models, Document } from "mongoose";

interface Members {
  id: string;
  name: string;
  amountPaid: number;
  color: string;
}

export interface SplitUp extends Document {
  userId: string;
  transactionName: string;
  createdAt?: Date;
  members: Members[];
  category?: string;
  notes?: string;
}

const MembersSchema = new Schema<Members>(
  {
    amountPaid: { type: Number, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String },
  },
  {
    _id: false,
  }
);

const SplitUpSchema = new Schema<SplitUp>(
  {
    userId: { type: String, required: true },
    transactionName: { type: String, required: true },
    members: { type: [MembersSchema], required: true }, // Array of objects
    category: String,
    notes: String,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const SplitUpModel = models.SplitUp || model<SplitUp>("SplitUp", SplitUpSchema);

export default SplitUpModel;
