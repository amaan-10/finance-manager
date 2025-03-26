import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import RewardModel from "@/app/models/Reward";
import { predefinedRewards } from "@/lib/predefinedRewards";

export async function GET() {
  await connectToDatabase(); // Ensure MongoDB is connected
  const dbReward = await RewardModel.find(); // Fetch challenges from MongoDB

  // Convert DB challenges to a Map for efficient lookup
  const dbRewardMap = new Map(dbReward.map((c) => [c.id, c]));

  // Merge predefined challenges with database values
  const mergedReward = predefinedRewards.map((pr) =>
    dbRewardMap.has(pr.id) ? { ...dbRewardMap.get(pr.id)._doc } : pr
  );

  return NextResponse.json(mergedReward, { status: 200 });
}

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       id,
//       title,
//       description,
//       icon,
//       total,
//       daysLeft,
//       difficulty,
//       category,
//       points,
//     } = await req.json();

//     const { userId } = getAuth(req);
//     if (!userId)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const challenge = await ChallengeModel.create({
//       id,
//       title,
//       description,
//       icon,
//       total,
//       daysLeft,
//       difficulty,
//       category,
//       points,
//       userId: userId,
//       progress: 0,
//       isCompleted: false,
//       isClaimed: false,
//       streak: 0,
//     });

//     return NextResponse.json(challenge, { status: 201 });
//   } catch (error) {
//     console.error("Error starting challenge:", error);
//     return NextResponse.json(
//       { error: "Failed to start challenge" },
//       { status: 500 }
//     );
//   }
// }
