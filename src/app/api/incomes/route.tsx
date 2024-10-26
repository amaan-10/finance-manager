// app/api/incomes/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import IncomeModel from "../../models/Income";

export async function GET() {
  const client = await clientPromise;
  const incomes = await client.db().collection("incomes").find({}).toArray();
  return NextResponse.json(incomes);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const body = await req.json();

  const income = new IncomeModel(body);
  await income.save();

  return NextResponse.json(income);
}
