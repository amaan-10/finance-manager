// app/dashboard/expenses/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Expense {
  category: string;
  amount: number;
  date: Date;
  notes?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data = await response.json();
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    const newExpense = {
      category,
      amount: parseFloat(amount),
      date: new Date(),
    };
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    // Refresh the expense list
    setExpenses([...expenses, newExpense]);
    setCategory("");
    setAmount("");
  };

  return (
    <section className="mt-5">
      <h2>Expenses</h2>
      <h2 className=" bg-yellow-300">Work in Progress...</h2>
      {loading ? (
        <p>Loading expenses...</p> // Loading state
      ) : error ? (
        <p>Error: {error}</p> // Error state
      ) : !expenses || expenses.length === 0 ? (
        <p>- No expenses till now.</p> // No data found
      ) : (
        <ul className="mt-2">
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.category} - <span className=" font-serif">₹</span>
              {expense.amount} on {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex gap-3">
        <input
          type="text"
          placeholder="Category"
          className=" pl-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className=" pl-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>
      <div className="mt-2 flex gap-3">
        <input
          type="number"
          placeholder="Budget"
          className=" pl-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add Budget</button>
      </div>
    </section>
  );
}
