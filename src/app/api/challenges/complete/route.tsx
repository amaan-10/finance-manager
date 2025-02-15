import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import { predefinedChallenges } from "@/lib/predefinedChallenges";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const data = await req.json();

  const { userId } = getAuth(req);
  const challengeId = data.id;

  const challenge = await ChallengeModel.findOne({
    id: challengeId,
    userId: userId,
  });

  const today = new Date();

  if (!challenge) {
    const newchallenge = new ChallengeModel({
      userId: userId,
      progress: 1,
      streak: 1,
      lastCompleted: today,
      ...data,
    });

    if (newchallenge.progress >= newchallenge.goal) {
      newchallenge.isCompleted = true;
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

  const lastCompleted = challenge.lastCompleted
    ? new Date(challenge.lastCompleted)
    : today;

  if (lastCompleted && today.getTime() - lastCompleted.getTime() <= 86400000) {
    challenge.streak += 1;
  } else {
    challenge.streak = 1;
  }

  challenge.progress += 1;
  challenge.lastCompleted = today;

  if (challenge.progress >= challenge.goal) {
    challenge.isCompleted = true;
    challenge.badge = predefinedChallenges.find(
      (ch) => ch.id === challengeId
    )?.badgeReward;
  }

  await challenge.save();
  return NextResponse.json(challenge);
}
