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
  console.log(userId);
  const client = await clientPromise;
  const body = await req.json();

  const budget = new BudgetModel({ ...body, userId });
  await budget.save();

  return NextResponse.json(budget);
}
