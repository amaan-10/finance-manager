import ChallengeModel from "@/app/models/Challenge";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const leaderboard = await ChallengeModel.aggregate([
    {
      $group: {
        _id: "$userId",
        totalPoints: {
          $sum: {
            $cond: { if: "$isClaimed", then: "$points", else: 0 },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        userId: "$id",
        name: "$user.name",
        totalPoints: 1,
      },
    },
    { $sort: { totalPoints: -1 } },
  ]);

  return NextResponse.json(leaderboard);
}
