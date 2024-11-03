// app/api/budgets/monthly/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "../../../models/Expense";
import clientPromise from "../../../../lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import InvestmentModel from "@/app/models/Investment";

export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req); // Get the authenticated user ID
  const client = await clientPromise;

  try {
    // Find the user's budget for the current month and year
    const investment = await InvestmentModel.findOne({
      userId,
    });

    if (!investment) {
      return NextResponse.json(
        { message: "No investments found." },
        { status: 404 }
      );
    }

    // Calculate total expenses for the current month
    const totalInvestment = await InvestmentModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalInvestmentByType = await InvestmentModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
    ]);

    return NextResponse.json({
      totalAmount: totalInvestment[0].totalAmount,
      byType: totalInvestmentByType,
    });
  } catch (error) {
    console.error("Error fetching total investments:", error);
    return NextResponse.json(
      { error: "Error fetching total investments" },
      { status: 500 }
    );
  }
}
