// models/SplitUp.ts
import { Schema, model, models, Document } from "mongoose";

interface Members {
  amountPaid: number;
  id: string;
  name: string;
}

export interface SplitUp extends Document {
  userId: string;
  transactionName: string;
  createdAt?: Date;
  members: Members[];
}

const MembersSchema = new Schema<Members>(
  {
    amountPaid: { type: Number, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
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
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const SplitUpModel = models.SplitUp || model<SplitUp>("SplitUp", SplitUpSchema);

export default SplitUpModel;
