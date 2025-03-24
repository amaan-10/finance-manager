import { Schema, Document, models, model } from "mongoose";
import moment from "moment-timezone";

export interface IChallenge extends Document {
  name: string;
  goal: number;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  lastCompleted: Date;
  userId: string;
  streak: number;
  badge?: string;
  points?: number;
  id: string;
}

const ChallengeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  goal: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  lastCompleted: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate(),
  },
  isCompleted: { type: Boolean, default: false },
  isClaimed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  streak: { type: Number, default: 0 },
  badge: { type: String },
  points: { type: Number },
});

// Middleware to ensure lastCompleted is stored in IST before saving
ChallengeSchema.pre("save", function (next) {
  this.lastCompleted = moment(this.lastCompleted).tz("Asia/Kolkata").toDate();
  next();
});

const ChallengeModel =
  models.Challenge || model<IChallenge>("Challenge", ChallengeSchema);

export default ChallengeModel;
