// app/api/expenses/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongoose";
import ExpenseModel from "../../../models/Expense";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId } = getAuth(req); // Get the authenticated user ID

    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 400 }
      );
    }

    // Aggregation query to get monthly expenses
    const monthlyExpenses = await ExpenseModel.aggregate([
      {
        $match: {
          userId, // Filter by user ID
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" }, // Extract month from date
            year: { $year: "$date" }, // Extract year from date
          },
          totalAmount: { $sum: "$amount" }, // Sum of amounts per month
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ]);

    return NextResponse.json(monthlyExpenses);
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
