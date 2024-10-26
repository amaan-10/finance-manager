// app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import ExpenseModel from "../../../models/Expense";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const body = await req.json();

  const updatedExpense = await ExpenseModel.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updatedExpense);
}
