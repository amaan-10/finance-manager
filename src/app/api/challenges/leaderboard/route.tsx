import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import LeaderboardModel from "@/app/models/Leaderboard";
import UserModel from "@/app/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const leaderboard = await LeaderboardModel.find().sort({ rank: 1 });
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectToDatabase();

    const users = await UserModel.find().sort({
      currentPoints: -1,
      currentSavings: -1,
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

    const previousLeaderboardEntries = await LeaderboardModel.find();
    const previousPointsMap = new Map(
      previousLeaderboardEntries.map((entry) => [
        entry.userId.toString(),
        entry.points,
      ])
    );

    const leaderboardUpdates = [];
    const userUpdates = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const lastPoints = previousPointsMap.get(user.id) ?? user.currentPoints;

      let percentChange = 0;
      let trend = "steady";

      // Only update percentChange if points have changed
      if (user.currentPoints !== lastPoints) {
        percentChange =
          lastPoints !== 0
            ? ((user.currentPoints - lastPoints) / lastPoints) * 100
            : 0;

        if (percentChange > 0) trend = "up";
        else if (percentChange < 0) trend = "down";
      } else {
        // Maintain previous trend if points didn't change
        const prevEntry = previousLeaderboardEntries.find(
          (entry) => entry.userId.toString() === user.id
        );
        if (prevEntry) {
          trend = prevEntry.trend;
          percentChange = prevEntry.percentChange;
        }
      }

      leaderboardUpdates.push({
        updateOne: {
          filter: { userId: user.id },
          update: {
            $set: {
              name: user.name,
              savings: user.savings,
              points: user.currentPoints,
              trend,
              percentChange: parseFloat(percentChange.toFixed(2)),
              rank: i + 1,
              lastUpdated: new Date(),
            },
          },
          upsert: true,
        },
      });

      userUpdates.push({
        updateOne: {
          filter: { id: user.id },
          update: {
            $set: {
              rank: i + 1,
            },
          },
          upsert: true,
        },
      });
    }

    if (leaderboardUpdates.length > 0) {
      await LeaderboardModel.bulkWrite(leaderboardUpdates);
      await UserModel.bulkWrite(userUpdates);
    }

    return NextResponse.json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to update leaderboard" },
      { status: 500 }
    );
  }
}
