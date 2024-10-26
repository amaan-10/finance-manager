// app/api/expenses/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import ExpenseModel from "../../models/Expense";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../../../lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { userId } = getAuth(req); // Get the authenticated user ID
    console.log(userId);
    const client = await clientPromise;
    const body = await req.json();

    const expense = new ExpenseModel({ ...body, userId }); // Include userId in the expense
    console.log(expense);
    await expense.save();

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error saving expense:", error);
    return NextResponse.json(
      { error: "Failed to save expense" },
      { status: 500 }
    );
  }
}

// app/api/expenses/route.ts
export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req); // Get the authenticated user ID
  const client = await clientPromise;
  const expenses = await client
    .db()
    .collection("expenses")
    .find({ userId })
    .toArray(); // Filter by userId
  return NextResponse.json(expenses);
}
