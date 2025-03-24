import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import { predefinedChallenges } from "@/lib/predefinedChallenges";
import moment from "moment-timezone";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id: challengeId, ...data } = await req.json();
    const { userId } = getAuth(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get current time in IST
    const todayIST = moment().tz("Asia/Kolkata");
    const todayDateIST = todayIST.format("YYYY-MM-DD");

    const challenge = await ChallengeModel.findOne({ id: challengeId, userId });

    // If challenge doesn't exist, create a new one
    if (!challenge) {
      const newChallenge = await ChallengeModel.create({
        userId,
        id: challengeId,
        progress: 1,
        streak: 1,
        lastCompleted: todayIST.toDate(),
        ...data,
        isCompleted: data.goal <= 1, // Auto-complete if goal is 1
        badge:
          data.goal <= 1
            ? predefinedChallenges.find((ch) => ch.id === challengeId)
                ?.badgeReward
            : null,
      });

      return NextResponse.json({
        message: "Challenge started successfully",
        challenge: newChallenge,
      });
    }

    // Extract last completed date for streak calculations in IST
    const lastCompletedIST = moment(challenge.lastCompleted)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD");

    // Calculate yesterday's date in IST
    const yesterdayIST = moment().tz("Asia/Kolkata").subtract(1, "days");
    const yesterdayDateIST = yesterdayIST.format("YYYY-MM-DD");

    // Streak Handling: If last completed was yesterday, increase streak, otherwise reset
    if (lastCompletedIST === yesterdayDateIST) {
      challenge.streak += 1;
    } else {
      challenge.streak = 0; // Reset streak if missed a day
      challenge.progress = 0; // Reset progress as well
    }

    // Progress Update
    challenge.progress += 1;
    challenge.lastCompleted = todayIST.toDate();

    // Check if the challenge is completed
    if (challenge.progress >= challenge.goal) {
      challenge.isCompleted = true;
      challenge.badge =
        predefinedChallenges.find((ch) => ch.id === challengeId)?.badgeReward ||
        null;
    }

    await challenge.save();

    return NextResponse.json({
      message: "Challenge updated successfully",
      challenge,
    });
  } catch (error) {
    console.error("Error in challenge API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
