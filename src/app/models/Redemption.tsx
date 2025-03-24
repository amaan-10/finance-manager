import { model, models, Schema } from "mongoose";

export interface Redemption extends Document {
  userId: string;
  pointsSpent?: number;
  rewardName?: string;
  date: Date;
}

const RedemptionSchema = new Schema<Redemption>({
  userId: { type: String },
  rewardName: String,
  pointsSpent: Number,
  date: { type: Date, default: Date.now },
});

const RedemptionModel =
  models.Redemption || model<Redemption>("Redemption", RedemptionSchema);

export default RedemptionModel;
