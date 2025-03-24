import { model, models, Schema } from "mongoose";

export interface Reward extends Document {
  userId: string;
  pointsEarned?: number;
  reason?: string;
  date: Date;
}

const RewardSchema = new Schema<Reward>({
  userId: { type: String },
  pointsEarned: Number,
  reason: String,
  date: { type: Date, default: Date.now },
});

const RewardModel = models.Reward || model<Reward>("Reward", RewardSchema);

export default RewardModel;
