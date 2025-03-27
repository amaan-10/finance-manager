"use client";
import { useState } from "react";

const EarnPoints = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);

  const earnPoints = async (action: string) => {
    setLoading(true);
    await fetch("/api/rewards/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    setLoading(false);
    // window.location.reload();
  };

  return (
    <div className="mt-4 space-y-2 text-black">
      <button
        onClick={() => earnPoints("log_expense")}
        disabled={loading}
        className="bg-blue-600 text-black px-4 py-2 rounded-lg"
      >
        Earn 10 Points (Log Expenses)
      </button>
      <button
        onClick={() => earnPoints("budget_completed")}
        disabled={loading}
        className="bg-green-600 text-black px-4 py-2 rounded-lg"
      >
        Earn 100 Points (Complete Budget)
      </button>
      <button
        onClick={() => earnPoints("savings_goal")}
        disabled={loading}
        className="bg-purple-600 text-black px-4 py-2 rounded-lg"
      >
        Earn 200 Points (Savings Goal)
      </button>
    </div>
  );
};

export default EarnPoints;
