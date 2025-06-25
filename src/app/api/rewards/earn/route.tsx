import UserModel from "@/app/models/User";
import RewardModel from "@/app/models/Reward";
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

type RewardAction = "log_expense" | "budget_completed" | "savings_goal";

const REWARD_RULES: Record<RewardAction, { points: number; reason: string }> = {
  log_expense: { points: 10, reason: "Logged daily expenses" },
  budget_completed: { points: 100, reason: "Stayed under budget this month" },
  savings_goal: { points: 200, reason: "Achieved savings goal" },
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected
    const { userId, action } = await req.json();

    // console.log(userId, action);
    if (!userId || !action)
      return NextResponse.json(
        { message: "Missing userId or action" },
        { status: 400 }
      );
    if (!(action in REWARD_RULES))
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });

    // console.log(userId);

    const user = await UserModel.findOne({ id: userId });
    // console.log(user);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { points, reason } = REWARD_RULES[action as RewardAction];
    user.currentPoints += points;
    // console.log(user);

    await user.save();
    const reward = new RewardModel({ userId, pointsEarned: points, reason });

    // console.log(reward);

    await reward.save();

    return NextResponse.json(
      {
        message: "Points added successfully",
        totalPoints: user.currentPoints,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error awarding points", error },
      { status: 500 }
    );
  }
}
