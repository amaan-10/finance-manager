// app/investments/page.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Investment {
  _id: string;
  type: string;
  amount: number;
  date: string;
  currentValue?: number;
  name?: string;
}

const InvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.log(id);
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

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newInvestment = { type, amount, date, name };
    console.log(newInvestment);

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
      <h2>Investments Overview</h2>
      <h2 className=" bg-yellow-300">Coming Soon...</h2>
      <ul>
        {investments.map((inv) => (
          <span className="grid md:grid-cols-2 lg:grid-cols-3" key={inv._id}>
            <span className=" ">
              {inv.type}: <span className=" font-serif">₹</span>
              {inv.amount} on {new Date(inv.date).toLocaleDateString()}
            </span>
            <button
              className=" text-left hover:underline text-red-600"
              onClick={() => deleteInvestment(inv._id)}
            >
              Delete Investment
            </button>
          </span>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="mt-2 flex gap-3">
          <input
            type="text"
            placeholder="Investment Type"
            value={type}
            className=" pl-1"
            onChange={(e) => setType(e.target.value)}
            required
          />
          {type.toLocaleLowerCase() === "stock" ? (
            <input
              type="text"
              placeholder="Stock Name"
              value={name}
              className=" pl-1"
              onChange={(e) => setName(e.target.value)}
              required
            />
          ) : (
            ""
          )}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            className=" pl-1"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            className=" pl-1"
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">Add Investment</button>
        </div>
      </form>
    </section>
  );
};

export default InvestmentsPage;
