import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import UserModel from "@/app/models/User";
import AchievementsModel from "@/app/models/Achievements";
import RecentActivityModel from "@/app/models/RecentActivity";
import moment from "moment";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { challengeId, action, amount, progress } = await req.json();
  const { userId } = getAuth(req);

  // Fetch the user's challenge
  const userChallenge = await ChallengeModel.findOne({ userId, id: challengeId });
  const user = await UserModel.findOne({ id: userId });
  let recentActivity
  

  if (!userChallenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  switch (challengeId) {
    case "1": // Save ₹500 this month
      if (action === "deposit") {
        userChallenge.progress += amount;
        if (userChallenge.progress >= 500) { 
          userChallenge.isCompleted = true; 
          user.points += userChallenge.points;
          user.challengesCompleted++;
          user.challengesInProgress--;
          recentActivity = await RecentActivityModel.create({
            userId,
            type: userChallenge.category,
            title: userChallenge.title,
            points: userChallenge.points,
            icon: userChallenge.icon,
          })
        }
      }
      break;

    case "2": // Complete financial profile
      if (action === "profile_update") {
        userChallenge.progress = Math.min(progress, 100);
        if (userChallenge.progress === 100) {
          userChallenge.isCompleted = true;
          user.points += userChallenge.points;
          user.challengesCompleted++;
          user.challengesInProgress--;
        }
      }
      break;

    case "3": // Invest in 3 different assets
      if (action === "new_investment") {
        userChallenge.progress += 1;
        if (userChallenge.progress >= 3) {
          userChallenge.isCompleted = true; 
          user.points += userChallenge.points;
          user.challengesCompleted++;
          user.challengesInProgress--;
        }
      }
      break;

    case "4": // No unnecessary purchases for a week
      if (action === "no_spending_today") {
        userChallenge.progress += 1;
        if (userChallenge.progress >= 7) {
          userChallenge.isCompleted = true;
          user.points += userChallenge.points;
          user.challengesCompleted++;
          user.challengesInProgress--;
        }
      } else if (action === "reset") {
        userChallenge.progress = 0; // Reset if unnecessary spending occurs
      }
      break;

    case "5": // Set up automatic savings
      if (action === "auto_savings_enabled") {
        userChallenge.progress = 100;
        userChallenge.isCompleted = true;
        user.points += userChallenge.points;
        user.challengesCompleted++;
        user.challengesInProgress--;
      }
      break;

    case "6": // Refer a friend
      if (action === "friend_signed_up") {
        userChallenge.progress = 1;
        userChallenge.isCompleted = true;
        user.points += userChallenge.points;
        user.challengesCompleted++;
        user.challengesInProgress--;
      }
      break;

    default:
      return NextResponse.json({ error: "Invalid challengeId" }, { status: 400 });
  }


  await userChallenge.save();
  await user.save();
  await recentActivity.save();

  return NextResponse.json({ message: "Challenge progress updated", userChallenge });
}
