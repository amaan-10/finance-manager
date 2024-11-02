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

  return (
    <section className="mt-5">
      <h2>Budgets</h2>
      <h2 className=" bg-yellow-300">Work in Progress...</h2>
      {loading ? (
        <p>Loading budgets...</p> // Loading state
      ) : error ? (
        <p>Error: {error}</p> // Error state
      ) : !budgets || budgets.length === 0 ? (
        <>
          <p>- No budgets till now.</p>
          <p className="pt-3">Please set your budget here.</p>
        </>
      ) : (
        <>
          <ul className="mt-2">
            {budgets.map((budget, index) => (
              <li key={index}>
                Budget - <span className=" font-serif">₹</span>
                {budget.amount} for {budget.month}, {budget.year}
                <button
                  className=" hover:underline pl-16 text-red-600"
                  onClick={() => handleDeleteBudget(budget.month, budget.year)}
                >
                  Delete Budget
                </button>
              </li>
            ))}
          </ul>
          <p className="pt-3">
            Please re-enter the amount with same month to update the Budget.
          </p>
        </>
      )}
      <div className="mt-2 flex gap-3">
        <input
          type="number"
          placeholder="Amount"
          className=" pl-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="month"
          placeholder={monthYear}
          className=" pl-1"
          value={monthYear}
          onChange={(e) => setMonth(e.target.value)}
          min={minMonth}
        />

        <button onClick={handleAddBudget}>Add Budget</button>
      </div>
    </section>
  );
}
