import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import { predefinedChallenges } from "@/lib/predefinedChallenges";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const data = await req.json();

  const { userId } = getAuth(req);
  const challengeId = data.id;

  const challenge = await ChallengeModel.findOne({
    id: challengeId,
    userId: userId,
  });

  if (!challenge) {
    const newchallenge = new ChallengeModel({
      userId: userId,
      progress: 1,
      streak: 1,
      ...data,
    });

    if (newchallenge.progress >= newchallenge.goal) {
      newchallenge.badge = predefinedChallenges.find(
        (ch) => ch.id === challengeId
      )?.badgeReward;
    }

    await newchallenge.save();
    return NextResponse.json({
      message: "Challenge set successfully",
      newchallenge,
    });
  }

  challenge.progress += 1;
  challenge.streak += 1;

  if (challenge.progress >= challenge.goal) {
    challenge.badge = predefinedChallenges.find(
      (ch) => ch.id === challengeId
    )?.badgeReward;
  }

  await challenge.save();
  return NextResponse.json(challenge);
}
