// app/api/auth/sync/route.tsx
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure MongoDB is connected

    const { id, email, name } = await req.json();

    let user = await UserModel.findOne({ id });
    // console.log(user);

    if (!user) {
      user = new UserModel({ id, email, name });
      // console.log(user);
      await user.save();
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Error syncing user", error });
  }
}
