import { Schema, Document, models, model } from "mongoose";

export interface IChallenge extends Document {
  name: string;
  goal: number;
  progress: number;
  isCompleted: boolean;
  userId: string; // User-specific challenges
  streak: number;
  badge?: string;
  id: string;
}

const ChallengeSchema = new Schema({
  id: String,
  name: String,
  goal: Number,
  progress: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  userId: String,
  streak: { type: Number, default: 0 },
  badge: { type: String },
});

const ChallengeModel =
  models.Challenge || model<IChallenge>("Challenge", ChallengeSchema);

export default ChallengeModel;
