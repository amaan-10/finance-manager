// app/dashboard/expenses/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Expense {
  _id?: string;
  category: string;
  amount: number;
  date: Date;
  notes?: string;
}

const months = [
  { name: "Select Month", value: "placeholder", disabled: true },
  { name: "All", value: "all" },
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const years = [
  { name: "Select Year", value: "placeholder", disabled: true },
  { name: "All", value: "all", disabled: false },
  ...Array.from({ length: 5 }, (_, i) => ({
    name: new Date().getFullYear() - i,
    value: new Date().getFullYear() - i,
    disabled: false,
  })),
];

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

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1 || ""
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear() || ""
  );

  // Filtering expenses
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (selectedMonth === "placeholder" || selectedYear === "placeholder")
      return true;

    if (selectedMonth === "all" && selectedYear === "all") return true;

    const matchesMonth =
      selectedMonth === "all" ||
      expenseDate.getMonth() + 1 === Number(selectedMonth);
    const matchesYear =
      selectedYear === "all" ||
      expenseDate.getFullYear() === Number(selectedYear);

    return matchesMonth && matchesYear;
  });

  const handleAddExpense = async () => {
    const newExpense = {
      category,
      amount: parseFloat(amount),
      date: new Date(),
    };
    if (!category || !amount) {
      alert("Please fill in all fields.");
      return;
    }
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
      <h2 className="text-[26px] font-bold">Expenses</h2>
      <p className="pt-2">Please add your expenses here.</p>
      <div className="mt-2 flex flex-col md:flex-row gap-3">
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
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
        <button
          type="button"
          className="border focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
          onClick={handleAddExpense}
        >
          Add Expense
        </button>
      </div>
      {loading ? (
        <p className="pt-3">Loading expenses...</p> // Loading state
      ) : error ? (
        <p className="pt-3">Error: {error}</p> // Error state
      ) : !expenses || expenses.length === 0 ? (
        <p className="pt-3">- No expenses till now.</p>
      ) : (
        <div className="mt-5 md:w-2/3 lg:w-3/5">
          {/* Dropdown Filters */}
          <div className="flex justify-end gap-4 mb-4 mr-2">
            {/* Month Dropdown */}
            <select
              className="p-2 border rounded-lg"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option
                  key={month.value}
                  value={month.value}
                  disabled={month.disabled}
                >
                  {month.name}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              className="p-2 border rounded-lg"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option
                  key={year.value}
                  value={year.value}
                  disabled={year.disabled}
                >
                  {year.name}
                </option>
              ))}
            </select>
          </div>
          {filteredExpenses.length > 0 ? (
            <div className=" mt-5 relative overflow-x-auto shadow-md rounded-lg">
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
                  {filteredExpenses.map((expense, index) => (
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
          ) : (
            <p>- No expenses found for the selected month & year.</p>
          )}
        </div>
      )}
    </section>
  );
}
