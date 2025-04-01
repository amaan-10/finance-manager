import moment from "moment";
import { model, models, Schema } from "mongoose";

export interface RecentActivity extends Document {
  userId: string;
  type: string;
  title: string;
  points: number;
  date: Date;
  icon: string;
}

const RecentActivitySchema = new Schema<RecentActivity>({
  userId: { type: String, required: true }, // Clerk's User ID
  type: { type: String, required: true },
  title: { type: String, required: true },
  points: { type: Number },
  date: { type: Date, default: Date.now },
  icon: { type: String },
});

const RecentActivityModel =
  models.RecentActivity ||
  model<RecentActivity>("RecentActivity", RecentActivitySchema);

export default RecentActivityModel;
