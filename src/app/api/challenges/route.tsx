import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { predefinedChallenges } from "@/lib/predefinedChallenges";
import { getAuth } from "@clerk/nextjs/server";

export async function GET() {
  await connectToDatabase(); // Ensure MongoDB is connected
  const dbChallenges = await ChallengeModel.find(); // Fetch challenges from MongoDB

  // Convert DB challenges to a Map for efficient lookup
  const dbChallengeMap = new Map(dbChallenges.map((c) => [c.id, c]));

  // Merge predefined challenges with database values
  const mergedChallenges = predefinedChallenges.map((pc) =>
    dbChallengeMap.has(pc.id) ? { ...dbChallengeMap.get(pc.id)._doc } : pc
  );

  return NextResponse.json(mergedChallenges, { status: 200 });
}

// export async function POST(req: Request) {
//   try {
//     const { name, goal, userId } = await req.json();
//     await connectToDatabase(); // Ensure MongoDB is connected
//     const newChallenge = new ChallengeModel({ name, goal, userId });
//     await newChallenge.save();

//     return NextResponse.json(newChallenge, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create challenge" },
//       { status: 500 }
//     );
//   }
// }

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
      daysLeft,
      difficulty,
      category,
      points,
      userId: userId,
      progress: 0,
      isCompleted: false,
      isClaimed: false,
      streak: 0,
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Error starting challenge:", error);
    return NextResponse.json(
      { error: "Failed to start challenge" },
      { status: 500 }
    );
  }
}
