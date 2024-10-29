// app/api/budgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import BudgetModel from "../../models/Budget";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req); // Get the authenticated user ID
  const client = await clientPromise;
  const budgets = await client
    .db()
    .collection("budgets")
    .find({ userId })
    .toArray();
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected

  const { userId } = getAuth(req); // Get the authenticated user ID
  //console.log(userId);
  const client = await clientPromise;
  const { amount, month, year } = await req.json();

  // Check if budget already exists for the user and month
  const existingBudget = await BudgetModel.findOne({ userId, month, year });

  if (existingBudget) {
    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { userId, month, year },
      { amount },
      { new: true } // Return the updated document
    );

    if (!updatedBudget) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Budget updated successfully",
      updatedBudget,
    });
  }

  //console.log(body);
  const budget = new BudgetModel({ amount, month, year, userId });
  await budget.save();

  return NextResponse.json({ message: "Budget set successfully", budget });
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { userId } = getAuth(req); // Get the authenticated user ID
    //console.log(userId);
    const client = await clientPromise;
    const { amount, month, year } = await req.json();

    // Find the budget by ID and update it
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      userId,
      { amount, month, year, $inc: { __v: 1 } },

      { new: true } // Return the updated document
    );

    if (!updatedBudget) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Budget updated successfully",
      updatedBudget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}
