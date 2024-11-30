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

type Investment = {
  totalAmount: number;
  _id: string;
};

type TotalInvestment = {
  totalAmount: number;
  _id: null;
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
        //console.log("Monthly Expenses:", data);
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
        //console.log("Monthly Budget:", data);
        setBudget(data[0]?.remaining ?? 0);
        //console.log(data);
      } catch (err: any) {
        setBudgetError(err.message);
      } finally {
        setBudgetLoading(false);
      }
    };
    fetchMonthlyBudget();
  }, []);

  const [investments, setInvestment] = useState<Investment[] | null>(null);
  const [totalInvestment, setTotalInvestment] = useState<string>("");
  const [investmentLoading, setInvestmentLoading] = useState(true);
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalInvestment = async () => {
      try {
        const res = await fetch(`/api/investments/total`);
        const data = await res.json();
        //console.log("Total Investment:", data);
        setInvestment(data.byType);
        setTotalInvestment(data.totalAmount);
        //console.log(data);
      } catch (err: any) {
        setInvestmentError(err.message);
      } finally {
        setInvestmentLoading(false);
      }
    };
    fetchTotalInvestment();
  }, []);

  return (
    <section className=" mt-5">
      <h2 className="text-[26px] font-bold">Dashboard Overview</h2>

      <div className="mt-2">
        <div>
          <p className="text-lg font-medium">Monthly Expenses:</p>
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
            <span className="text-lg font-medium">Remaining Budget: </span>
            {budgetLoading ? (
              <p>Loading budgets...</p> // Loading state
            ) : budgetError ? (
              <p>Error: {budgetError}</p> // Error state
            ) : !budgets || budgets.length === 0 ? (
              <p>- No budget set for this month.</p> // No data found
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
          <span className="text-lg font-medium">Total Investments: </span>
          {investmentLoading ? (
            <p>Loading Total Investments...</p> // Loading state
          ) : investmentError ? (
            <p>Error: {investmentError}</p> // Error state
          ) : !investments || investments.length === 0 ? (
            <p>- No investment found.</p> // No data found
          ) : (
            // Render expense list if data exists
            <>
              <span className=" font-serif">₹</span>
              {`${totalInvestment}`}
              <div className="pt-1"></div>
              {investments.map((investment, index) => (
                <li key={index}>
                  {`${investment._id} - Total: `}
                  <span className=" font-serif">₹</span>
                  {`${investment.totalAmount}`}
                </li>
              ))}
            </>
          )}
        </div>
      </div>
      <nav className="mt-5 flex flex-col sm:flex-row">
        <Link className="underline text-black" href={"/dashboard/expenses"}>
          View Expenses
        </Link>
        <Link className="underline text-black" href={"/dashboard/investments"}>
          View Investments
        </Link>
      </nav>
    </section>
  );
}
