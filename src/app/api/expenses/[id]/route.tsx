// app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import ExpenseModel from "../../../models/Expense";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: any) {
  // Using any for simplicity
  const { id } = context.params; // Type assertion can be avoided

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const body = await req.json();

    const updatedExpense = await ExpenseModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
