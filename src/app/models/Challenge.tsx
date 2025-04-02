import { Schema, Document, models, model } from "mongoose";
import moment from "moment-timezone";

export interface IChallenge extends Document {
  id: string;
  title: string;
  description: string;
  icon: string;
  total: number;
  progress: number;
  daysLeft: number;
  isCompleted: boolean;
  inProgress: boolean;
  lastCompleted: Date;
  userId: string;
  streak: number;
  badge?: string;
  points?: number;
  difficulty: string;
  category: string;
}

const ChallengeSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  total: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  daysLeft: { type: Number, required: true },
  lastCompleted: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  inProgress: { type: Boolean, default: false },
  userId: { type: String, required: true },
  streak: { type: Number, default: 0 },
  badge: { type: String },
  points: { type: Number },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
});

// Middleware to ensure lastCompleted is stored in IST before saving
ChallengeSchema.pre("save", function (next) {
  this.lastCompleted = moment(this.lastCompleted).tz("Asia/Kolkata").toDate();
  next();
});

const ChallengeModel =
  models.Challenge || model<IChallenge>("Challenge", ChallengeSchema);

export default ChallengeModel;
