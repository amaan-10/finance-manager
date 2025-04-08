"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Plus,
  TrendingUp,
  Wallet,
  Calendar,
  BarChart3,
  ArrowRight,
  RefreshCw,
  HandCoins,
  IndianRupee,
  LucideIcon,
  Utensils,
  ShoppingCart,
  Car,
  Clapperboard,
  Shirt,
  Lightbulb,
  Home,
  HeartPulse,
  BookOpen,
  Plane,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface Expense {
  totalAmount: number;
  _id: {
    month: number;
    year: number;
  };
}

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

type Transaction = {
  id: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
};

type InsightType = "warning" | "success" | "info";

type FinancialInsight = {
  id: number;
  title: string;
  type: InsightType;
  action: string;
};

// Helper function to get month name
const getMonthName = (month: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function FinanceDashboard() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const { user, isLoaded } = useUser();

  const [budgets, setBudget] = useState<Budget | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const [investments, setInvestment] = useState<Investment[] | null>(null);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [allInvestments, setAllInvestment] = useState<any[]>([]);
  const [investmentLoading, setInvestmentLoading] = useState(true);
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  const fetchData = async () => {
    setRefreshing(true);

    try {
      // Fetch expenses
      const expensesRes = await fetch(`/api/expenses/monthly`);
      const expensesData = await expensesRes.json();
      setExpenses(expensesData);

      // Fetch all expenses transactions
      const TransactionRes = await fetch("/api/expenses");
      const TransactionData = await TransactionRes.json();
      setTransactions(TransactionData);
      const sortedTransactions = TransactionData.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 4);
      setRecentTransactions(sortedTransactions);

      // Fetch budget
      const budgetRes = await fetch(`/api/budgets/this-month`);
      const budgetData = await budgetRes.json();
      setBudget(budgetData[0] || { budget: 0, spent: 0, remaining: 0 });

      // Fetch total investments
      const investmentRes = await fetch(`/api/investments/total`);
      const investmentData = await investmentRes.json();
      setInvestment(investmentData.byType);
      setTotalInvestment(Number.parseFloat(investmentData.totalAmount));

      // Fetch all investments transactions
      const allInvestmentsRes = await fetch(`/api/investments`);
      const allInvestmentsData = await allInvestmentsRes.json();
      setAllInvestment(allInvestmentsData);

      setError(null);
      setBudgetError(null);
      setInvestmentError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setBudgetLoading(false);
      setInvestmentLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Emojis for categories
  const categoryEmojis: Record<string, string> = {
    Food: "🍽️",
    Groceries: "🛒",
    Transportation: "🚗",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Utilities: "💡",
    Rent: "🏠",
    Healthcare: "🩺",
    Education: "📚",
    Travel: "✈️",
    Other: "🔖",
  };

  function getInsightsFromTransactions(
    transactions: Transaction[]
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    if (!transactions || transactions.length === 0) {
      return [
        {
          id: 1,
          title: "No transactions available for analysis.",
          type: "info",
          action: "Info",
        },
      ];
    }

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    let smallTxnCount = 0;

    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      const isThisMonth =
        txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear;

      if (!isThisMonth) continue;

      if (txn.type === "Income") {
        totalIncome += txn.amount;
      }

      if (txn.type === "Expense") {
        totalExpense += txn.amount;
        categoryTotals[txn.category] =
          (categoryTotals[txn.category] || 0) + txn.amount;

        if (txn.amount < 100) smallTxnCount++;
      }
    }

    // 🔶 Overspending
    if (totalExpense > totalIncome) {
      insights.push({
        id: 2,
        title: `Your expenses exceeded your income by ₹${(
          totalExpense - totalIncome
        ).toFixed(2)} this month.`,
        type: "warning",
        action: "Review",
      });
    } else if (totalIncome > 0) {
      insights.push({
        id: 3,
        title: `Great job! You saved ₹${(totalIncome - totalExpense).toFixed(
          2
        )} this month.`,
        type: "success",
        action: "Good",
      });
    }

    // 🔶 High Spending Category
    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );
    const top = sortedCategories[0];
    if (top && top[1] > totalExpense * 0.3) {
      insights.push({
        id: 4,
        title: `You've spent over 30% of your monthly expenses on ${
          top[0]
        } (₹${top[1].toFixed(2)}).`,
        type: "warning",
        action: "Monitor",
      });
    }

    // 🔶 Frequent Small Expenses
    if (smallTxnCount > 5) {
      insights.push({
        id: 5,
        title: `You've made ${smallTxnCount} small purchases under ₹100 this month. They add up quickly!`,
        type: "info",
        action: "Tip",
      });
    }

    // 🔶 Entertainment Spending
    if (
      categoryTotals["Entertainment"] &&
      categoryTotals["Entertainment"] > 1000
    ) {
      insights.push({
        id: 6,
        title: `You spent over ₹1,000 on Entertainment. Maybe set a fun limit next month?`,
        type: "info",
        action: "Suggestion",
      });
    }

    // 🔶 Healthcare spending missing
    if (!categoryTotals["Healthcare"]) {
      insights.push({
        id: 7,
        title: `No Healthcare spending recorded this month — don't skip checkups!`,
        type: "info",
        action: "Reminder",
      });
    }

    // ✅ Default fallback
    if (insights.length === 0) {
      insights.push({
        id: 8,
        title: "🎉 You're on track! Your spending looks balanced this month.",
        type: "success",
        action: "Well done",
      });
    }

    return insights;
  }

  const financialInsights = getInsightsFromTransactions(transactions);

  // Prepare chart data
  const expenseChartData =
    expenses?.map((expense) => ({
      name: `${getMonthName(expense._id.month)} ${expense._id.year}`,
      amount: expense.totalAmount,
    })) || [];

  const investmentChartData =
    investments?.map((investment) => ({
      name: investment._id,
      value: investment.totalAmount,
    })) || [];

  // Calculate total expenses for the current month
  const currentMonthExpense =
    expenses?.find((expense) => {
      const now = new Date();
      return (
        expense._id.month === now.getMonth() + 1 &&
        expense._id.year === now.getFullYear()
      );
    })?.totalAmount || 0;

  const pieData = transactions.slice(0, 5).map((txn) => ({
    ...txn,
    name: txn.category, // for the legend
  }));

  const InvestmentPerformanceChartData =
    Object.values(
      allInvestments?.reduce((acc, investment) => {
        const date = new Date(investment.date);
        const monthIndex = date.getMonth();
        const monthName = getMonthName(monthIndex + 1).slice(0, 3);

        if (!acc[monthName]) {
          acc[monthName] = { month: monthName, value: 0 };
        }

        acc[monthName].value += investment.amount;
        return acc;
      }, {} as Record<string, { month: string; value: number }>)
    ) || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto pt-32 pb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-sky-700 via-indigo-800 to-fuchsia-700 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {isLoaded && user
              ? `Welcome back, ${user.firstName || "User"}!`
              : "Loading user..."}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 md:mt-0 flex space-x-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-br from-sky-700 via-indigo-800 to-fuchsia-700 hover:from-sky-600 hover:via-indigo-700 hover:to-fuchsia-600
"
              >
                <Plus className="h-4 w-4 mr-1" /> Add New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/finance/expenses"
                  className="flex items-center w-full"
                >
                  <Wallet className="h-4 w-4 mr-2" /> Add Expense
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/finance/investments"
                  className="flex items-center w-full"
                >
                  <TrendingUp className="h-4 w-4 mr-2" /> Add Investment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/finance/budgets"
                  className="flex items-center w-full"
                >
                  <HandCoins className="h-4 w-4 mr-2" /> Set Budget
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <motion.div variants={itemVariants} className="mb-6">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px] bg-slate-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Monthly Expense Card */}
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50 z-0"></div> */}
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center text-violet-700">
                      <Wallet className="h-5 w-5 mr-2" />
                      Monthly Expenses
                    </CardTitle>
                    <CardDescription>Your spending this month</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {loading ? (
                      <Skeleton className="h-12 w-32 rounded-md" />
                    ) : (
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-violet-700">
                          {formatCurrency(currentMonthExpense)}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-500 font-medium">+12%</span>
                          <span className="text-gray-500 ml-1">
                            vs last month
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 flex justify-between items-center">
                    <Link
                      href="/finance/expenses"
                      className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center"
                    >
                      View Details <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                    <Badge
                      variant="outline"
                      className="bg-violet-100 text-violet-700 hover:bg-violet-200"
                    >
                      <Calendar className="h-3 w-3 mr-1" /> This Month
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Budget Card */}
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-50 z-0"></div> */}
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center text-emerald-700">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Budget Status
                    </CardTitle>
                    <CardDescription>
                      Your monthly budget progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {budgetLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-32 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="text-3xl font-bold text-emerald-700">
                              {formatCurrency(budgets?.remaining || 0)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Total Budget
                            </p>
                            <p className="text-xl font-semibold text-gray-700">
                              {formatCurrency(budgets?.budget || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Used: {formatCurrency(budgets?.spent || 0)}
                            </span>
                            <span className="font-medium">
                              {budgets?.budget
                                ? Math.round(
                                    (budgets.spent / budgets.budget) * 100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              budgets?.budget
                                ? (budgets.spent / budgets.budget) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 flex justify-between items-center">
                    <Link
                      href="/finance/budgets"
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center"
                    >
                      Manage Budget <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    >
                      <IndianRupee className="h-3 w-3 mr-1" /> Budget
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Investments Card */}
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-50 z-0"></div> */}
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center text-yellow-700">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Investments
                    </CardTitle>
                    <CardDescription>Your investment portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {investmentLoading ? (
                      <Skeleton className="h-12 w-32 rounded-md" />
                    ) : (
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-yellow-700">
                          {formatCurrency(totalInvestment)}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            +8.2%
                          </span>
                          <span className="text-gray-500 ml-1">growth</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 flex justify-between items-center">
                    <Link
                      href="/finance/investments"
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center"
                    >
                      View Portfolio <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" /> Portfolio
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expense Trend Chart */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Expense Trends</CardTitle>
                    <CardDescription>
                      Your spending patterns over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                          <Skeleton className="h-[200px] w-full rounded-md" />
                          <span className="mt-4 text-sm text-gray-400">
                            Loading chart data...
                          </span>
                        </div>
                      </div>
                    ) : expenseChartData.length === 0 ? (
                      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
                        No expense data available
                      </div>
                    ) : (
                      <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={expenseChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorExpense"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8884d8"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8884d8"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              opacity={0.3}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) =>
                                value.split(" ")[0].substring(0, 3)
                              }
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) => `₹${value / 1000}k`}
                            />
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Amount"]}
                              labelFormatter={(label) => `${label}`}
                              contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              stroke="#8884d8"
                              fillOpacity={1}
                              fill="url(#colorExpense)"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Your latest financial activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-4"
                            >
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          ))
                      ) : recentTransactions.length === 0 ? (
                        <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
                          No recent transactions available
                        </div>
                      ) : (
                        <>
                          {recentTransactions.map((transaction) => (
                            <motion.div
                              key={transaction._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                <span>
                                  {categoryEmojis[transaction.category]}
                                </span>
                              </div>
                              <div className="ml-4 flex-grow">
                                <p className="text-sm font-medium">
                                  {transaction.category}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDistanceToNow(
                                    new Date(transaction.date),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">
                                  ₹{transaction.amount.toLocaleString()}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => {
                        window.open("/finance/expenses", "_self");
                      }}
                    >
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Financial Insights */}
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>
                    Smart observations about your finances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {financialInsights.map((insight) => (
                      <div
                        key={insight.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          insight.type === "warning"
                            ? "border-amber-500 bg-amber-50"
                            : insight.type === "success"
                            ? "border-green-500 bg-green-50"
                            : "border-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">{insight.title}</p>
                          <Badge
                            variant="outline"
                            className={`
          ${
            insight.type === "warning"
              ? "bg-amber-100 text-amber-700"
              : insight.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }
        `}
                          >
                            {insight.action}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Expenses Tab Content */}
          <TabsContent value="expenses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                      How you're spending your money
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="amount"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {transactions.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(amount) => [`₹${amount}`, "Amount"]}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Comparison */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Monthly Comparison</CardTitle>
                    <CardDescription>
                      Compare your monthly expenses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Jan", current: 4000, previous: 3500 },
                            { name: "Feb", current: 3000, previous: 3200 },
                            { name: "Mar", current: 2000, previous: 2800 },
                            { name: "Apr", current: 2780, previous: 2500 },
                            { name: "May", current: 1890, previous: 2100 },
                            { name: "Jun", current: 2390, previous: 2000 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            opacity={0.3}
                          />
                          <XAxis dataKey="name" />
                          <YAxis
                            tickFormatter={(value) => `₹${value / 1000}k`}
                          />
                          <Tooltip
                            formatter={(value) => [`₹${value}`, "Amount"]}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="current"
                            name="This Year"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="previous"
                            name="Last Year"
                            fill="#82ca9d"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Expense List */}
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Expense History</CardTitle>
                    <CardDescription>
                      Your recent expense transactions
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))
                    ) : expenses && expenses.length > 0 ? (
                      expenses.map((expense, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {getMonthName(expense._id.month)}{" "}
                                {expense._id.year}
                              </p>
                              <p className="text-sm text-gray-500">
                                Monthly total
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency(expense.totalAmount)}
                            </p>
                            <Link
                              href={`/finance/expenses/${expense._id.month}-${expense._id.year}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Details
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <p>No expense records found</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Link href="/finance/expenses">
                            Add Your First Expense
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Link
                      href="/finance/expenses"
                      className="flex items-center"
                    >
                      View All Expenses <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Investments Tab Content */}
          <TabsContent value="investments" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Distribution */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Investment Distribution</CardTitle>
                    <CardDescription>Your portfolio allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {investmentLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                          <Skeleton className="h-[200px] w-full rounded-md" />
                          <span className="mt-4 text-sm text-gray-400">
                            Loading investment data...
                          </span>
                        </div>
                      </div>
                    ) : !investments || investments.length === 0 ? (
                      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
                        No investment data available
                      </div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={investmentChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {investmentChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Amount"]}
                              contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Investment Performance */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Investment Performance</CardTitle>
                    <CardDescription>Growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {investmentLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                          <Skeleton className="h-[200px] w-full rounded-md" />
                          <span className="mt-4 text-sm text-gray-400">
                            Loading investment data...
                          </span>
                        </div>
                      </div>
                    ) : !allInvestments || allInvestments.length === 0 ? (
                      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
                        No investment data available
                      </div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={InvestmentPerformanceChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorInvestment"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#82ca9d"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#82ca9d"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              opacity={0.3}
                            />
                            <XAxis dataKey="month" />
                            <YAxis
                              tickFormatter={(value) => `₹${value / 1000}k`}
                            />
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Value"]}
                              contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                padding: "10px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#82ca9d"
                              fillOpacity={1}
                              fill="url(#colorInvestment)"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Investment List */}
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Investment Portfolio</CardTitle>
                    <CardDescription>Your investment holdings</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open("/finance/investments", "_self");
                    }}
                  >
                    Add Investment
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investmentLoading ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))
                    ) : !investments || investments.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p>No investment records found</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Link href="/finance/investments">
                            Add Your First Investment
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      investments.map((investment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{investment._id}</p>
                              <p className="text-sm text-gray-500">
                                Investment type
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency(investment.totalAmount)}
                            </p>
                            <div className="flex items-center justify-end text-sm text-green-600">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              <span>+8.2%</span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                  >
                    <Link
                      href="/finance/investments"
                      className="flex items-center"
                    >
                      View Full Portfolio{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
