import { model, models, Schema } from "mongoose";

export interface User extends Document {
  id: string;
  email: string;
  name?: string;
  points?: number;
  rank: number;
  savingsGoal: number;
  currentSavings: number;
  challengesCompleted: number;
  challengesInProgress: number;
  rewardsRedeemed: number;
  streakDays: number;
  nextRewardPoints: number;
  pointsThisMonth: number;
}

const UserSchema = new Schema<User>({
  id: { type: String, unique: true }, // Clerk's User ID
  email: { type: String, unique: true },
  name: String,
  points: { type: Number, default: 0 },
  rank: { type: Number },
  savingsGoal: { type: Number, default: 0 },
  currentSavings: { type: Number, default: 0 },
  challengesCompleted: { type: Number, default: 0 },
  challengesInProgress: { type: Number, default: 0 },
  rewardsRedeemed: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  nextRewardPoints: { type: Number, default: 0 },
  pointsThisMonth: { type: Number, default: 0 },
});

const UserModel = models.User || model<User>("User", UserSchema);

export default UserModel;
