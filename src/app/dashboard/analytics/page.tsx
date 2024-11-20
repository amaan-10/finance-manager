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

type Budget = {
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

// app/dashboard/page.tsx
export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses/category`);
        const data = await res.json();
        //console.log("Monthly Expenses:", data);
        setCategoryExpenses(data);
      } catch (err: any) {
        setCategoryError(err.message);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchMonthlyExpenses();
  }, []);
  const categoryExp = (categoryExpenses || []).map((item) => ({
    ...item,
  }));
  //   console.log(categoryExp);

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
        //console.log(data);
        setBudget(data);
        const total = data[0].budget;
        const spentPercentage = (data[0].spent / total) * 100;
        const remainingPercentage = (data[0].remaining / total) * 100;
        //console.log(data[0].budget);

        setBudgetsData([
          { name: "Spent", value: spentPercentage },
          {
            name: "Remaining",
            value: remainingPercentage < 0 ? 0 : remainingPercentage,
          },
        ]);
      } catch (err: any) {
        setBudgetError(err.message);
      } finally {
        setBudgetLoading(false);
      }
    };
    fetchMonthlyBudget();
  }, []);

  //console.log(budgetsData[0]);

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
        console.log("Total Investment:", data);
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
      <h2 className=" text-2xl font-semibold">Analytics</h2>

      <div className="mt-2">
        <div className="flex gap-5 flex-col md:flex-row">
          <div className=" border rounded-lg bg-white p-4 px-7 pb-12 sm:pb-7 md:w-3/4 lg:w-1/2">
            <p className="text-lg font-medium">Monthly Expenses Trend</p>
            {loading ? (
              <p>Loading expenses...</p> // Loading state
            ) : error ? (
              <p>Error: {error}</p> // Error state
            ) : !expenses || expenses.length === 0 ? (
              <p>- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <div className="h-[350px] ">
                <p className="text-sm text-slate-500 pb-2">
                  Your spending pattern over the time
                </p>
                <ResponsiveContainer>
                  <LineChart data={monthlyExpense}>
                    <Line type="monotone" dataKey="expense" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
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
            <p className="text-lg font-medium">Expenses by Category</p>
            {categoryloading ? (
              <p>Loading expenses...</p> // Loading state
            ) : categoryError ? (
              <p>Error: {categoryError}</p> // Error state
            ) : !categoryExp || categoryExp.length === 0 ? (
              <p>- No expenses found.</p> // No data found
            ) : (
              // Render expense list if data exists
              <div className="h-[350px] ">
                <p className="text-sm text-slate-500 pb-2">
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
        <div className=" pt-3">
          <div className=" border rounded-lg bg-white p-4 px-7 w-full ">
            <span className="text-lg font-medium">Remaining Budget: </span>
            {budgetLoading ? (
              <p>Loading budgets...</p> // Loading state
            ) : budgetError ? (
              <p>Error: {budgetError}</p> // Error state
            ) : !budgets ? (
              <p>- No budget set for this month.</p> // No data found
            ) : (
              <div className="h-[325px] ">
                <p className="text-sm text-slate-500 pb-2">
                  Breakdown of your this month's expenses by category
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
                    {budgets[0].spent}
                  </span>
                </div>
                <div className="text-center">
                  <span className=" text-[#00C49F] text-lg">
                    ● remaining - <span className=" font-serif">₹</span>
                    {budgets[0].remaining <= 0 ? (
                      <>
                        {budgets[0].remaining}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          budget limit exceeded!!
                        </div>
                      </>
                    ) : budgets[0].remaining > 0 &&
                      (budgets[0].remaining * 100) / budgets[0].budget <= 10 ? (
                      <>
                        {budgets[0].remaining}
                        <div className=" text-red-600 font-semibold animate-pulse">
                          about to run out of budget! spend wisely!!
                        </div>
                      </>
                    ) : (
                      budgets[0].remaining
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" pt-3">
          <div className=" border rounded-lg bg-white p-4 px-7 w-full">
            <span className="text-lg font-medium">Total Investments: </span>
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
                <p className="text-sm text-slate-500 pb-2">
                  Breakdown of your this month's expenses by category
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
