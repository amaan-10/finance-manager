import BudgetModel from "@/app/models/Budget";
import clientPromise from "@/lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { month: string; year: string };
}

export async function DELETE(req: NextRequest, context: Params) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { month, year } = await context.params;
    await clientPromise;
    const client = await clientPromise;

    const { userId } = getAuth(req); // Get the authenticated user ID
    //const { amount, month, year } = await req.json();
    // console.log(
    //   "request------------------------------------------------------------",
    //   month,
    //   year
    // );

    // Find and delete the budget by ID
    const deletedBudget = await BudgetModel.findOneAndDelete({
      userId,
      month,
      year,
    });

    if (!deletedBudget) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Budget deleted successfully",
      deletedBudget,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
