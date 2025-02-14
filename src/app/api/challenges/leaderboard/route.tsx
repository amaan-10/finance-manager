import ChallengeModel from "@/app/models/Challenge";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const leaderboard = await ChallengeModel.aggregate([
    { $group: { _id: "$userId", totalSavings: { $sum: "$progress" } } },
    { $sort: { totalSavings: -1 } },
  ]);

  return NextResponse.json(leaderboard);
}
