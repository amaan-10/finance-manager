// /app/api/investments/route.ts
import { NextRequest, NextResponse } from "next/server";
import InvestmentModel from "../../models/Investment";
import clientPromise from "../../../lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { userId } = getAuth(req); // Get the authenticated user ID
    const body = await req.json(); // Read request body
    const newInvestment = new InvestmentModel({ ...body, userId });
    console.log({ ...body, userId });
    console.log(newInvestment);

    const savedInvestment = await newInvestment.save();
    return NextResponse.json(savedInvestment, { status: 201 });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { userId } = getAuth(req); // Get the authenticated user ID

    const investments = await InvestmentModel.find({ userId });
    return NextResponse.json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const body = await req.json(); // Get the request body

    const id = body; // Destructure month and year
    console.log(id);

    if (!id) {
      return NextResponse.json({ message: "Id is required." }, { status: 400 });
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

    // Find and delete the Investment by ID
    const deletedInvestment = await InvestmentModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedInvestment) {
      return NextResponse.json(
        { message: "Investment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Investment deleted successfully",
      deletedInvestment,
    });
  } catch (error) {
    console.error("Error deleting Investment:", error);
    return NextResponse.json(
      { error: "Failed to delete Investment" },
      { status: 500 }
    );
  }
}
