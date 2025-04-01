import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import { format, subWeeks, startOfWeek } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const {userId}  = getAuth(req); // Get the authenticated user ID

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Aggregate points grouped by month and week
    const challenges = await ChallengeModel.aggregate([
      {
        $match: { isCompleted: true, userId },  // Filter only completed challenges
      },
      {
        $project: {
          points: 1,
          lastCompleted: 1,
          year: { $year: "$lastCompleted" },
          month: { $month: "$lastCompleted" },
          week: { $isoWeek: "$lastCompleted" }  // Fix incorrect week calculation
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            week: "$week",
          },
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlyPoints: Record<string, number> = {};
    const weeklyPoints: Record<string, number> = {};
    
    challenges.forEach(({ _id, totalPoints }) => {
      const monthKey = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      const weekKey = `${_id.year}-W${_id.week}`;
    
      // Monthly Aggregation
      if (!monthlyPoints[monthKey]) {
        monthlyPoints[monthKey] = 0;
      }
      monthlyPoints[monthKey] += totalPoints;
    
      // Weekly Aggregation
      if (!weeklyPoints[weekKey]) {
        weeklyPoints[weekKey] = 0;
      }
      weeklyPoints[weekKey] += totalPoints;
    });
    
    // Convert monthlyPoints into the required format
    const formattedMonthlyData = Array.from({ length: 12 }, (_, i) => {
      const key = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      return { month: monthNames[i], points: monthlyPoints[key] || 0 };
    });
    
    // Get last 12 weeks, ensuring missing weeks are set to 0
    const formattedWeeklyData: { week: string; points: number }[] = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStartDate = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 }); // Start from Monday
      const weekNumber = format(weekStartDate, "w"); // Get ISO week number
      const year = format(weekStartDate, "yyyy"); // Get the year
      const weekKey = `${year}-W${weekNumber}`;
    
      formattedWeeklyData.push({
        week: `W${weekNumber}`,
        points: weeklyPoints[weekKey] || 0, // Default to 0 if missing
      });
    }
    
    // Return formatted response
    return NextResponse.json({ monthlyPoints: formattedMonthlyData, weeklyPoints: formattedWeeklyData }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching challenge points:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
