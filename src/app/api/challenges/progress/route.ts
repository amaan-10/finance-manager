import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { challengeId, action, amount, progress } = await req.json();
  const { userId } = getAuth(req);

  // Fetch the user's challenge
  const userChallenge = await ChallengeModel.findOne({ userId, id: challengeId });

  if (!userChallenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  switch (challengeId) {
    case "1": // Save ₹500 this month
      if (action === "deposit") {
        userChallenge.progress += amount;
        if (userChallenge.progress >= 500) userChallenge.isCompleted = true;
      }
      break;

    case "2": // Complete financial profile
      if (action === "profile_update") {
        userChallenge.progress = Math.min(progress, 100);
        if (userChallenge.progress === 100) userChallenge.isCompleted = true;
      }
      break;

    case "3": // Invest in 3 different assets
      if (action === "new_investment") {
        userChallenge.progress += 1;
        if (userChallenge.progress >= 3) userChallenge.isCompleted = true;
      }
      break;

    case "4": // No unnecessary purchases for a week
      if (action === "no_spending_today") {
        userChallenge.progress += 1;
        if (userChallenge.progress >= 7) userChallenge.isCompleted = true;
      } else if (action === "reset") {
        userChallenge.progress = 0; // Reset if unnecessary spending occurs
      }
      break;

    case "5": // Set up automatic savings
      if (action === "auto_savings_enabled") {
        userChallenge.progress = 100;
        userChallenge.isCompleted = true;
      }
      break;

    case "6": // Refer a friend
      if (action === "friend_signed_up") {
        userChallenge.progress = 1;
        userChallenge.isCompleted = true;
      }
      break;

    default:
      return NextResponse.json({ error: "Invalid challengeId" }, { status: 400 });
  }

  await userChallenge.save();
  return NextResponse.json({ message: "Challenge progress updated", userChallenge });
}
