"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Expense {
  totalAmount: number;
  _id: {
    month: number;
    year: number;
  };
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses/monthly`);
        const data = await res.json();
        console.log("Monthly Expenses:", data);
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyExpenses();
  }, []);

  return (
    <section className=" mt-5">
      <h2>Dashboard Overview</h2>

      <h2 className=" bg-yellow-300">Work in Progress...</h2>
      <div className="mt-2">
        <div>
          Monthly Expenses:
          {loading ? (
            <p>Loading expenses...</p> // Loading state
          ) : error ? (
            <p>Error: {error}</p> // Error state
          ) : !expenses || expenses.length === 0 ? (
            <p>No expenses found for this user.</p> // No data found
          ) : (
            // Render expense list if data exists
            <>
              {expenses.map((expense, index) => (
                <li key={index}>
                  {expense._id.month}, {expense._id.year} -{" "}
                  <span className=" font-serif">₹</span>
                  {expense.totalAmount}
                </li>
              ))}
            </>
          )}
        </div>
        <div>
          Remaining Budget: <span className=" font-serif">₹</span>200
        </div>
        <div>
          Total Investments: <span className=" font-serif">₹</span>--
        </div>
      </div>
      <nav className="mt-5">
        <Link className="text-black" href={"/dashboard/expenses"}>
          View Expenses
        </Link>
        <Link className="text-black" href={"/dashboard/investments"}>
          View Investments
        </Link>
      </nav>
    </section>
  );
}
