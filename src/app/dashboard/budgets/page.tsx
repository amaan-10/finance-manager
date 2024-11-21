// app/dashboard/expenses/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Budget {
  amount: number;
  month: number; // You can also use a Date
  year: number;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthYear, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");
  const [minMonth, setMinMonth] = useState<string>("");

  // Set minimum month to the current month dynamically
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // Format: YYYY-MM
    setMinMonth(currentMonth);
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/budgets");
        const data = await response.json();
        setBudgets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!monthYear || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    const [year, month] = monthYear.split("-").map(Number);
    //console.log(year, month);

    const newBudget = {
      amount: parseFloat(amount),
      month, // You can also use a Date
      year,
    };

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });

      //Refresh the budgets list
      setBudgets([...budgets, newBudget]);

      setMonth("");
      setAmount("");

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.message); // Show error message if budget already exists
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message);
      console.log(err);
    }
    //console.log(monthYear);
  };

  const handleDeleteBudget = async (month: number, year: number) => {
    try {
      const userConfirmed = confirm(
        "Are you sure you want to delete this budget?"
      );
      //console.log(month, year);

      if (userConfirmed) {
        const res = await fetch("/api/budgets", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ month, year }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message); // Show error message if budget already exists
          window.location.reload();
        }
      } else {
        alert("Action canceled!");
      }
    } catch (err: any) {
      alert(err.message);
      console.log(err);
    }
  };

  function getMonthName(monthNumber: number): string {
    const months: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  }

  return (
    <section className="mt-5">
      <h2 className="text-[26px] font-bold">Budgets</h2>
      {!budgets || budgets.length === 0 ? (
        <>
          <p className="pt-2">Please set your budget here.</p>
        </>
      ) : (
        <p className="pt-2">
          Please re-enter the amount with same month to update the Budget.
        </p>
      )}
      <div className="mt-2 flex flex-col md:flex-row gap-3">
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
            type="month"
            placeholder={monthYear}
            value={monthYear}
            onChange={(e) => setMonth(e.target.value)}
            min={minMonth}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
            required
          />
        </div>
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={handleAddBudget}
        >
          Add Budget
        </button>
      </div>
      {loading ? (
        <p className="pt-3">Loading budgets...</p> // Loading state
      ) : error ? (
        <p className="pt-3">Error: {error}</p> // Error state
      ) : !budgets || budgets.length === 0 ? (
        <>
          <p className="pt-3">- No budgets till now.</p>
        </>
      ) : (
        <>
          {/* <ul className="mt-2">
            {budgets.map((budget, index) => (
              <span className="grid md:grid-cols-2 lg:grid-cols-3" key={index}>
                <span className="">
                  Budget - <span className=" font-serif">₹</span>
                  {budget.amount} for {budget.month}, {budget.year}
                </span>
                <button
                  className=" hover:underline max-w-32 text-start text-red-600"
                  onClick={() => handleDeleteBudget(budget.month, budget.year)}
                >
                  Delete Budget
                </button>
              </span>
            ))}
          </ul> */}

          <div className=" mt-4 md:w-2/3 lg:w-1/2 relative overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className=" text-sm text-gray-700 uppercase bg-gray-200 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b  hover:bg-gray-100 "
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {getMonthName(budget.month)}, {budget.year}
                    </th>
                    <td className="px-6 py-4">
                      <span className=" font-serif">₹</span>
                      {budget.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className=" hover:underline max-w-32 font-medium text-start text-red-600"
                        onClick={() =>
                          handleDeleteBudget(budget.month, budget.year)
                        }
                      >
                        Delete Budget
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
