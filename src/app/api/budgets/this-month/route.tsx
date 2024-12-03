// app/api/budgets/this-month/route.ts
import { NextRequest, NextResponse } from "next/server";
import Budget from "../../../models/Budget";
import Expense from "../../../models/Expense";
import clientPromise from "../../../../lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req); // Get the authenticated user ID
  const client = await clientPromise;
  const today = new Date();
  const month = today.getMonth() + 1; // Current month (1-12)
  const year = today.getFullYear();
  try {
    // Find the user's budget for the current month and year
    const budget = await Budget.findOne({
      userId,
      month,
      year,
    });
    if (!budget) {
      return NextResponse.json([]);
    }
    // Calculate total expenses for the current month
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const spent = totalExpenses[0]?.totalAmount || 0;
    const remaining = budget.amount - spent;
    return NextResponse.json([
      {
        budget: budget.amount,
        spent,
        remaining,
      },
    ]);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Error fetching budget" },
      { status: 500 }
    );
  }
}
