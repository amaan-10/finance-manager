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

type Budget = {
  budget: number;
  spent: number;
  remaining: number;
};

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

  const [budgets, setBudget] = useState<Budget[] | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyBudget = async () => {
      try {
        const res = await fetch(`/api/budgets/monthly`);
        const data = await res.json();
        console.log("Monthly Budget:", data);
        setBudget(data.remaining);
        console.log(data);
      } catch (err: any) {
        setBudgetError(err.message);
      } finally {
        setBudgetLoading(false);
      }
    };
    fetchMonthlyBudget();
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
            <p>- No expenses found.</p> // No data found
          ) : (
            // Render expense list if data exists
            <>
              {expenses.map((expense, index) => (
                <li key={index}>
                  {`${expense._id.month}, ${expense._id.year} - Total: `}
                  <span className=" font-serif">₹</span>
                  {`${expense.totalAmount}`}
                </li>
              ))}
            </>
          )}
        </div>
        <div className=" pt-3">
          <div>
            Remaining Budget:{" "}
            {budgetLoading ? (
              <p>Loading budgets...</p> // Loading state
            ) : budgetError ? (
              <p>Error: {budgetError}</p> // Error state
            ) : !budgets || budgets.length === 0 ? (
              <p>- No budgets found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <>
                <span className=" font-serif">₹</span>
                {budgets}
              </>
            )}
          </div>
        </div>
        <div className=" pt-3">
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
