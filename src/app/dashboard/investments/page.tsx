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
  id: string;
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
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stocksError, setStocksError] = useState<string | null>(null);
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
      setError((error as Error).message);
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
      //console.log(id);
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
        //console.log(data);

        setStocks(data);
      } catch (err) {
        setStocksError((err as Error).message);
      } finally {
        setLoadingStocks(false);
      }
    };

    fetchStockData();
  }, []);

  // if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //console.log(type, name);
    const newInvestment = { type, amount, date, name };
    //console.log(newInvestment);

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
      <h2 className="text-[26px] font-bold">Investments</h2>
      <p className="pt-2">Please add your investments here.</p>

      <form onSubmit={handleSubmit}>
        <div className="mt-2 flex flex-col flex-wrap md:flex-row gap-3">
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
              placeholder="Investment Type"
              value={type.toLowerCase()}
              onChange={(e) => setType(e.target.value.toLowerCase())}
              required
            />
          </div>
          {type === "stock" ? (
            <div className="relative ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                >
                  <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                placeholder="Stock Symbol Name"
                value={name.toUpperCase()}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                required
              />
            </div>
          ) : (
            ""
          )}
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 320 512"
              >
                <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
              </svg>
            </div>
            <input
              type="number"
              placeholder="Amount"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 532 532"
              >
                <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
              </svg>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
            />
          </div>
          <button
            type="submit"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Add Investment
          </button>
        </div>
      </form>
      {loading ? (
        <p className="pt-3">Loading investments...</p> // Loading state
      ) : error ? (
        <p className="pt-3">Error: {error}</p> // Error state
      ) : !investments || investments.length === 0 ? (
        <p className="pt-3">- No investments till now.</p>
      ) : (
        // <ul>
        //   {investments.map((inv) => (
        //     <span className="grid md:grid-cols-2 lg:grid-cols-3" key={inv._id}>
        //       {inv.type !== "stock" ? (
        //         <>
        //           <span className=" ">
        //             {inv.type}: <span className=" font-serif">₹</span>
        //             {inv.amount} on{" "}
        //             {new Date(inv.date).toLocaleDateString("en-GB")}
        //           </span>
        //           <button
        //             className=" text-left max-w-44 hover:underline text-red-600"
        //             onClick={() => deleteInvestment(inv._id)}
        //           >
        //             Delete Investment
        //           </button>
        //         </>
        //       ) : (
        //         ""
        //       )}
        //     </span>
        //   ))}
        // </ul>
        <>
          <div className=" mt-4 md:w-2/3 lg:w-3/5 relative overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className=" text-sm text-gray-700 uppercase bg-gray-200 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) =>
                  inv.type !== "stock" ? (
                    <tr
                      key={inv._id}
                      className="bg-white border-b  hover:bg-gray-100 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {inv.type}
                      </th>
                      <td className="px-6 py-4">
                        <span className=" font-serif">₹</span>
                        {inv.amount}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(inv.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className=" text-left max-w-44 font-medium hover:underline text-red-600"
                          onClick={() => deleteInvestment(inv._id)}
                        >
                          Delete Investment
                        </button>
                      </td>
                    </tr>
                  ) : (
                    ""
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div>
        <div className=" pt-5">
          <h2 className=" font-extrabold text-xl">Stock Portfolio</h2>
          <h2 className=" pt-2 font-extrabold text-xl">
            Only US - [NYSE, NASDAQ] stock exchange
          </h2>
          {loadingStocks ? (
            <p>Loading stocks invested...</p> // Loading state
          ) : stocksError ? (
            <p>Error: {stocksError}</p> // Error state
          ) : !stockData || stockData.length === 0 ? (
            <p>- No stock invested till now.</p>
          ) : (
            <>
              <ul>
                {stockData.map((stock, index) => (
                  <li key={index} className=" my-2">
                    {stock?.c ||
                    stock?.h ||
                    stock?.l ||
                    stock?.o ||
                    stock?.pc != 0 ? (
                      <div className=" bg-[#222225] text-[#e8e9ed] p-4 border rounded-[10px] md:w-1/2">
                        <h2 className=" font-extrabold text-[20px]">
                          {stock?.name}:
                        </h2>
                        <p className=" font-medium">
                          <span className="text-[#0058E0]">Amount hold: </span>
                          <span className=" text-[#E08009]">
                            <span className="font-serif">₹</span>
                            {stock?.amount}
                          </span>{" "}
                          on{" "}
                          <span className="text-[#00E0C4]">
                            {new Date(stock?.inv_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </p>
                        <p className="font-medium">
                          <span className="text-[#00AAE0]">Status: </span>{" "}
                          <span className="text-[#18E000]">
                            {stock?.status}
                          </span>{" "}
                        </p>
                        <p>
                          <span className="text-[#00AAE0]">
                            Current Price:{" "}
                          </span>{" "}
                          ${stock?.c}
                        </p>
                        <p>
                          <span className="text-[#00AAE0]">
                            Highest Price:{" "}
                          </span>{" "}
                          ${stock?.h}
                        </p>
                        <p>
                          <span className="text-[#00AAE0]">Lowest Price: </span>{" "}
                          ${stock?.l}
                        </p>
                        <p>
                          <span className="text-[#00AAE0]">Opening: </span> $
                          {stock?.o}
                        </p>
                        <p>
                          <span className="text-[#00AAE0]">
                            Previous Close:{" "}
                          </span>{" "}
                          ${stock?.pc}
                        </p>
                        <br />
                        <button
                          className=" text-left font-medium hover:underline text-red-600"
                          onClick={() => deleteInvestment(stock?.id)}
                        >
                          Delete Investment
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
              </ul>
              <h2 className=" inline font-extrabold text-xl">
                <br />
                Other than US Stock Exchange
              </h2>
              <ul>
                {stockData.map((stock, index) => (
                  <li key={index} className="my-2">
                    {stock?.c ||
                    stock?.h ||
                    stock?.l ||
                    stock?.o ||
                    stock?.pc != 0 ? (
                      ""
                    ) : (
                      <div className=" bg-[#222225] text-[#e8e9ed] p-4 border rounded-[10px] md:w-1/2">
                        <h2 className=" pt-3 font-extrabold text-[20px]">
                          {stock?.name}:
                        </h2>
                        <p className=" font-medium">
                          <span className="text-[#00AAE0]">Amount hold: </span>
                          <span className=" text-[#E08009]">
                            <span className="font-serif">₹</span>
                            {stock?.amount}
                          </span>{" "}
                          on{" "}
                          <span className="text-[#00E0C4]">
                            {new Date(stock?.inv_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </p>
                        <p className="font-medium">
                          <span className="text-[#00AAE0]">Status: </span>{" "}
                          <span className="text-[#18E000]">
                            {stock?.status}
                          </span>{" "}
                        </p>
                        <br />
                        <Link
                          className="text-blue-600 font-medium hover:underline"
                          href={`https://www.google.com/search?q=${stock?.name}+stock`}
                          target="_blank"
                        >
                          Track Here
                        </Link>
                        <button
                          className=" block text-left font-medium hover:underline text-red-600"
                          onClick={() => deleteInvestment(stock?.id)}
                        >
                          Delete Investment
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default InvestmentsPage;
