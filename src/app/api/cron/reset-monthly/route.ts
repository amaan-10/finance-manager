import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/app/models/User";

export async function GET() {
    try {
      await connectToDatabase();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      // Fetch all users whose last update was in a different month
      const users = await UserModel.find({ lastUpdatedMonth: { $ne: currentMonth } });
  
      for (const user of users) {
        const lastUpdatedDate = new Date(user.updatedAt);
        const lastUpdatedMonth = lastUpdatedDate.getMonth();
        const lastUpdatedYear = lastUpdatedDate.getFullYear();
  
        const monthsSkipped = (currentYear - lastUpdatedYear) * 12 + (currentMonth - lastUpdatedMonth);
  
        if (monthsSkipped >= 1) {
          user.lastMonthEarned = monthsSkipped === 1 ? user.thisMonthEarned : 0;
          user.lastMonthSpent = monthsSkipped === 1 ? user.thisMonthSpent : 0;
  
          user.thisMonthEarned = 0;
          user.thisMonthSpent = 0;
          user.lastUpdatedMonth = currentMonth;
        }
  
        await user.save();
      }
  
      return NextResponse.json({ message: "Monthly reset completed" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  }
  
