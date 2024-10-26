// app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb"; // Adjust path if necessary
import ExpenseModel from "../../../models/Expense"; // Ensure this path is correct

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;

    // Parse the request body
    const body = await req.json();

    // Update the expense in the database
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update respects your model's validation rules
      }
    );

    // Check if the expense was found and updated
    if (!updatedExpense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    // Return the updated expense
    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
