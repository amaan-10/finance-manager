"use client";
import { useState } from "react";

const RedeemRewards = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);

  const redeem = async (rewardType: string) => {
    setLoading(true);
    await fetch("/api/rewards/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, rewardType }),
    });
    setLoading(false);
    // window.location.reload();
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => redeem("gift_card")}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
      >
        Redeem ₹100 Gift Card (1000 Points)
      </button>
      <button
        onClick={() => redeem("badge")}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        Redeem Savings Badge (500 Points)
      </button>
    </div>
  );
};

export default RedeemRewards;
