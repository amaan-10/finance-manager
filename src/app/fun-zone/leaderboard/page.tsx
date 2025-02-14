"use client";
import { faMedal, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Leaderboard {
  id: string;
  name: string;
  goal: number;
  totalSavings: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

  useEffect(() => {
    fetch("/api/challenges/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return (
    <div className="mt-5 max-w-2xl ">
      <h1 className="text-3xl font-bold mb-4">
        <FontAwesomeIcon
          className="w-7 h-7 mt-1 text-[#D6AF36] "
          icon={faMedal}
        />{" "}
        Savings Leaderboard
      </h1>

      {leaderboard.map((user, index) => (
        <div key={index} className="mb-4 p-4 bg-white shadow rounded">
          <h3 className="font-semibold">
            #{index + 1} User {user.id}
          </h3>
          <p>
            <FontAwesomeIcon
              className="w-5 h-5 mt-1 text-[#C4A484] "
              icon={faSackDollar}
            />{" "}
            Total Savings Points: {user.totalSavings}
          </p>
        </div>
      ))}
    </div>
  );
}
