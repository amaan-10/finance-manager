"use client";
import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  name: string;
  goal: number;
  progress?: number;
  streak?: number;
  badge?: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => setChallenges(data));
  }, []);

  const completeChallenge = async (challenge: Challenge) => {
    const id = challenge.id;
    const res = await fetch(`/api/challenges/complete`, {
      method: "POST",
      body: JSON.stringify(challenge),
    });
    if (!res.ok) throw new Error("Failed to mark challenge as complete");

    setChallenges((prev) =>
      prev.map((ch) =>
        ch.id === id
          ? {
              ...ch,
              progress: (ch.progress ?? 0) + 1,
              streak: (ch.streak ?? 0) + 1,
            }
          : ch
      )
    );
    window.location.reload();
  };

  return (
    <div className="mt-5 max-w-2xl ">
      <h1 className="text-3xl font-bold mb-4">🎯 Savings Challenges</h1>

      {/* Predefined Challenges */}
      <h2 className="text-xl font-semibold mb-2">🔥 Pick a Challenge</h2>
      <select
        className="border rounded-lg p-2 w-full mb-4"
        onChange={(e) => setSelectedChallenge(e.target.value)}
        value={selectedChallenge}
      >
        <option className=" font-mono" value="">
          Select a Challenge
        </option>
        {challenges.map((ch) => (
          <option className=" font-mono" key={ch.id} value={ch.name}>
            {ch.name} (Goal: {ch.goal})
          </option>
        ))}
      </select>

      {/* Active Challenges */}
      <h2 className="text-xl font-semibold mb-2">🏆 Your Active Challenges</h2>
      {[...challenges]
        .sort((a, b) => ((a.progress ?? 0) >= a.goal ? 1 : -1))
        .map((challenge) => (
          <div
            key={challenge.id}
            className="mb-4 p-4 bg-white shadow rounded-lg"
          >
            <h4 className="font-semibold text-lg font-mono">
              {challenge.name} 🔥
            </h4>
            <p>Streak: {challenge.streak ?? 0} days</p>
            <p>
              Progress: {challenge.progress ?? 0} / {challenge.goal}
            </p>
            <p>Badge: {challenge.badge ?? "🎖 No badge yet"}</p>
            <div className="w-full bg-gray-300 h-2 rounded mt-2">
              <div
                className="bg-green-500 h-2 rounded"
                style={{
                  width: `${
                    ((challenge.progress ?? 0) / challenge.goal) * 100
                  }%`,
                }}
              ></div>
            </div>
            {challenge.goal > (challenge.progress ?? 0) ? (
              <button
                onClick={() => completeChallenge(challenge)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                ✅ Mark as Completed
              </button>
            ) : (
              <button
                className="mt-2 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                ✅ Completed
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
