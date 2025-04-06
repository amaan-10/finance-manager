// app/api/budgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";
import SplitUpModel from "@/app/models/SplitUp";

export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected
  const { userId } = getAuth(req); // Get the authenticated user ID
  const client = await clientPromise;
  const splitup = await client
    .db()
    .collection("splitups")
    .find({ userId })
    .toArray();
  return NextResponse.json(splitup);
}

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected

  const { userId } = getAuth(req); // Get the authenticated user ID
  //console.log(userId);
  const client = await clientPromise;
  const data = await req.json();
  const transactionName = await data.transactionName;
  const members = await data.members;
  const category = await data.category;

  const splitup = new SplitUpModel({
    userId,
    transactionName,
    members,
    category,
  });

  // console.log(splitup);

  await splitup.save();

  return NextResponse.json({
    message: "Transactions save successfully",
    splitup,
  });
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const body = await req.json(); // Get the request body

    const _id = body.id;

    if (!_id) {
      return NextResponse.json(
        { message: "Data id required." },
        { status: 400 }
      );
    }
    await clientPromise;
    const client = await clientPromise;
    const db = client.db();

    const { userId } = getAuth(req); // Get the authenticated user ID

    const deleteTransaction = await SplitUpModel.findOneAndDelete({
      userId,
      _id,
    });

    if (!deleteTransaction) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Data deleted successfully",
      deleteTransaction,
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
