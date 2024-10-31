import { NextRequest, NextResponse } from "next/server";
import InvestmentModel from "../../models/Investment";
import axios from "axios";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuth } from "@clerk/nextjs/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(req: NextRequest) {
  await connectToDatabase(); // Ensure MongoDB is connected

  const { userId } = getAuth(req); // Get the authenticated user ID
  // Fetch investments where type is 'stock'
  const stockInvestments = await InvestmentModel.find({
    userId,
    type: "stock",
  });

  // Fetch stock details from Finnhub for each stock investment
  const stockData = await Promise.all(
    stockInvestments.map(async (investment) => {
      const quoteResponse = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: investment.name, // The stock symbol from the investment document
          token: FINNHUB_API_KEY,
        },
      });

      return {
        name: investment.name,
        quantity: investment.quantity,
        id: investment._id,
        amount: investment.amount,
        inv_date: investment.date,
        status: investment.status,
        ...quoteResponse.data, // Include data returned by Finnhub API
      };
    })
  );

  return NextResponse.json(stockData);
}
