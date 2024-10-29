// import BudgetModel from "@/app/models/Budget";
// import clientPromise from "@/lib/mongodb";
// import { connectToDatabase } from "@/lib/mongoose";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(
//   req: NextRequest
// ) {
//   try {
//     await connectToDatabase(); // Ensure MongoDB is connected

//     const { searchParams } = new URL(req.url);
//     const month = searchParams.get("month");
//     const year = searchParams.get("year");
//     await clientPromise;
//     const client = await clientPromise;
//     const db = client.db();

//     const { userId } = getAuth(req); // Get the authenticated user ID
//     //const { amount, month, year } = await req.json();
//     // console.log(
//     //   "request------------------------------------------------------------",
//     //   month,
//     //   year
//     // );

//     // Find and delete the budget by ID
//     const deletedBudget = await BudgetModel.findOneAndDelete({
//       userId,
//       month,
//       year,
//     });

//     if (!deletedBudget) {
//       return NextResponse.json(
//         { message: "Budget not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Budget deleted successfully",
//       deletedBudget,
//     });
//   } catch (error) {
//     console.error("Error deleting budget:", error);
//     return NextResponse.json(
//       { error: "Failed to delete budget" },
//       { status: 500 }
//     );
//   }
// }
