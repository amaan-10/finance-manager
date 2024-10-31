// app/investments/page.tsx
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Investment {
  _id: string;
  type: string;
  amount: number;
  date: string;
  currentValue?: number;
  name?: string;
}

interface StockData {
  name?: string;
  amount: number;
  inv_date: string;
  status: string;
  c: number; // Current price
  d: number;
  dp: number;
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Opening price
  pc: number; // Previous close
  t: number;
}

const InvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  //const [stockData, setStockData] = useState<StockData | null>(null);
  const [stockData, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const fetchInvestments = async () => {
    try {
      const response = await fetch("/api/investments"); // Example userId
      const data = await response.json();
      setInvestments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  async function deleteInvestment(id: string) {
    try {
      const response = await fetch(`/api/investments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id),
      });
      console.log(id);
      const data = await response.json();
      if (response.ok) {
        setInvestments((prev) => prev.filter((inv) => inv._id !== id));
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error: any) {
      alert(error.message);
      console.error("Error deleting investment:", error);
    }
  }

  useEffect(() => {
    // fetch("/api/stocks")
    //   .then((res) => res.json())
    //   .then((data) => setStocks(data))
    //   .catch((error) => console.error("Error fetching stock data:", error));
    const fetchStockData = async () => {
      try {
        const response = await fetch("/api/stocks");
        if (!response.ok) throw new Error("Error fetching stock data");

        const data = await response.json();
        console.log(data);

        setStocks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newInvestment = { type, amount, date, name };
    console.log(newInvestment);

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvestment),
      });

      if (response.ok) {
        alert("Investment added successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  return (
    <section className=" mt-5">
      <h2>Investments Overview</h2>
      <h2 className=" bg-yellow-300">Coming Soon...</h2>
      <ul>
        {investments.map((inv) => (
          <span className="grid md:grid-cols-2 lg:grid-cols-3" key={inv._id}>
            {inv.type !== "stock" ? (
              <>
                <span className=" ">
                  {inv.type}: <span className=" font-serif">₹</span>
                  {inv.amount} on{" "}
                  {new Date(inv.date).toLocaleDateString("en-GB")}
                </span>
                <button
                  className=" text-left hover:underline text-red-600"
                  onClick={() => deleteInvestment(inv._id)}
                >
                  Delete Investment
                </button>
              </>
            ) : (
              ""
            )}
          </span>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="mt-2 flex gap-3">
          <input
            type="text"
            placeholder="Investment Type"
            value={type}
            className=" pl-1"
            onChange={(e) => setType(e.target.value)}
            required
          />
          {type.toLocaleLowerCase() === "stock" ? (
            <input
              type="text"
              placeholder="Stock Name"
              value={name}
              className=" pl-1"
              onChange={(e) => setName(e.target.value)}
              required
            />
          ) : (
            ""
          )}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            className=" pl-1"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            className=" pl-1"
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">Add Investment</button>
        </div>
      </form>
      <div>
        {stockData.length != 0 ? (
          <>
            <h2 className="pt-5 font-extrabold text-xl">
              Stock Portfolio(Only US stock exchange)
            </h2>
            <ul>
              {stockData.map((stock, index) => (
                <li className="pt-3" key={index}>
                  <h2 className=" font-extrabold text-[20px]">
                    {stock?.name}:
                  </h2>
                  <p className=" font-medium">
                    Amount hold: <span className=" font-serif">₹</span>
                    {stock?.amount} on{" "}
                    {new Date(stock?.inv_date).toLocaleDateString("en-GB")}
                  </p>
                  <p className="font-medium">Status: {stock?.status}</p>
                  {stock?.c ||
                  stock?.h ||
                  stock?.l ||
                  stock?.o ||
                  stock?.pc != 0 ? (
                    <>
                      <p>Current Price: ${stock?.c}</p>
                      <p>Highest Price: ${stock?.h}</p>
                      <p>Lowest Price: ${stock?.l}</p>
                      <p>Opening: ${stock?.o}</p>
                      <p>Previous Close: ${stock?.pc}</p>
                    </>
                  ) : (
                    <>
                      <p>Not in US Stock Exchange</p>
                      <Link
                        className="text-blue-600 font-medium hover:underline"
                        href={`https://www.google.com/search?q=${stock?.name}+stock`}
                        target="_blank"
                      >
                        Track Here
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default InvestmentsPage;
