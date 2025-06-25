import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import RedemptionModel from "@/app/models/Redemption";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const rewards = await RedemptionModel.find({ userId }).sort({ date: -1 });

    return NextResponse.json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
