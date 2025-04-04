import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import UserModel from "@/app/models/User";
import RedemptionModel from "@/app/models/Redemption";
import { predefinedRewards } from "@/lib/predefinedRewards";
import RecentActivityModel from "@/app/models/RecentActivity";

export async function POST(req: NextRequest) {
  try {
    // Ensure the database is connected
    await connectToDatabase();

    // Get user session
    const { userId } = getAuth(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rewardId } = await req.json();
    if (!rewardId) {
      return NextResponse.json(
        { error: "Reward ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the reward
    const reward = predefinedRewards.find((reward) => reward.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    // Check if the user has enough points
    if (user.currentPoints < reward.pointsCost) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 }
      );
    }

    // Deduct points
    user.currentPoints -= reward.pointsCost;
    user.totalSpent += reward.pointsCost;
    user.thisMonthSpent += reward.pointsCost;
    await user.save();

    // Store the redemption record
    const redemption = new RedemptionModel({
      userId: user.id,
      title: reward.title,
      description: reward.description,
      rewardId: reward.id,
      redeemedAt: new Date(),
      pointsSpent: reward.pointsCost,
      image: reward.image,
    });
    await redemption.save();

    const recentActivity = await RecentActivityModel.create({
      userId,
      type: "spent",
      category: reward.category,
      title: reward.title,
      description: reward.completationText,
      points: -reward.pointsCost,
      icon: reward.icon,
    });

    await recentActivity.save();

    user.rewardsRedeemed++;
    await user.save();

    return NextResponse.json(
      {
        message: "Reward redeemed successfully",
        newBalance: user.currentPoints,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Redemption Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
