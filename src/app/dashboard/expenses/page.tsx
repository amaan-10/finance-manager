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
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.reload();
    }

    // Refresh the expense list
    setExpenses([...expenses, newExpense]);
    setCategory("");
    setAmount("");
  };

  const handleDeleteExpenses = async (
    category: string,
    amount: number,
    date: Date
  ) => {
    try {
      const userConfirmed = confirm(
        "Are you sure you want to delete this expense?"
      );
      // console.log(category, amount, date);

      if (userConfirmed) {
        const res = await fetch("/api/expenses", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category, amount, date }),
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
      <h2 className=" text-2xl font-semibold">Expenses</h2>
      {loading ? (
        <p>Loading expenses...</p> // Loading state
      ) : error ? (
        <p>Error: {error}</p> // Error state
      ) : !expenses || expenses.length === 0 ? (
        <p>- No expenses till now.</p>
      ) : (
        // <ul className="mt-2">
        //   {expenses.map((expense, index) => (
        //     <span className="grid md:grid-cols-2 lg:grid-cols-3" key={index}>
        //       <span className=" ">
        //         {expense.category} - <span className=" font-serif">₹</span>
        //         {expense.amount} on{" "}
        //         {new Date(expense.date).toLocaleDateString("en-UK")}
        //       </span>
        //       <button
        //         className=" text-left max-w-36 hover:underline text-red-600"
        //         onClick={() =>
        //           handleDeleteExpenses(
        //             expense.category,
        //             expense.amount,
        //             expense.date
        //           )
        //         }
        //       >
        //         Delete Expense
        //       </button>
        //     </span>
        //   ))}
        // </ul>
        <div className=" mt-4 md:w-2/3 lg:w-3/5 relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className=" text-sm text-gray-700 uppercase bg-gray-200 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
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
              {expenses.map((expense, index) => (
                <tr
                  key={index}
                  className="bg-white border-b  hover:bg-gray-100 "
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {expense.category}
                  </th>
                  <td className="px-6 py-4">
                    <span className=" font-serif">₹</span>
                    {expense.amount}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(expense.date).toLocaleDateString("en-UK")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className=" text-left font-medium max-w-36 hover:underline text-red-600"
                      onClick={() =>
                        handleDeleteExpenses(
                          expense.category,
                          expense.amount,
                          expense.date
                        )
                      }
                    >
                      Delete Expense
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="pt-3">Please add your expenses here.</p>
      <div className="mt-2 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Category"
          className=" pl-1 max-w-80 md:w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className=" pl-1 max-w-80 md:w-auto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className=" self-start underline" onClick={handleAddExpense}>
          Add Expense
        </button>
      </div>
    </section>
  );
}
