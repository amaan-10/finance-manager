// app/api/budgets/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import BudgetModel from "../../models/Budget";

export async function GET() {
  const client = await clientPromise;
  const budgets = await client.db().collection("budgets").find({}).toArray();
  return NextResponse.json(budgets);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const body = await req.json();

  const budget = new BudgetModel(body);
  await budget.save();

  return NextResponse.json(budget);
}
