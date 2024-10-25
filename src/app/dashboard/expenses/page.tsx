// app/dashboard/expenses/page.tsx
"use client";
import { useState } from "react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Food", amount: 50, date: "2024-10-22" },
  ]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        category,
        amount: Number(amount),
        date: new Date().toISOString(),
      },
    ]);
    setCategory("");
    setAmount("");
  };

  return (
    <section className="mt-5">
      <h2>Expenses</h2>
      <h2 className=" bg-yellow-300">Work in Progress...</h2>
      <ul className="mt-2">
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - <span className=" font-serif">₹</span>
            {expense.amount} on {expense.date}
          </li>
        ))}
      </ul>
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
    </section>
  );
}
