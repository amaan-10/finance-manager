/* eslint-disable react/jsx-key */
"use client";
import * as React from "react";
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
  Label,
} from "recharts";

import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

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

type thisMonthBudget = {
  budget: number;
  spent: number;
  remaining: number;
};

type Investment = {
  totalAmount: number;
  _id: string;
};

type TotalInvestment = {
  totalAmount: number;
  _id: null;
};

function convertToCamelCase(str: string) {
  return str
    .toLowerCase() // Convert the string to lowercase
    .replace(
      /(?:^\w|[A-Z]|\b\w|\s+)/g, // Use regex to match spaces and capitalize next letters
      (match: any, index: any) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, ""); // Remove spaces
}

const lineChartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(12 76% 61%)",
  },
} satisfies ChartConfig;

function generatePieChartConfig(
  data: Array<{ category: string; totalAmount: number }>,
  colors: string[]
): ChartConfig {
  return data.reduce((config, item, index) => {
    config[convertToCamelCase(item.category)] = {
      label: convertToCamelCase(item.category),
      color: colors[index],
    };
    return config;
  }, {} as ChartConfig);
}

function generateDonutChartConfig(
  data: Array<{ _id: string; totalAmount: number }>,
  colors: string[]
): ChartConfig {
  return data.reduce((config, item, index) => {
    config[convertToCamelCase(item._id)] = {
      label: convertToCamelCase(item._id),
      color: colors[index],
    };
    return config;
  }, {} as ChartConfig);
}

interface PieChartDataItem {
  category: string;
  totalAmount: number;
  fill: string;
}

function generatePieChartData(
  data: Array<{ category: string; totalAmount: number }>
): PieChartDataItem[] {
  return data.map((item) => ({
    ...item,
    category: convertToCamelCase(item.category),
    fill: `var(--color-${convertToCamelCase(item.category)})`,
  }));
}

interface DonutChartDataItem {
  _id: string;
  totalAmount: number;
  fill: string;
}

function generateDonutChartData(
  data: Array<{ _id: string; totalAmount: number }>
): DonutChartDataItem[] {
  return data.map((item) => ({
    ...item,
    _id: convertToCamelCase(item._id),
    fill: `var(--color-${convertToCamelCase(item._id)})`,
  }));
}

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
    const colors = [
      "hsl(12 76% 61%)",
      "hsl(173 58% 39%)",
      "hsl(197 37% 24%)",
      "hsl(43 74% 66%)",
      "hsl(27 87% 67%)",
    ];

    // Define the base hues for the palette
    const hues = [12, 173, 197, 43, 27]; // Red-Orange, Green, Blue, Yellow-Orange, Red-Orange

    // Define ranges for saturation and lightness
    const saturationRange = [58, 87]; // Between 58% and 87% saturation
    const lightnessRange = [24, 66]; // Between 24% and 67% lightness

    // Generate the specified number of colors
    for (let i = 1; i <= n; i++) {
      // Select the hue based on the index, wrapping around using modulo
      const hue = hues[(i - 1) % hues.length];

      // Randomize saturation and lightness within the defined ranges
      const saturation =
        Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) +
        saturationRange[0];
      const lightness =
        Math.floor(Math.random() * (lightnessRange[1] - lightnessRange[0])) +
        lightnessRange[0];

      // Create the HSL color and add to the array
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

  const colors = generateUniqueColors(categoryExp.length);

  const [budgets, setBudget] = useState<Budget[] | null>(null);
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
      } catch (err: any) {
        setBudgetError(err.message);
      } finally {
        setBudgetLoading(false);
      }
    };
    fetchMonthlyBudget();
  }, []);

  const [budgetsData, setBudgetsData] = useState<any[]>([]);
  const [thisMonthBudget, setThisMonthBudget] = useState<thisMonthBudget[]>([]);
  const [budgetDataLoading, setBudgetDataLoading] = useState(true);
  const [budgetDataError, setBudgetDataError] = useState<string | null>(null);
  useEffect(() => {
    const fetchThisMonthBudget = async () => {
      try {
        const res = await fetch(`/api/budgets/this-month`);
        const data = await res.json();
        //console.log("This Month Budget:", data);

        setThisMonthBudget(data);
        if (data) {
          const total = data[0]?.budget ?? 0;
          // console.log(total);
          const spentPercentage = ((data[0]?.spent ?? 0) / total) * 100;
          // console.log(spentPercentage);
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
        setBudgetDataError(err.message);
      } finally {
        setBudgetDataLoading(false);
      }
    };
    fetchThisMonthBudget();
  }, []);

  // console.log(thisMonthBudget.length);

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

  let invColors: string[] = [];
  if (investments) {
    invColors = generateUniqueColors(investments.length) as string[];
  }

  const piechartConfig = generatePieChartConfig(categoryExp, colors);
  const pieChartData = generatePieChartData(categoryExp);

  const donutChartConfig = generateDonutChartConfig(
    investments || [],
    invColors
  );
  const donutChartData = generateDonutChartData(investments || []);
  console.log(donutChartConfig);

  return (
    <section className=" mt-5">
      <h2 className="text-[26px] font-bold">Analytics</h2>
      <div className="mt-5">
        <div className="flex gap-5 flex-col lg:flex-row ">
          <div className="flex gap-5 flex-col  md:flex-row lg:w-1/2 ">
            <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-1/2">
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
            <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-1/2 ">
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
          </div>
          <div className="flex gap-5 flex-col md:flex-row lg:w-1/2 ">
            <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-1/2 ">
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
            <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-1/2 ">
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
      </div>

      <div className="mt-5">
        <div className="flex gap-5 flex-col md:flex-row">
          <div className=" border rounded-lg bg-white pt-4  pb-12 sm:pb-7 md:w-1/2">
            <p className="text-xl font-semibold px-7">Monthly Expenses Trend</p>
            {loading ? (
              <p className="px-7">Loading expenses...</p> // Loading state
            ) : error ? (
              <p className="px-7">Error: {error}</p> // Error state
            ) : !expenses || expenses.length === 0 ? (
              <p className="px-7">- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <div className="pr-7">
                <p className="text-base text-slate-500 pb-2 px-7">
                  Your spending pattern over the time
                </p>
                {/* <ResponsiveContainer>
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
                </ResponsiveContainer> */}
                <Card className="border-0 shadow-none pt-5">
                  {/* <CardHeader>
                    <CardTitle>Line Chart - Dots</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                  </CardHeader> */}
                  <CardContent>
                    <ChartContainer config={lineChartConfig}>
                      <ResponsiveContainer>
                        <LineChart
                          accessibilityLayer
                          data={monthlyExpense}
                          margin={{
                            left: -20,
                            right: 12,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <YAxis />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Line
                            dataKey="expense"
                            type="monotone"
                            stroke="var(--color-expense)"
                            strokeWidth={2}
                            dot={{
                              fill: "var(--color-expense)",
                            }}
                            activeDot={{
                              r: 6,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                  {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter> */}
                </Card>
              </div>
            )}
          </div>
          <div className=" border rounded-lg bg-white p-4 px-7 pb-12 md:w-1/2">
            <p className="text-xl font-semibold">Expenses by Category</p>
            {categoryloading ? (
              <p>Loading expenses...</p> // Loading state
            ) : categoryError ? (
              <p>Error: {categoryError}</p> // Error state
            ) : !categoryExp || categoryExp.length === 0 ? (
              <p>- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <>
                <p className="text-base text-slate-500 pb-2">
                  Breakdown of your this month's expenses by category
                </p>
                <div>
                  {/* <ResponsiveContainer>
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
                        {categoryExp.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer> */}
                  <Card className="border-0 shadow-none  ">
                    {/* <CardHeader className="items-center pb-0">
                      <CardTitle>Pie Chart - Label</CardTitle>
                      <CardDescription>January - June 2024</CardDescription>
                    </CardHeader> */}
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={piechartConfig}
                        className="mx-auto aspect-square max-h-[250px] lg:max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                      >
                        <PieChart>
                          <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={pieChartData}
                            dataKey="totalAmount"
                            label
                            nameKey="category"
                          />
                          <ChartLegend
                            content={<ChartLegendContent nameKey="category" />}
                            className="translate-y-2 flex-wrap gap-2 text-sm [&>*]:basis-1/4 [&>*]:justify-center"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                    {/* <CardFooter className="flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        Trending up by 5.2% this month{" "}
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                      </div>
                    </CardFooter> */}
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
        <div className=" pt-5">
          <div className=" border rounded-lg bg-white p-4 px-7 w-full ">
            <span className="text-xl font-semibold">Remaining Budget: </span>
            {budgetDataLoading ? (
              <p>Loading budgets...</p> // Loading state
            ) : budgetDataError ? (
              <p>Error: {budgetDataError}</p> // Error state
            ) : !thisMonthBudget || thisMonthBudget.length === 0 ? (
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
                      innerRadius="65"
                      outerRadius="125"
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
                      height="120%"
                      viewBox="55 80 200 204"
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
                  <span className=" text-black text-sm">
                    <div className="h-2 w-2 shrink-0 rounded-[2px] bg-[#FF8042] inline-block mr-1"></div>{" "}
                    spent - <span className=" font-serif">₹</span>
                    {thisMonthBudget[0]?.spent ?? 0}
                  </span>
                </div>
                <div className="text-center">
                  <span className=" text-black text-sm">
                    <div className="h-2 w-2 shrink-0 rounded-[2px] bg-[#00C49F] inline-block mr-1"></div>{" "}
                    remaining - <span className=" font-serif">₹</span>
                    {(thisMonthBudget[0]?.remaining ?? 0) <= 0 ? (
                      <>
                        {thisMonthBudget[0]?.remaining ?? 0}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          budget limit exceeded!!
                        </div>
                      </>
                    ) : (thisMonthBudget[0]?.remaining ?? 0) > 0 &&
                      ((thisMonthBudget[0]?.remaining ?? 0) * 100) /
                        (thisMonthBudget[0]?.budget ?? 0) <=
                        10 ? (
                      <>
                        {thisMonthBudget[0]?.remaining ?? 0}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          about to run out of budget! spend wisely!!
                        </div>
                      </>
                    ) : (
                      thisMonthBudget[0].remaining ?? 0
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
              <div>
                <p className="text-base text-slate-500 pb-2">
                  Breakdown of your total investment
                </p>
                <div>
                  {/* <ResponsiveContainer>
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
                        {investments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={invColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer> */}
                  <Card className="border-0 shadow-none">
                    {/* <CardHeader className="items-center pb-0">
                      <CardTitle>Pie Chart - Donut with Text</CardTitle>
                      <CardDescription>January - June 2024</CardDescription>
                    </CardHeader> */}
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={donutChartConfig}
                        className="mx-auto aspect-square max-h-[250px] lg:max-h-[300px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={donutChartData}
                            dataKey="totalAmount"
                            nameKey="_id"
                            innerRadius={60}
                            outerRadius={90}
                            strokeWidth={5}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-[26px] font-bold font-mono"
                                      >
                                        ₹{totalInvestment}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground text-[13px]"
                                      >
                                        Investments
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="_id" />}
                            className="-translate-y-2 flex-wrap gap-2 text-sm [&>*]:basis-1/4 [&>*]:justify-center"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                    {/* <CardFooter className="flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        Trending up by 5.2% this month{" "}
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                      </div>
                    </CardFooter> */}
                  </Card>
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
