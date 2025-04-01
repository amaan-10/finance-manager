import ChallengeModel from "@/app/models/Challenge";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    const result = await ChallengeModel.updateMany(
      { daysLeft: { $gt: 0 }, isCompleted: false },
      { $inc: { daysLeft: -1 } }
    );

    console.log(`Updated ${result.modifiedCount} challenges`);
    return NextResponse.json({ message: "Challenges updated" });
  } catch (error) {
    console.error("Error updating challenges:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
