// app/api/budgets/monthly/route.ts
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

  // try {
  //   // Find the user's budget for the current month and year
  //   const budget = await Budget.findOne({
  //     userId,
  //     month,
  //     year,
  //   });

  //   if (!budget) {
  //     return NextResponse.json(
  //       { message: "No budget set for this month." },
  //       { status: 404 }
  //     );
  //   }

  //   // Calculate total expenses for the current month
  //   const totalExpenses = await Expense.aggregate([
  //     {
  //       $match: {
  //         userId,
  //         date: {
  //           $gte: new Date(year, month - 1, 1),
  //           $lt: new Date(year, month, 1),
  //         },
  //       },
  //     },
  //     { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  //   ]);

  //   const spent = totalExpenses[0]?.totalAmount || 0;
  //   const remaining = budget.amount - spent;

  //   return NextResponse.json([
  //     {
  //       budget: budget.amount,
  //       spent,
  //       remaining,
  //     },
  //   ]);
  // } catch (error) {
  //   console.error("Error fetching budget:", error);
  //   return NextResponse.json(
  //     { error: "Error fetching budget" },
  //     { status: 500 }
  //   );
  // }

  try {
    const data = await Budget.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        // Lookup expenses for the same month and year
        $lookup: {
          from: "expenses",
          let: {
            budgetMonth: "$month",
            budgetYear: "$year",
            budgetUserId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $month: "$date" }, "$$budgetMonth"] },
                    { $eq: [{ $year: "$date" }, "$$budgetYear"] },
                    { $eq: ["$userId", "$$budgetUserId"] },
                  ],
                },
              },
            },
            { $group: { _id: null, totalSpend: { $sum: "$amount" } } },
          ],
          as: "expenses",
        },
      },
      {
        // Unwind the results to handle months with or without expenses
        $unwind: { path: "$expenses", preserveNullAndEmptyArrays: true },
      },
      {
        // Calculate spend, remaining, and budget
        $addFields: {
          spend: { $ifNull: ["$expenses.totalSpend", 0] },
          remaining: {
            $subtract: ["$amount", { $ifNull: ["$expenses.totalSpend", 0] }],
          },
          budget: "$amount",
        },
      },
      {
        // Format the output fields
        $project: {
          _id: 0,
          month: 1,
          year: 1,
          spend: 1,
          remaining: 1,
          budget: 1,
        },
      },
      {
        // Add a field to compare if the month and year is the current one
        $addFields: {
          isCurrentMonth: {
            $cond: [
              {
                $and: [
                  { $eq: ["$month", new Date().getMonth() + 1] }, // Months are 0-indexed in JavaScript
                  { $eq: ["$year", new Date().getFullYear()] },
                ],
              },
              1, // Current month
              0, // Not current month
            ],
          },
        },
      },
      {
        // Sort first by isCurrentMonth, then by year and month
        $sort: { isCurrentMonth: -1, year: -1, month: -1 },
      },
    ]);

    //console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Error fetching budget" },
      { status: 500 }
    );
  }
}
