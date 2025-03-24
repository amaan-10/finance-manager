import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Reset streak & progress where lastCompleted is NOT yesterday
    await ChallengeModel.updateMany(
      { lastCompleted: { $lt: new Date(yesterdayDate) } },
      { $set: { streak: 0, progress: 0 } }
    );

    return NextResponse.json({ message: "Streaks reset successfully" });
  } catch (error) {
    console.error("Error resetting streaks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
