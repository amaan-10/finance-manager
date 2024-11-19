// app/api/expenses/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongoose";
import ExpenseModel from "../../../models/Expense";
import { getAuth } from "@clerk/nextjs/server";
import moment from "moment";

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

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    // Aggregation query to get monthly expenses
    const categoryExpenses = await ExpenseModel.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          totalAmount: { $sum: "$amount" }, // Sum the amounts
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          category: "$_id", // Rename _id to category
          totalAmount: 1, // Include totalAmount in the result
        },
      },
    ]);

    return NextResponse.json(categoryExpenses);
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
