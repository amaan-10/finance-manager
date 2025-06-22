// app/api/connect/depay/route.ts
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/models/User";

// const ALLOWED_ORIGIN = "http://localhost:3000";
const ALLOWED_ORIGIN =  "https://depayment.vercel.app";

// Handle CORS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// Handle actual POST request
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, accountNumber } = await req.json();

    if (!email || !accountNumber) {
      return NextResponse.json({ message: "Email and account number are required" }, {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, {
          status: 404,})
    }

    user.accountNumber = accountNumber;
    user.linkDepay = true;
    await user.save();

    return NextResponse.json(
      { message: "User synced successfully", user, status: "success" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error syncing user", error }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  }
}
