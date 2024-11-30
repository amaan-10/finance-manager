/* eslint-disable react/jsx-key */
"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

interface Expense {
  totalAmount: number;
  _id: {
    month: number;
    year: number;
  };
}

type categoryExpenses = {
  category: string;
  totalAmount: number;
};

type Transactions = {
  category: string;
  amount: number;
  date: string;
  notes?: string;
};

type Budget = {
  budget: number;
  spend: number;
  remaining: number;
  month: number;
  year: number;
};

type Investment = {
  totalAmount: number;
  _id: string;
};

type TotalInvestment = {
  totalAmount: number;
  _id: null;
};

// app/dashboard/page.tsx
export default function AnalyticsPage() {
  const [outerRadius, setOuterRadius] = useState(100);

  // Adjust outer radius based on window width
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 500 && window.innerWidth > 400) {
        setOuterRadius(75); // Smaller radius for mobile
      } else if (window.innerWidth < 400 && window.innerWidth > 0) {
        setOuterRadius(50); // Smaller radius for mobile
      } else {
        setOuterRadius(100); // Larger radius for desktop/tablet
      }
    };

    // Set the initial radius
    updateRadius();

    // Listen for window resize events
    window.addEventListener("resize", updateRadius);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses/monthly`);
        const data = await res.json();
        //console.log("Monthly Expenses:", data);
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyExpenses();
  }, []);

  const getTotalAmountForMonth = (month: number, year: number) => {
    if (!expenses) return 0;
    const entry = expenses.find(
      (item) => item._id.month === month && item._id.year === year
    );
    return entry ? entry.totalAmount : 0; // Return 0 if no data is found
  };

  const getComparison = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = currentDate.getFullYear();

    // Handle cases where the previous month is December of the previous year
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentAmount = getTotalAmountForMonth(currentMonth, currentYear);
    const previousAmount = getTotalAmountForMonth(previousMonth, previousYear);

    // Calculate percentage difference
    if (previousAmount === 0) return { currentAmount, differencePercent: null }; // Avoid division by 0

    const differencePercent =
      ((currentAmount - previousAmount) / previousAmount) * 100;
    return {
      currentAmount,
      differencePercent: parseFloat(differencePercent.toFixed(2)),
    };
  };

  const { currentAmount, differencePercent } = getComparison();

  function getMonthName(monthNumber: number): string {
    const months: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1];
  }

  const monthlyExpense = (expenses || []).map((item) => ({
    ...item,
    expense: item.totalAmount,
    label: `${getMonthName(item._id.month)}, ${item._id.year}`, // Combine month and year
  }));
  //   console.log(monthlyExpense);

  const [categoryExpenses, setCategoryExpenses] = useState<
    categoryExpenses[] | null
  >(null);
  const [categoryloading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [highestCategory, setHighestCategory] = useState<string>("Category");
  const [highestPercentage, setHighestPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses/category`);
        const data: categoryExpenses[] = await res.json();
        //console.log("Monthly Expenses:", data);
        setCategoryExpenses(data);

        // Calculate the total amount across all categories
        const totalSum = data.reduce((sum, item) => sum + item.totalAmount, 0);
        //console.log(totalSum);

        // Find the category with the highest totalAmount
        let highestCategoryData;

        if (data.length > 0) {
          highestCategoryData = data.reduce((max, item) =>
            item.totalAmount > max.totalAmount ? item : max
          );
        } else {
          highestCategoryData = null; // Or provide a default value
        }

        //console.log(highestCategoryData); // Output: null

        //console.log(highestCategoryData);

        // Calculate the percentage of the highest category
        if (highestCategoryData) {
          const highestPercentage = (
            (highestCategoryData.totalAmount / totalSum) *
            100
          ).toFixed(2);
          setHighestPercentage(parseFloat(highestPercentage));
          setHighestCategory(highestCategoryData.category);
        } else {
          setHighestPercentage(0);
          setHighestCategory("Category");
        }

        //console.log(highestPercentage);
      } catch (err: any) {
        setCategoryError(err.message);
        console.error(err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchMonthlyExpenses();
  }, []);
  const categoryExp = (categoryExpenses || []).map((item) => ({
    ...item,
  }));
  // console.log(categoryExp);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const Category = capitalizeFirstLetter(highestCategory);

  const [transactions, setTransactions] = useState(0);
  const [percentageGrowth, setPercentageGrowth] = useState(0);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data: Transactions[] = await response.json();
        // console.log(data);

        // Get the current date
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0-indexed
        const currentYear = currentDate.getFullYear();

        // Calculate the previous month and year
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Filter expenses for the current and previous months
        const currentMonthExpenses = data.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        });

        const previousMonthExpenses = data.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === previousMonth &&
            expenseDate.getFullYear() === previousYear
          );
        });

        // Calculate counts
        const currentCount = currentMonthExpenses.length;
        const previousCount = previousMonthExpenses.length;

        // Calculate percentage growth
        if (previousCount === 0) {
          setTransactions(currentCount);
          setPercentageGrowth(0); // Avoid division by 0
        } else {
          const percentageGrowth =
            ((currentCount - previousCount) / previousCount) * 100;

          setTransactions(currentCount);
          setPercentageGrowth(parseFloat(percentageGrowth.toFixed(2)));
        }
      } catch (err: any) {
        setTransactionsError(err.message);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  //console.log(percentageGrowth);

  function generateUniqueColors(n: number): string[] {
    const colors: string[] = [];
    const step = 360 / n;

    for (let i = 0; i < n; i++) {
      const hue = Math.floor(i * step);
      const saturation = 100;
      const lightness = 40;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

  const colors = generateUniqueColors(categoryExp.length);

  const [budgets, setBudget] = useState<Budget[] | null>(null);
  const [budgetsData, setBudgetsData] = useState<any[]>([]);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyBudget = async () => {
      try {
        const res = await fetch(`/api/budgets/monthly`);
        const data = await res.json();
        //console.log("Monthly Budget:", data);
        //console.log(data[0]);
        setBudget(data);
        if (data) {
          const total = data[0]?.budget ?? 0;
          const spentPercentage = ((data[0]?.spend ?? 0) / total) * 100;
          const remainingPercentage = ((data[0]?.remaining ?? 0) / total) * 100;
          //console.log(data[0].budget);

          setBudgetsData([
            { name: "Spent", value: spentPercentage },
            {
              name: "Remaining",
              value: remainingPercentage < 0 ? 0 : remainingPercentage,
            },
          ]);
        }
      } catch (err: any) {
        setBudgetError(err.message);
      } finally {
        setBudgetLoading(false);
      }
    };
    fetchMonthlyBudget();
  }, []);

  const getSavingForMonth = (month: number, year: number) => {
    if (!budgets) return 0;
    const entry = budgets.find(
      (item) => item.month === month && item.year === year
    );
    return entry ? entry.remaining : 0; // Return 0 if no data is found
  };

  const getSavingComparison = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = currentDate.getFullYear();

    // Handle cases where the previous month is December of the previous year
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentSavings = getSavingForMonth(currentMonth, currentYear);
    const previousSavings = getSavingForMonth(previousMonth, previousYear);

    // Calculate percentage difference
    if (previousSavings === 0)
      return { currentSavings, differencePercentSaving: null }; // Avoid division by 0

    const differencePercentSaving =
      ((currentSavings - previousSavings) / previousSavings) * 100;
    return {
      currentSavings,
      differencePercentSaving: parseFloat(differencePercentSaving.toFixed(2)),
    };
  };

  const { currentSavings, differencePercentSaving } = getSavingComparison();

  // console.log(budgets);

  const RADIAN = Math.PI / 180;
  const COLORS = ["#FF8042", "#00C49F"];

  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;

  const needle = (
    value: number,
    data: any[],
    cx: number,
    cy: number,
    iR: number,
    oR: number,
    color: string
  ) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle key={0} cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        key={1}
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="#none"
        fill={color}
      />,
    ];
  };

  const [investments, setInvestment] = useState<Investment[] | null>(null);
  const [totalInvestment, setTotalInvestment] = useState<string>("");
  const [investmentLoading, setInvestmentLoading] = useState(true);
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalInvestment = async () => {
      try {
        const res = await fetch(`/api/investments/total`);
        const data = await res.json();
        // console.log("Total Investment:", data);
        setInvestment(data.byType);
        setTotalInvestment(data.totalAmount);
        //console.log(data);
      } catch (err: any) {
        setInvestmentError(err.message);
      } finally {
        setInvestmentLoading(false);
      }
    };
    fetchTotalInvestment();
  }, []);

  return (
    <section className=" mt-5">
      <h2 className="text-[26px] font-bold">Analytics</h2>
      <div className="mt-5">
        <div className="flex gap-5 flex-col md:flex-row w-auto">
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <span className="px-7 font-medium text-base">Total Spent</span>

              <svg
                className=" pt-1 h-6 pr-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                fill="#64748b"
              >
                <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
              </svg>
            </div>
            <div className="px-7 font-bold text-3xl pt-2">
              <span className=" font-serif">₹</span>
              {currentAmount}
            </div>
            <div className="px-7 text-sm font-normal text-slate-500">
              <span className="">
                {differencePercent !== null
                  ? `${differencePercent > 0 ? "+" : ""}${differencePercent}%`
                  : "0%"}{" "}
                from last month
              </span>
            </div>
          </div>
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <span className="px-7 font-medium">Savings</span>
              <svg
                className=" pt-1 h-6 pr-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                fill="#64748b"
                viewBox="0 0 512 512"
              >
                <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2c0 0 0 0 0 0s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
              </svg>
            </div>
            <div className="px-7 font-bold text-3xl pt-2">
              <span className=" font-serif">₹</span>
              {currentSavings}
            </div>
            <div className="px-7 text-sm font-normal text-slate-500">
              <span className="">
                {differencePercentSaving !== null
                  ? `${
                      differencePercentSaving > 0 ? "+" : ""
                    }${differencePercentSaving}%`
                  : "0%"}{" "}
                from last month
              </span>
            </div>
          </div>
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <span className="px-7 font-medium">Top Category</span>
              <svg
                className=" pt-1 h-6 pr-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                fill="#64748b"
                viewBox="0 0 576 512"
              >
                <path d="M544.018 223.25C535.768 103.75 440.268 8.25 320.768 0C320.518 0 320.143 0 319.768 0C311.143 0 304.018 7.5 304.018 16.25V240H527.768C536.893 240 544.643 232.375 544.018 223.25ZM352.018 192V53.5C419.518 71 473.018 124.5 490.518 192H352.018ZM256.018 288V50.75C256.018 41.875 248.893 34.5 240.268 34.5C239.518 34.5 238.893 34.5 238.143 34.625C119.018 51.5 27.893 155.625 32.143 280.375C36.518 407.5 145.143 512 272.143 512C273.143 512 274.018 512 275.018 512C325.393 511.375 372.018 495.125 410.268 468C418.268 462.375 418.768 450.75 411.893 443.875L256.018 288ZM274.518 464H272.143C171.518 464 83.518 379.125 80.143 278.75C77.268 193.375 130.268 118.375 208.018 91.125V307.875L222.018 322L348.268 448.125C325.143 458.25 300.143 463.625 274.518 464ZM559.768 288H322.518L480.518 446C483.768 449.25 488.018 450.875 492.143 450.875C496.018 450.875 499.768 449.5 502.768 446.75C541.393 410.25 568.018 361.125 575.893 305.875C577.268 296.375 569.393 288 559.768 288Z" />
              </svg>
            </div>
            <div className="px-7 font-bold text-3xl pt-2">{Category}</div>
            <div className="px-7 text-sm font-normal text-slate-500">
              <span className="">{highestPercentage}% of total spending</span>
            </div>
          </div>
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <span className="px-7 font-medium ">Transactions</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" pt-1 h-6 pl-[30px] transform scale-x-[-1]"
                fill="#64748b"
                viewBox="0 0 576 512"
              >
                <path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z" />
              </svg>
            </div>
            <div className="px-7 font-bold text-3xl pt-2">{transactions}</div>
            <div className="px-7 text-sm font-normal text-slate-500">
              <span className="">
                {percentageGrowth !== null
                  ? `${percentageGrowth > 0 ? "+" : ""}${percentageGrowth}%`
                  : "0%"}{" "}
                from last month
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex gap-5 flex-col md:flex-row">
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <p className="text-xl font-semibold px-7">Monthly Expenses Trend</p>
            {loading ? (
              <p className="px-7">Loading expenses...</p> // Loading state
            ) : error ? (
              <p className="px-7">Error: {error}</p> // Error state
            ) : !expenses || expenses.length === 0 ? (
              <p className="px-7">- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <div className="h-[350px] pr-7">
                <p className="text-base text-slate-500 pb-2 px-7">
                  Your spending pattern over the time
                </p>
                <ResponsiveContainer>
                  <LineChart data={monthlyExpense}>
                    <Line type="monotone" dataKey="expense" stroke="#8884d8" />

                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="line"
                      wrapperStyle={{ paddingBottom: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className=" border rounded-lg bg-white p-4 px-7 pb-12 md:w-3/4 lg:w-1/2">
            <p className="text-xl font-semibold">Expenses by Category</p>
            {categoryloading ? (
              <p>Loading expenses...</p> // Loading state
            ) : categoryError ? (
              <p>Error: {categoryError}</p> // Error state
            ) : !categoryExp || categoryExp.length === 0 ? (
              <p>- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <div className="h-[350px] ">
                <p className="text-base text-slate-500 pb-2">
                  Breakdown of your this month's expenses by category
                </p>
                <div className="h-[300px] xs:h-[330px]   ">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryExp}
                        dataKey="totalAmount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        label
                      >
                        {/* Optional: Custom Colors */}
                        {categoryExp.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" pt-5">
          <div className=" border rounded-lg bg-white p-4 px-7 w-full ">
            <span className="text-xl font-semibold">Remaining Budget: </span>
            {budgetLoading ? (
              <p>Loading budgets...</p> // Loading state
            ) : budgetError ? (
              <p>Error: {budgetError}</p> // Error state
            ) : !budgets || budgets.length === 0 ? (
              <p>- No budget set for this month.</p> // No data found
            ) : (
              <div className="h-[325px] ">
                <p className="text-base text-slate-500 pb-2">
                  Budget Spent vs Budget Remaining Analysis
                </p>
                <ResponsiveContainer height={200}>
                  <PieChart>
                    <Pie
                      data={budgetsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="75%"
                      innerRadius="50"
                      outerRadius="100"
                      fill="#8884d8"
                      startAngle={180}
                      endAngle={0}
                      isAnimationActive={true} // Enable animation
                      animationDuration={1500} // Animation duration in ms
                      animationBegin={0} // Delay before animation starts
                    >
                      {budgetsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    {/* Render Needle */}
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="55 58 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {needle(
                        budgetsData[0].value,
                        budgetsData,
                        cx,
                        cy,
                        iR,
                        oR,
                        "#d0d000"
                      )}
                      {/* Adjust radius for alignment */}
                    </svg>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <span className=" text-[#FF8042] text-lg">
                    ● spent - <span className=" font-serif">₹</span>
                    {budgets[0]?.spend ?? 0}
                  </span>
                </div>
                <div className="text-center">
                  <span className=" text-[#00C49F] text-lg">
                    ● remaining - <span className=" font-serif">₹</span>
                    {(budgets[0]?.remaining ?? 0) <= 0 ? (
                      <>
                        {budgets[0]?.remaining ?? 0}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          budget limit exceeded!!
                        </div>
                      </>
                    ) : (budgets[0]?.remaining ?? 0) > 0 &&
                      ((budgets[0]?.remaining ?? 0) * 100) /
                        (budgets[0]?.budget ?? 0) <=
                        10 ? (
                      <>
                        {budgets[0]?.remaining ?? 0}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          about to run out of budget! spend wisely!!
                        </div>
                      </>
                    ) : (
                      budgets[0]?.remaining ?? 0
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" pt-5">
          <div className=" border rounded-lg bg-white p-4 px-7 w-full">
            <span className="text-xl font-semibold">Total Investments: </span>
            {investmentLoading ? (
              <p>Loading Total Investments...</p> // Loading state
            ) : investmentError ? (
              <p>Error: {investmentError}</p> // Error state
            ) : !investments || investments.length === 0 ? (
              <p>- No investment found.</p> // No data found
            ) : (
              // Render expense list if data exists
              // <>
              //   <span className=" font-serif">₹</span>
              //   {`${totalInvestment}`}
              //   <div className="pt-1"></div>
              //   {investments.map((investment, index) => (
              //     <li key={index}>
              //       {`${investment._id} - Total: `}
              //       <span className=" font-serif">₹</span>
              //       {`${investment.totalAmount}`}
              //     </li>
              //   ))}
              // </>
              <div className="h-[400px] ">
                <p className="text-base text-slate-500 pb-2">
                  Breakdown of your total investment
                </p>
                <div className="h-[300px] xs:h-[330px]   ">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={investments}
                        dataKey="totalAmount"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        label
                      >
                        {/* Optional: Custom Colors */}
                        {investments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="mt-5 flex flex-col sm:flex-row">
        <Link className="underline text-black" href={"/dashboard/expenses"}>
          View Expenses
        </Link>
        <Link className="underline text-black" href={"/dashboard/investments"}>
          View Investments
        </Link>
      </nav>
    </section>
  );
}
