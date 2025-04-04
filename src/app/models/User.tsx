import { model, models, Schema } from "mongoose";

export interface User extends Document {
  id: string;
  email: string;
  name?: string;
  currentPoints: number;
  totalEarned: number;
  totalSpent: number;
  lastMonthEarned?: number;
  lastMonthSpent?: number;
  thisMonthEarned: number;
  thisMonthSpent: number;
  lastUpdatedMonth: number;
  rank: number;
  savingsGoal: number;
  currentSavings: number;
  challengesCompleted: number;
  challengesInProgress: number;
  rewardsRedeemed: number;
  streakDays: number;
  nextRewardPoints: number;
}

const UserSchema = new Schema<User>(
  {
    id: { type: String, unique: true }, // Clerk's User ID
    email: { type: String, unique: true },
    name: String,
    currentPoints: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastMonthEarned: { type: Number, default: 0 },
    lastMonthSpent: { type: Number, default: 0 },
    thisMonthEarned: { type: Number, default: 0 },
    thisMonthSpent: { type: Number, default: 0 },
    lastUpdatedMonth: { type: Number, default: new Date().getMonth() },
    rank: { type: Number },
    savingsGoal: { type: Number, default: 0 },
    currentSavings: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
    challengesInProgress: { type: Number, default: 0 },
    rewardsRedeemed: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    nextRewardPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserModel = models.User || model<User>("User", UserSchema);

export default UserModel;
