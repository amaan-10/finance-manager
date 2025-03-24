import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";

export async function POST(req: Request) {
  try {
    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Challenge ID and User ID are required" },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Ensure MongoDB is connected

    // Find the challenge
    const challenge = await ChallengeModel.findOne({ id: id, userId });
    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found or unauthorized" },
        { status: 404 }
      );
    }

    // Toggle isClaimed
    challenge.isClaimed = !challenge.isClaimed;
    await challenge.save(); // Save the updated challenge

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
