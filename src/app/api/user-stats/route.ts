import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/models/User";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import AchievementsModel from "@/app/models/Achievements";
import RecentActivityModel from "@/app/models/RecentActivity";

// API handler
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected
    const { userId } = getAuth(req); // Get the authenticated user ID

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch data from different databases
    const user = await UserModel.findOne({ id: userId });
    const achievements = await AchievementsModel.find({ userId });
    const recentActivity = await RecentActivityModel.find({ userId })
      .sort({ date: -1 }) // Sort by most recent
      .limit(10);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format response
    const userStats = {
      name: user.name,
      currentPoints: user.currentPoints,
      totalEarned: user.totalEarned,
      totalSpent: user.totalSpent,
      lastMonthEarned: user.lastMonthEarned,
      lastMonthSpent: user.lastMonthSpent,
      thisMonthEarned: user.thisMonthEarned,
      thisMonthSpent: user.thisMonthSpent,
      lastUpdatedMonth: user.lastUpdatedMonth,
      rank: user.rank,
      savingsGoal: user.savingsGoal,
      currentSavings: user.currentSavings,
      challengesCompleted: user.challengesCompleted,
      challengesInProgress: user.challengesInProgress,
      rewardsRedeemed: user.rewardsRedeemed,
      streakDays: user.streakDays,
      nextRewardPoints: user.nextRewardPoints,
      achievements: achievements.map((ach) => ({
        id: ach._id,
        title: ach.title,
        description: ach.description,
        date: ach.date,
        icon: ach.icon,
      })),
      recentActivity: recentActivity.map((act) => ({
        id: act._id,
        type: act.type,
        title: act.title,
        description: act.description,
        category: act.category,
        icon: act.icon,
        points: act.points,
        date: act.date,
      })),
    };

    return NextResponse.json(userStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
