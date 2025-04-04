import { model, models, Schema } from "mongoose";

export interface Redemption extends Partial<Document> {
  userId: string;
  rewardId: string;
  pointsSpent: number;
  title?: string;
  description?: string;
  redeemedAt: Date;
  image: string;
}

const RedemptionSchema = new Schema<Redemption>({
  userId: { type: String },
  rewardId: { type: String },
  title: { type: String },
  description: { type: String },
  pointsSpent: { type: Number },
  redeemedAt: { type: Date, default: Date.now },
  image: { type: String },
});

const RedemptionModel =
  models.Redemption || model<Redemption>("Redemption", RedemptionSchema);

export default RedemptionModel;
