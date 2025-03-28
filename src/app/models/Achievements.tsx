import moment from "moment";
import { model, models, Schema } from "mongoose";

export interface Achievements extends Document {
  userId: string;
  title: string;
  description: string;
  date: Date;
  icon: string;
}

const AchievementsSchema = new Schema<Achievements>({
  userId: { type: String, required: true, unique: true }, // Clerk's User ID
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  icon: { type: String },
});

const AchievementsModel =
  models.Achievements ||
  model<Achievements>("Achievements", AchievementsSchema);

export default AchievementsModel;
