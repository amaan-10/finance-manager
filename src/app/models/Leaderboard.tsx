import { Schema, model, models } from "mongoose";

interface Leaderboard extends Document {
  userId: string;
  name: string;
  savings: number;
  points: number;
  trend: string;
  percentChange: number;
  rank: number;
  lastUpdated: Date;
}

const LeaderboardSchema = new Schema<Leaderboard>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  savings: { type: Number, required: true, default: 0 },
  points: { type: Number, required: true, default: 0 },
  trend: { type: String, enum: ["up", "down", "steady"], default: "steady" },
  percentChange: { type: Number, default: 0 },
  rank: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
});

const LeaderboardModel =
  models.Leaderboard || model<Leaderboard>("Leaderboard", LeaderboardSchema);

export default LeaderboardModel;
