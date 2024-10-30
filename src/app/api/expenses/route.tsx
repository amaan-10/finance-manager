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

    return NextResponse.json({
      message: "Expense added successfully",
      expense,
    });
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

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const body = await req.json(); // Get the request body
    const { category, amount, date } = body; // Destructure month and year

    if (!category || !amount || !date) {
      return NextResponse.json(
        { message: "Month and year are required." },
        { status: 400 }
      );
    }
    await clientPromise;
    const client = await clientPromise;
    const db = client.db();

    const { userId } = getAuth(req); // Get the authenticated user ID
    //const { amount, month, year } = await req.json();
    // console.log(
    //   "request------------------------------------------------------------",
    //   month,
    //   year
    // );

    // Find and delete the budget by ID
    const deletedExpense = await ExpenseModel.findOneAndDelete({
      userId,
      category,
      amount,
      date,
    });

    if (!deletedExpense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Expense deleted successfully",
      deletedExpense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
