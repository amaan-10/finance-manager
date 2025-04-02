import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { predefinedChallenges } from "@/lib/predefinedChallenges";
import { getAuth } from "@clerk/nextjs/server";
import UserModel from "@/app/models/User";

export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbChallenges = await ChallengeModel.find({ userId }); // Fetch challenges from MongoDB

  // Convert DB challenges to a Map for efficient lookup
  const dbChallengeMap = new Map(dbChallenges.map((c) => [c.id, c]));

  // Merge predefined challenges with database values
  const mergedChallenges = predefinedChallenges.map((pc) =>
    dbChallengeMap.has(pc.id) ? { ...dbChallengeMap.get(pc.id)._doc } : pc
  );

  return NextResponse.json(mergedChallenges, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      icon,
      total,
      daysLeft,
      difficulty,
      category,
      points,
    } = await req.json();

    const { userId } = getAuth(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const challenge = await ChallengeModel.create({
      id,
      title,
      description,
      icon,
      total,
      daysLeft: daysLeft - 1,
      difficulty,
      category,
      points,
      userId: userId,
      progress: 0,
      isCompleted: false,
      inProgress: true,
      streak: 0,
    });

    const user = await UserModel.findOne({ id: userId });

    if (challenge.progress === 0) {
      user.challengesInProgress++;
    }

    user.save();

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Error starting challenge:", error);
    return NextResponse.json(
      { error: "Failed to start challenge" },
      { status: 500 }
    );
  }
}
