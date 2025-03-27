const API_URL = "/api/challenges/progress"; // Base API endpoint

export const trackDeposit = async (amount: number) => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "1", action: "deposit", amount }),
  });
};

export const updateProfileCompletion = async (completionPercentage: number) => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "2", action: "profile_update", progress: completionPercentage }),
  });
};

export const logInvestment = async () => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "3", action: "new_investment" }),
  });
};

export const trackSpending = async (noSpending: boolean) => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "4", action: noSpending ? "no_spending_today" : "reset" }),
  });
};

export const setupAutoSavings = async () => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "5", action: "auto_savings_enabled" }),
  });
};

export const referFriend = async () => {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: "6", action: "friend_signed_up" }),
  });
};
